(() => {
  const input = document.querySelector('#ksbInput');
  if (!input || document.querySelector('#standardUrl')) return;

  const style = document.createElement('style');
  style.textContent = `
    .url-import{margin:14px 0;padding:14px;border:1px solid rgba(170,35,35,.16);border-radius:18px;background:rgba(255,248,247,.72)}
    .url-import label{display:block;font-size:.82rem;font-weight:700;margin-bottom:7px}
    .url-row{display:flex;gap:8px;align-items:stretch}.url-row input{flex:1;min-width:0}
    .url-row button{white-space:nowrap}.url-status{font-size:.78rem;margin:8px 2px 0;min-height:1.1em;color:#6b5555}.url-status.ok{color:#19724a}.url-status.error{color:#a32121}
    .url-import small{display:block;color:#776b6b;margin-top:6px;line-height:1.35}
  `;
  document.head.appendChild(style);

  const box = document.createElement('div');
  box.className = 'url-import';
  box.innerHTML = `
    <label for="standardUrl">Or paste a standard website link</label>
    <div class="url-row">
      <input id="standardUrl" type="url" inputmode="url" placeholder="https://skillsengland.education.gov.uk/apprenticeships/..." autocomplete="off">
      <button id="readStandard" class="secondary" type="button">Read standard</button>
    </div>
    <small>Naxos reads the page, extracts the course details and KSB criteria, then fills the course builder for you.</small>
    <div id="urlStatus" class="url-status" aria-live="polite"></div>
  `;
  input.parentElement.insertAdjacentElement('beforebegin', box);

  const status = document.querySelector('#urlStatus');
  const button = document.querySelector('#readStandard');
  const urlInput = document.querySelector('#standardUrl');

  function setStatus(message, type='') {
    status.textContent = message;
    status.className = `url-status ${type}`;
  }

  function cleanText(text) {
    return String(text || '')
      .replace(/\r/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_`#>]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function findValue(text, labels) {
    for (const label of labels) {
      const re = new RegExp(`${label}\\s*[:\\-]\\s*([^\\n]{1,100})`, 'i');
      const m = text.match(re);
      if (m) return cleanText(m[1]);
    }
    return '';
  }

  function extractKSB(text) {
    const rows = [];
    const lines = String(text || '').replace(/\r/g, '').split('\n');
    const seen = new Set();
    for (let i = 0; i < lines.length; i++) {
      const line = cleanText(lines[i]);
      const m = line.match(/\b([KSB])\s*([0-9]{1,3})\s*[:\-–—]\s*(.+)$/i);
      if (!m) continue;
      const ref = `${m[1].toUpperCase()}${m[2]}`;
      let desc = m[3].trim();
      if (desc.length < 20 && lines[i + 1]) desc += ' ' + cleanText(lines[i + 1]);
      if (!seen.has(ref)) {
        seen.add(ref);
        rows.push(`${ref} - ${desc}`);
      }
    }
    return rows;
  }

  async function readStandard() {
    const url = urlInput.value.trim();
    if (!/^https?:\/\//i.test(url)) {
      setStatus('Enter a full http:// or https:// website link.', 'error');
      return;
    }

    button.disabled = true;
    button.textContent = 'Reading…';
    setStatus('Reading the standard and extracting its KSBs…');

    try {
      // Jina Reader converts public web pages to clean markdown and is used here
      // because Naxos is also deployed as a static GitHub Pages application.
      const readerUrl = `https://r.jina.ai/${url}`;
      const response = await fetch(readerUrl, { headers: { Accept: 'text/plain' } });
      if (!response.ok) throw new Error(`Reader returned ${response.status}`);
      const markdown = await response.text();
      if (!markdown || markdown.length < 200) throw new Error('The page returned too little content.');

      const title = findValue(markdown, ['Title of occupation', 'Occupation title', 'Title']) ||
        cleanText((markdown.match(/^#\s+(.+)$/m) || [,''])[1]);
      const reference = findValue(markdown, ['Reference Number', 'Reference', 'UOS reference number']);
      const version = findValue(markdown, ['Version']);
      const level = findValue(markdown, ['Level of occupation', 'Level']);
      const duration = findValue(markdown, ['Typical duration of apprenticeship', 'Typical duration']);
      const rows = extractKSB(markdown);

      if (!rows.length) throw new Error('No KSB criteria could be detected on that page. Try the occupational standard page or paste the KSBs manually.');

      const set = (id, value) => { const el = document.querySelector(`#${id}`); if (el && value) el.value = value; };
      set('courseTitle', title);
      set('courseRef', reference);
      set('courseVersion', version);
      set('courseLevel', level.replace(/^Level\s*/i, ''));
      set('courseDuration', duration);
      input.value = rows.join('\n');

      setStatus(`Imported ${rows.length} KSB criteria${title ? ` from ${title}` : ''}. Check the preview, then continue.`, 'ok');
    } catch (error) {
      console.error(error);
      setStatus(`Could not read that page. ${error.message || 'Try another public standard URL.'}`, 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Read standard';
    }
  }

  button.addEventListener('click', readStandard);
  urlInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); readStandard(); }
  });
})();
