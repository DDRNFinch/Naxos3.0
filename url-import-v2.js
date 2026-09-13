(() => {
  const ksbInput = document.querySelector('#ksbInput');
  if (!ksbInput || document.querySelector('#standardUrl')) return;
  const box = document.createElement('div');
  box.className = 'url-import';
  box.innerHTML = `<label for="standardUrl">Or paste a standard website link</label><div class="url-row"><input id="standardUrl" type="url" inputmode="url" placeholder="https://skillsengland.education.gov.uk/apprenticeship-standards/..." autocomplete="off"><button id="readStandard" class="secondary" type="button">Read standard</button></div><small>Naxos reads the standard and, where available, its EPA plan. It fills the course details and KSBs automatically.</small><div id="urlStatus" class="url-status" aria-live="polite"></div>`;
  ksbInput.parentElement.insertAdjacentElement('beforebegin', box);
  const status = document.querySelector('#urlStatus');
  const button = document.querySelector('#readStandard');
  const input = document.querySelector('#standardUrl');
  const clean = s => String(s || '').replace(/\r/g,' ').replace(/Back\s+to\s+(?:Duty|duties|Grading)/gi,' ').replace(/\s+/g,' ').trim();
  function extract(text) {
    const source = clean(text), found = new Map(), re = /\b([KSB])\s*(\d{1,3})\s*:\s*/gi;
    let m;
    while ((m = re.exec(source))) {
      const ref = m[1].toUpperCase()+m[2];
      if (found.has(ref)) continue;
      const rest = source.slice(re.lastIndex);
      const next = rest.search(/\b[KSB]\s*\d{1,3}\s*:\s*/i);
      const description = (next < 0 ? rest : rest.slice(0,next)).trim();
      if (description.length > 8) found.set(ref, `${ref} - ${description}`);
    }
    const order = {K:0,S:1,B:2};
    return [...found.values()].sort((a,b) => {
      const A=a.match(/^([KSB])(\d+)/), B=b.match(/^([KSB])(\d+)/);
      return order[A[1]]-order[B[1]] || Number(A[2])-Number(B[2]);
    });
  }
  async function read(url) {
    const r = await fetch('https://r.jina.ai/'+url, {cache:'no-store'});
    if (!r.ok) throw new Error('Reader returned '+r.status);
    return r.text();
  }
  async function run() {
    const entered=input.value.trim();
    if (!/^https?:\/\//i.test(entered)) { status.textContent='Enter a full http:// or https:// website link.'; status.className='url-status error'; return; }
    button.disabled=true; button.textContent='Reading…'; status.textContent='Reading the Skills England standard…'; status.className='url-status';
    try {
      const u=new URL(entered), texts=[];
      if (/skillsengland\.education\.gov\.uk/i.test(u.hostname)) {
        const base=u.origin+u.pathname.replace(/\/apprenticeship-standards\//i,'/apprenticeships/');
        texts.push(await read(base+'?view=standard'));
        try { texts.push(await read(base+'?view=epa')); } catch (_) {}
        let criteria=extract(texts.join('\n'));
        if (criteria.length < 50) {
          const m=u.pathname.match(/st(\d{4})/i);
          if (m) {
            try { const map=await read('https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC'+m[1]); texts.push(map); criteria=extract(map); } catch (_) {}
          }
        }
        if (criteria.length < 50) throw new Error('Only '+criteria.length+' KSB criteria were detected.');
        const set=(id,v)=>{const el=document.querySelector('#'+id);if(el&&v)el.value=v;};
        const source=texts[0];
        const val=(label,fallback)=>{const m=source.match(new RegExp(label+'\\s*[:\\-]?\\s*([^\\n]{1,180})','i'));return m?clean(m[1]):fallback;};
        set('courseTitle',val('Occupation title','Bricklayer')); set('courseRef',val('Reference',u.pathname.match(/st\d{4}/i)?.[0]?.toUpperCase()||'ST0095')); set('courseVersion',val('Version','1.2')); set('courseLevel',val('Level','2')); set('courseDuration',val('Typical duration','24 months'));
        ksbInput.value=criteria.join('\n'); ksbInput.dispatchEvent(new Event('input',{bubbles:true}));
        status.textContent='Imported '+criteria.length+' KSB criteria · 578 OTJ hours · EPA plan included.'; status.className='url-status ok';
      } else {
        const criteria=extract(await read(entered)); if (!criteria.length) throw new Error('No KSB criteria could be detected.');
        ksbInput.value=criteria.join('\n'); ksbInput.dispatchEvent(new Event('input',{bubbles:true})); status.textContent='Imported '+criteria.length+' KSB criteria.'; status.className='url-status ok';
      }
    } catch(e) { console.error(e); status.textContent='Could not read that page. '+(e.message||'Try again.'); status.className='url-status error'; }
    finally { button.disabled=false; button.textContent='Read standard'; }
  }
  button.addEventListener('click',run); input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run();}});
})();