(function(){
  const READER='https://r.jina.ai/';
  const META_KEYS=[
    ['status','Status'],['reference','Reference'],['version','Version'],['level','Level'],['duration','Typical duration'],['minimumHours','Minimum hours for compliance'],['maximumFunding','Maximum funding'],['route','Route'],['dateUpdated','Date updated'],['approvedForDelivery','Approved for delivery'],['larsCode','LARS Code'],['eqaProvider','EQA Provider'],['regulated','Regulated standard'],['regulator','Regulator body'],['occupationalLevel','Occupational Level'],['options','Options'],['review','Review'],['professionalRecognition','Professional recognition'],['entryRequirements','Entry requirements'],['englishMaths','English and Maths']
  ];
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  function value(text,label){
    const re=new RegExp('(?:^|\\n)\\s*'+label.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\\\$&')+'\\s*:?\\s*([^\\n]+)','i');
    const m=text.match(re); return m?clean(m[1]):'';
  }
  function parse(text,url){
    const m={sourceUrl:url,title:'',epaPlanUrl:'',epaPlan:'',ksbs:[],duties:[],assessmentMethods:[],gatewayRequirements:'',grading:'',assessmentPeriod:'',epaPeriod:'',epaSummary:'',importedAt:new Date().toISOString()};
    META_KEYS.forEach(([k,l])=>m[k]=value(text,l));
    if(!m.title){ const h=text.match(/^#\\s+(.+)$/m); m.title=h?clean(h[1]):''; }
    if(!m.reference){const x=text.match(/Reference:\\s*(ST\\d+|FA\\d+|AU\\d+)/i);if(x)m.reference=x[1]}
    if(!m.version){const x=text.match(/Version\\s*:?\\s*([\\d.]+)/i);if(x)m.version=x[1]}
    if(!m.level){const x=text.match(/Level\\s*:?\\s*(\\d+)/i);if(x)m.level=x[1]}
    if(!m.duration){const x=text.match(/Typical duration(?: to gateway)?\\s*:?\\s*([^\\n]+)/i);if(x)m.duration=clean(x[1])}
    const ksbRe=/^\\s*([KSB])\\s*(\\d+)\\s*[:\\-–—]\\s*(.+)$/gm; let x;
    while((x=ksbRe.exec(text))) m.ksbs.push({reference:x[1].toUpperCase()+x[2],ksb_type:x[1].toUpperCase(),description:clean(x[3])});
    const am=/^\\s*(?:Assessment method|Method)\\s*\\d*\\s*[:\\-–—]?\\s*(.+)$/gmi; while((x=am.exec(text)))m.assessmentMethods.push(clean(x[1]));
    const ap=text.match(/EPA period[^\\n]{0,120}(\\d+)\\s*month/i); if(ap)m.epaPeriod=ap[1]+' months';
    const assessment=text.match(/assessment period[^\\n]{0,120}(\\d+)\\s*month/i); if(assessment)m.assessmentPeriod=assessment[1]+' months';
    const pdf=text.match(/https?:[^\\s)]+\\.pdf/i); if(pdf)m.epaPlanUrl=pdf[0];
    return m;
  }
  function renderMeta(m){
    const box=document.querySelector('#standardMeta'); if(!box)return;
    const fields=[['Title',m.title],['Reference',m.reference],['Version',m.version],['Level',m.level],['Duration',m.duration],['OTJ minimum',m.minimumHours],['Maximum funding',m.maximumFunding],['Route',m.route],['LARS',m.larsCode],['EQA',m.eqaProvider],['Assessment period',m.assessmentPeriod],['EPA period',m.epaPeriod],['EPA methods',m.assessmentMethods.join(' · ')],['EPA plan',m.epaPlanUrl||'Found on source page']];
    box.innerHTML=fields.filter(x=>x[1]).map(x=>`<div class="summary-row"><span>${x[0]}</span><b>${String(x[1]).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</b></div>`).join(''); box.classList.remove('hidden');
  }
  async function read(){
    const input=document.querySelector('#standardUrl'),btn=document.querySelector('#readStandard'),status=document.querySelector('#standardReadStatus'); if(!input)return;
    const url=input.value.trim(); if(!/^https?:\\/\\//i.test(url)){status.textContent='Enter a valid website link.';return;}
    btn.disabled=true; status.textContent='Reading standard and EPA information…';
    try{
      const targets=[url];
      if(/skillsengland\\.education\\.gov\\.uk\\/apprenticeships\\//i.test(url) && !/[?&]view=epa/i.test(url))targets.push(url+(url.includes('?')?'&':'?')+'view=epa');
      const texts=[];
      for(const target of targets){const r=await fetch(READER+target); if(!r.ok)throw new Error('Unable to read the supplied page'); texts.push(await r.text());}
      const joined=texts.join('\\n\\n'); const m=parse(joined,url);
      if(!m.title && !m.reference && !m.ksbs.length)throw new Error('No standard data could be identified on that page.');
      const set=(id,v)=>{const el=document.querySelector('#'+id);if(el&&v)el.value=v};
      set('courseTitle',m.title);set('courseRef',m.reference);set('courseVersion',m.version);set('courseLevel',m.level);set('courseDuration',m.duration);
      const ksbText=m.ksbs.map(k=>`${k.reference} - ${k.description}`).join('\\n'); if(ksbText)document.querySelector('#ksbInput').value=ksbText;
      window.naxosImportedMetadata=m; renderMeta(m); status.textContent=`Read ${m.ksbs.length} KSB criteria${m.minimumHours?' · '+m.minimumHours+' OTJ hours':''}${m.assessmentMethods.length?' · EPA plan found':''}.`;
    }catch(e){status.textContent=e.message||'Could not read the standard.';}
    finally{btn.disabled=false;}
  }
  window.NaxosStandardImporter={read};
  document.addEventListener('click',e=>{if(e.target&&e.target.id==='readStandard')read();});
  const originalSet=localStorage.setItem.bind(localStorage);
  localStorage.setItem=function(key,value){
    if(key==='naxos3_courses'&&window.naxosImportedMetadata){try{const courses=JSON.parse(value);if(courses[0])courses[0].standardMetadata=window.naxosImportedMetadata;value=JSON.stringify(courses);}catch(_){}}
    return originalSet(key,value);
  };
})();
