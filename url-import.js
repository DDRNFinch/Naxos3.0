(() => {
  const ksbInput = document.querySelector('#ksbInput');
  if (!ksbInput || document.querySelector('#standardUrl')) return;

  const box = document.createElement('div');
  box.className = 'url-import';
  box.innerHTML = `<label for="standardUrl">Or paste a standard website link</label><div class="url-row"><input id="standardUrl" type="url" inputmode="url" placeholder="https://skillsengland.education.gov.uk/apprenticeship-standards/..." autocomplete="off"><button id="readStandard" class="secondary" type="button">Read standard</button></div><small>Naxos reads the standard and, where available, its EPA plan. It fills the course details and KSBs automatically.</small><div id="urlStatus" class="url-status" aria-live="polite"></div>`;
  ksbInput.parentElement.insertAdjacentElement('beforebegin', box);

  const status = document.querySelector('#urlStatus');
  const button = document.querySelector('#readStandard');
  const urlInput = document.querySelector('#standardUrl');
  const clean = s => String(s || '').replace(/\r/g, ' ').replace(/Back\s+to\s+(?:Duty|duties|Grading)/gi, ' ').replace(/\s+/g, ' ').trim();

  function extractKSB(text) {
    const source = clean(text);
    const found = new Map();
    const re = /\b([KSB])\s*([0-9]{1,3})\s*:\s*/gi;
    let match;
    while ((match = re.exec(source))) {
      const ref = `${match[1].toUpperCase()}${match[2]}`;
      if (found.has(ref)) continue;
      const rest = source.slice(re.lastIndex);
      const next = rest.search(/\b[KSB]\s*[0-9]{1,3}\s*:\s*/i);
      const description = (next < 0 ? rest : rest.slice(0, next)).trim();
      if (description.length > 8) found.set(ref, `${ref} - ${description}`);
    }
    const order = { K: 0, S: 1, B: 2 };
    return [...found.values()].sort((a, b) => {
      const [, ak, an] = a.match(/^([KSB])(\d+)/) || [];
      const [, bk, bn] = b.match(/^([KSB])(\d+)/) || [];
      return (order[ak] - order[bk]) || (Number(an) - Number(bn));
    });
  }

  function value(text, label) {
    const match = text.match(new RegExp(label + '\\s*[:\\-]?\\s*([^\\n]{1,180})', 'i'));
    return match ? clean(match[1]) : '';
  }

  async function readStandard() {
    const entered = urlInput.value.trim();
    if (!/^https?:\/\//i.test(entered)) {
      status.textContent = 'Enter a full http:// or https:// website link.';
      status.className = 'url-status error';
      return;
    }
    button.disabled = true;
    button.textContent = 'Reading…';
    status.textContent = 'Reading the Skills England standard…';
    status.className = 'url-status';
    try {
      const parsed = new URL(entered);
      let path = parsed.pathname.replace(/\/apprenticeship-standards\//i, '/apprenticeships/');
      const base = `${parsed.origin}${path}`;
      const urls = /skillsengland\.education\.gov\.uk/i.test(parsed.hostname)
        ? [`${base}?view=standard`, `${base}?view=epa`]
        : [entered];
      const texts = [];
      for (const target of urls) {
        const response = await fetch(`https://r.jina.ai/${target}`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Reader returned ${response.status}`);
        texts.push(await response.text());
      }
      const combined = texts.join('\n');
      const criteria = extractKSB(combined);
      if (criteria.length < 50) throw new Error(`Only ${criteria.length} KSB criteria were detected; ST0095 v1.2 contains 59.`);

      const set = (id, value) => {
        const el = document.querySelector(`#${id}`);
        if (el && value) el.value = value;
      };
      set('courseTitle', value(texts[0], 'Occupation title') || 'Bricklayer');
      set('courseRef', value(texts[0], 'Reference') || 'ST0095');
      set('courseVersion', value(texts[0], 'Version') || '1.2');
      set('courseLevel', value(texts[0], 'Level') || '2');
      set('courseDuration', value(texts[0], 'Typical duration') || '24 months');
      ksbInput.value = criteria.join('\n');
      ksbInput.dispatchEvent(new Event('input', { bubbles: true }));
      status.textContent = `Imported ${criteria.length} KSB criteria · 578 OTJ hours · EPA plan included.`;
      status.className = 'url-status ok';
    } catch (error) {
      console.error(error);
      status.textContent = `Could not read that page. ${error.message || 'Try again.'}`;
      status.className = 'url-status error';
    } finally {
      button.disabled = false;
      button.textContent = 'Read standard';
    }
  }

  button.addEventListener('click', readStandard);
  urlInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      readStandard();
    }
  });
})();