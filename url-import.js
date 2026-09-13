(() => {
  const input = document.querySelector('#ksbInput');
  if (!input || document.querySelector('#standardUrl')) return;

  const style = document.createElement('style');
  style.textContent = `
    .url-import{margin:14px 0;padding:14px;border:1px solid rgba(170,35,35,.16);border-radius:18px;background:rgba(255,248,247,.72)}
    .url-import label{display:block;font-size:.82rem;font-weight:700;margin-bottom:7px}
    .url-row{display:flex;gap:8px;align-items:stretch}.url-row input{flex:1;min-width:0}.url-row button{white-space:nowrap}
    .url-status{font-size:.78rem;margin:8px 2px 0;min-height:1.1em;color:#6b5555}.url-status.ok{color:#19724a}.url-status.error{color:#a32121}
    .url-import small{display:block;color:#776b6b;margin-top:6px;line-height:1.35}
    .import-meta{margin-top:12px;display:grid;gap:6px}.import-meta .meta-row{display:flex;justify-content:space-between;gap:12px;padding:7px 9px;border-radius:10px;background:rgba(255,255,255,.7);font-size:.78rem}.import-meta .meta-row span{color:#776b6b}.import-meta .meta-row b{text-align:right}.import-meta .meta-heading{font-size:.78rem;font-weight:800;margin-top:5px}
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
    <small>Naxos reads the standard and, where available, its EPA plan. It fills the course details and KSBs automatically.</small>
    <div id="urlStatus" class="url-status" aria-live="polite"></div>
    <div id="importMeta" class="import-meta hidden"></div>
  `;
  input.parentElement.insertAdjacentElement('beforebegin', box);

  const status = document.querySelector('#urlStatus');
  const button = document.querySelector('#readStandard');
  const urlInput = document.querySelector('#standardUrl');
  const metaBox = document.querySelector('#importMeta');

  function setStatus(message, type='') { status.textContent = message; status.className = `url-status ${type}`; }

  function cleanText(text) {
    return String(text || '')
      .replace(/\r/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[\u2022* _`#>]/g, ' ')
      .replace(/\bBack\s+to\s+duty\b/gi, ' ')
      .replace(/\bBack\s+to\s+duties\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function findValue(text, labels) {
    for (const label of labels) {
      const re = new RegExp(`(?:^|\\n)\\s*${label}\\s*[:\\-]?\\s*([^\\n]{1,220})`, 'im');
      const m = text.match(re);
      if (m) return cleanText(m[1]);
    }
    return '';
  }

  // Skills England pages do not always format KSBs as "K1: ...".
  // Some use "K1 ...", and many append a "Back to duty" navigation label.
  // Collect each criterion until the next K/S/B criterion, then remove navigation text.
  function extractKSB(text) {
    const source = String(text || '').replace(/\r/g, '');
    const rows = [];
    const seen = new Set();
    const lines = source.split('\n').map(line => line.trim()).filter(Boolean);
    let current = null;

    const flush = () => {
      if (!current) return;
      let desc = cleanText(current.parts.join(' '));
      desc = desc
        .replace(/\s*Back\s+to\s+dut(?:y|ies)\s*/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      // Navigation/heading fragments occasionally survive at the end.
      desc = desc.replace(/\s+(?:Back|View)\s+(?:to|all)\s+.*$/i, '').trim();
      if (current.ref && desc.length >= 5 && !seen.has(current.ref)) {
        seen.add(current.ref);
        rows.push(`${current.ref} - ${desc}`);
      }
      current = null;
    };

    for (const rawLine of lines) {
      const line = cleanText(rawLine);
      if (!line) continue;

      // Accept K1, K 1, S1, S 1, B1, with or without :, -, en dash or em dash.
      const match = line.match(/^([KSB])\s*([0-9]{1,3})\s*(?::|[-–—])?\s*(.*)$/i);
      if (match) {
        flush();
        current = {
          ref: `${match[1].toUpperCase()}${match[2]}`,
          parts: match[3] ? [match[3]] : []
        };
        continue;
      }

      if (current) {
        // Stop a criterion if a navigation label is presented as its own line.
        if (/^back\s+to\s+dut(?:y|ies)$/i.test(line)) continue;
        current.parts.push(line);
      }
    }
    flush();

    // Fallback for pages where several KSBs are embedded in one paragraph.
    if (rows.length < 5) {
      const compact = cleanText(source);
      const re = /\b([KSB])\s*([0-9]{1,3})\s*(?::|[-–—])?\s*(.*?)(?=\b[KSB]\s*[0-9]{1,3}\s*(?::|[-–—])?\s|$)/gi;
      let m;
      while ((m = re.exec(compact))) {
        const ref = `${m[1].toUpperCase()}${m[2]}`;
        let desc = cleanText(m[3]);
        if (desc.length >= 5 && !seen.has(ref)) {
          seen.add(ref);
          rows.push(`${ref} - ${desc}`);
        }
      }
    }

    // Natural numeric ordering: K1..Kn, S1..Sn, B1..Bn.
    const order = {K: 0, S: 1, B: 2};
    rows.sort((a, b) => {
      const [, ar, an] = a.match(/^([KSB])(\d+)/) || [];
      const [, br, bn] = b.match(/^([KSB])(\d+)/) || [];
      return (order[ar] - order[br]) || (Number(an) - Number(bn));
    });
    return rows;
  }

  function extractEPA(text) {
    const methods = [];
    const re = /^\s*(?:Assessment method\s*)?(\d+)\s*[:.)-]\s*([^\n]{3,160})$/gmi;
    let m;
    while ((m = re.exec(text))) {
      const s = cleanText(m[2]);
      if (s && !methods.includes(s)) methods.push(s);
    }
    const period = (text.match(/EPA period[^\n]{0,160}?(\d+)\s*month/i) || [])[1] || '';
    const assessmentPeriod = (text.match(/assessment period[^\n]{0,160}?(\d+)\s*month/i) || [])[1] || '';
    const gateway = (text.match(/gateway requirements?[\s\S]{0,1600}?(?=Assessment method|Assessment methods|End-point assessment|$)/i) || [])[0] || '';
    const grading = (text.match(/(?:Overall )?grading[\s\S]{0,1200}?(?=Re-sits|Retakes|Roles and responsibilities|$)/i) || [])[0] || '';
    const pdf = (text.match(/https?:[^\s)]+\.pdf/i) || [])[0] || '';
    return {
      methods,
      epaPeriod: period ? `${period} months` : '',
      assessmentPeriod: assessmentPeriod ? `${assessmentPeriod} months` : '',
      gatewayRequirements: cleanText(gateway),
      grading: cleanText(grading),
      epaPlanUrl: pdf
    };
  }

  function parseStandard(text, url) {
    const m = {
      sourceUrl: url,
      importedAt: new Date().toISOString(),
      title: '', reference: '', version: '', level: '', duration: '', status: '', route: '',
      minimumHours: '', maximumFunding: '', larsCode: '', eqaProvider: '', dateUpdated: '',
      approvedForDelivery: '', options: '', regulated: '', regulator: '', professionalRecognition: '',
      entryRequirements: '', englishMaths: '', review: '', ksbs: [], epaPlan: {}
    };
    m.title = cleanText((text.match(/^#\s+(.+)$/m) || [, ''])[1]) || findValue(text, ['Occupation title', 'Title of occupation', 'Title']);
    m.reference = findValue(text, ['Reference Number', 'Reference', 'UOS reference number']) || (text.match(/Reference:\s*(ST\d+|FA\d+|AU\d+)/i) || [])[1] || '';
    m.version = findValue(text, ['Version']) || (text.match(/Version\s*:?\s*([\d.]+)/i) || [])[1] || '';
    m.level = findValue(text, ['Level of occupation', 'Occupational Level', 'Level']).replace(/^Level\s*/i, '');
    m.duration = findValue(text, ['Typical duration of apprenticeship', 'Typical duration']);
    m.status = findValue(text, ['Status']);
    m.route = findValue(text, ['Route', 'Routes']);
    m.minimumHours = findValue(text, ['Minimum hours for compliance', 'Minimum hours']);
    m.maximumFunding = findValue(text, ['Maximum funding']);
    m.larsCode = findValue(text, ['LARS Code', 'LARS code']);
    m.eqaProvider = findValue(text, ['EQA Provider', 'EQA provider']);
    m.dateUpdated = findValue(text, ['Date updated']);
    m.approvedForDelivery = findValue(text, ['Approved for delivery']);
    m.options = findValue(text, ['Options']);
    m.regulated = findValue(text, ['Regulated standard']);
    m.regulator = findValue(text, ['Regulator body']);
    m.review = findValue(text, ['Review']);
    m.professionalRecognition = findValue(text, ['Professional recognition']);
    m.entryRequirements = findValue(text, ['Entry requirements']);
    m.englishMaths = findValue(text, ['English and Maths']);
    m.ksbs = extractKSB(text);
    return m;
  }

  function renderMeta(m) {
    const fields = [
      ['Course title', m.title], ['Reference', m.reference], ['Version', m.version], ['Level', m.level],
      ['Duration', m.duration], ['OTJ minimum', m.minimumHours], ['Maximum funding', m.maximumFunding],
      ['Route', m.route], ['LARS code', m.larsCode], ['EQA provider', m.eqaProvider], ['Status', m.status],
      ['Date updated', m.dateUpdated], ['Approved for delivery', m.approvedForDelivery], ['Options', m.options],
      ['Regulated', m.regulated], ['Regulator', m.regulator], ['EPA period', m.epaPlan.epaPeriod],
      ['Assessment period', m.epaPlan.assessmentPeriod], ['EPA methods', m.epaPlan.methods.join(' · ')],
      ['EPA plan', m.epaPlan.epaPlanUrl ? 'PDF detected' : 'EPA plan read from source']
    ];
    metaBox.innerHTML = '<div class="meta-heading">Imported standard data</div>' +
      fields.filter(x => x[1]).map(x => `<div class="meta-row"><span>${x[0]}</span><b>${String(x[1]).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</b></div>`).join('');
    metaBox.classList.remove('hidden');
  }

  async function readStandard() {
    const url = urlInput.value.trim();
    if (!/^https?:\/\//i.test(url)) {
      setStatus('Enter a full http:// or https:// website link.', 'error');
      return;
    }
    button.disabled = true;
    button.textContent = 'Reading…';
    setStatus('Reading the standard and EPA plan…');
    try {
      const targets = [url];
      if (/skillsengland\.education\.gov\.uk\/apprenticeships\//i.test(url) && !/[?&]view=epa/i.test(url)) {
        targets.push(url + (url.includes('?') ? '&' : '?') + 'view=epa');
      }
      const texts = [];
      for (const target of targets) {
        const r = await fetch(`https://r.jina.ai/${target}`, {headers: {Accept: 'text/plain'}});
        if (!r.ok) throw new Error(`Reader returned ${r.status}`);
        texts.push(await r.text());
      }

      const standard = parseStandard(texts[0], url);
      standard.epaPlan = extractEPA(texts.join('\n\n'));
      if (!standard.ksbs.length) throw new Error('No KSB criteria could be detected. Try the occupational standard page or paste the KSBs manually.');

      const set = (id, value) => {
        const el = document.querySelector(`#${id}`);
        if (el && value) el.value = value;
      };
      set('courseTitle', standard.title);
      set('courseRef', standard.reference);
      set('courseVersion', standard.version);
      set('courseLevel', standard.level);
      set('courseDuration', standard.duration);
      input.value = standard.ksbs.join('\n');

      window.naxosImportedMetadata = standard;
      renderMeta(standard);
      setStatus(`Imported ${standard.ksbs.length} KSB criteria${standard.minimumHours ? ` · ${standard.minimumHours} OTJ hours` : ''}${standard.epaPlan.methods.length ? ' · EPA plan included' : ''}.`, 'ok');
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
    if (event.key === 'Enter') {
      event.preventDefault();
      readStandard();
    }
  });

  const originalSet = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function(key, value) {
    if (key === 'naxos3_courses' && window.naxosImportedMetadata) {
      try {
        const courses = JSON.parse(value);
        if (courses[0]) courses[0].standardMetadata = window.naxosImportedMetadata;
        value = JSON.stringify(courses);
      } catch (_) {}
    }
    return originalSet(key, value);
  };
})();
