(()=>{
const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random();
const words=s=>String(s||'').toLowerCase();
const themes=[
 ['health and safety',['safe','hazard','risk','ppe','coshh','fire','manual handling','health','safety','regulation','control']],
 ['preparation and planning',['prepare','preparation','plan','drawing','specification','setting out','measure','datum','level']],
 ['materials and resources',['material','mortar','resource','cement','sand','aggregate','brick','block','product','storage']],
 ['tools and equipment',['tool','equipment','trowel','gauge','level','plumb','machine','plant']],
 ['construction and workmanship',['construct','build','wall','bond','joint','lay','course','workmanship','cut','fix','install']],
 ['repairs and protection',['repair','protect','defect','damage','remedial','rake','clean','finish']],
 ['communication and teamwork',['communicat','team','colleague','customer','client','report','handover','instruction']],
 ['environment and sustainability',['environment','waste','recycl','sustain','energy','pollution']],
 ['professional practice',['professional','inclusion','equality','divers','behaviour','wellbeing','responsib','quality']]
];
function themeFor(items,fallback='Course practice'){
 const text=words(items.map(x=>x.description||x.title||x).join(' '));
 let best={n:0,t:fallback};themes.forEach(([t,ks])=>{const n=ks.reduce((a,k)=>a+(text.includes(k)?1:0),0);if(n>best.n)best={n,t}});return best.t;
}
function descFor(d,ids){return ids.map(id=>(d.ksbs||[]).find(k=>k.id===id)).filter(Boolean).map(k=>k.reference+': '+k.description).join(' ')}
function evidenceFor(title,ksbs,d){
 const context=descFor(d,ksbs.map(k=>k.id));
 const theme=themeFor(ksbs,title);
 const focus=context||title;
 const isKnowledge=ksbs.length>0&&ksbs.every(k=>k.ksb_type==='K');
 const photoRequired=!isKnowledge;
 const prompts=photoRequired?[
  'Preparation — Show the work area, materials and controls prepared for the task.',
  'PPE / safety — Show the PPE and safety controls being used.',
  'Set-out — Show the drawing, measurements, levels, lines or preparation relevant to the task.',
  'Work in progress — Show the learner carrying out the key practical operation.',
  'Detail — Show a close-up of the finished workmanship or critical detail.',
  'Quality check — Show the completed work and the checks made against requirements.'
 ]:[];
 return {theme,context:`This activity develops competence in ${theme.toLowerCase()}. The learner should apply the requirements described by the mapped criteria in a realistic workplace or training environment. The evidence must show what was done, how it was done, and how the learner checked the result. Mapped criteria: ${focus}`,
 task:`Complete a real task that demonstrates the mapped criteria. Before starting, review the relevant drawings, specifications, risk controls, manufacturer or workplace requirements and available resources. Carry out the task safely and in the correct sequence. Explain important decisions while working, deal with problems or changes appropriately, and check the finished result against the required standard. Record any measurements, checks, adjustments, defects or corrective actions. Where the task involves other people, demonstrate appropriate communication and teamwork.`,
 written:`Write at least 100 words explaining the task you completed. Describe the situation and what you were asked to achieve, the preparation and controls you used, the materials/tools/equipment selected, the sequence of work, important decisions you made, any problems or changes you dealt with, the quality checks you completed and the final result. Refer to the evidence shown in your photographs and explain how the work demonstrates the mapped criteria.`,
 photoRequired,photoPrompts:prompts,documents:['Relevant drawing / specification or task instruction','Risk assessment / RAMS / workplace safety information where applicable','Manufacturer or technical information where applicable'],
 assessment:`Assessment focus: ${theme}. The assessor should confirm that the learner personally completed the task, followed required procedures, produced work to the expected standard, and can explain the decisions and checks made.`,epa:`EPA relevance: retain this evidence as a potential portfolio example and ensure the learner can explain the task, decisions, standards and outcomes independently.`};
}
function makeActivity(d,title,ids,type='practical_evidence',duty=null){const ks=(d.ksbs||[]).filter(k=>ids.includes(k.id));const e=evidenceFor(title,ks,d);return{id:uid(),title,type,context:e.context,learner_task:e.task,photo_instruction:e.photoPrompts.join('\n'),photo_prompts:e.photoPrompts,written_prompt:e.written,documents:e.documents,assessment_criteria:e.assessment,epa_relevance:e.epa,photo_required:e.photoRequired,written_required:true,completion_requirements:e.photoRequired?'6 labelled workplace/practical photographs + written statement of at least 100 words + supporting documents where required':'Written learning evidence / knowledge check + supporting references where required',ksb_ids:[...ids],duty_id:duty?.id||null};}
function chunk(a,n){const out=Array.from({length:Math.max(1,n)},()=>[]);a.forEach((x,i)=>out[i%out.length].push(x));return out.filter(x=>x.length)}
function build(d){
 const ks=d.ksbs||[], skills=ks.filter(k=>k.ksb_type==='S'), knowledge=ks.filter(k=>k.ksb_type==='K'), behaviours=ks.filter(k=>k.ksb_type==='B');
 const all=ks.map(k=>k.id); const template=d.structure?.template||'custom'; const primary=d.structure?.rules?.primary||''; let groups=[];
 const dutyMode=(template==='duty-led'||primary==='Duties')&&d.duties?.length;
 if(dutyMode){groups=d.duties.map((du,i)=>({title:du.reference+' — '+du.title,description:'Learning and evidence for this occupational duty.',duty:du,ids:chunk(ks,d.duties.length)[i]||[]}));}
 else if(template==='skill-led'||primary==='Skills'){groups=skills.map(s=>({title:s.reference+' — '+s.description,description:'Practical competence activity built around this Skill.',ids:[s,...knowledge.filter(k=>words(k.description).split(/\\s+/).some(w=>w.length>5&&words(s.description).includes(w))).slice(0,3),...behaviours.slice(0,1)].map(x=>x.id)}));}
 else if(template==='knowledge-led'||primary==='Knowledge'){groups=knowledge.map(k=>({title:k.reference+' — '+k.description,description:'Knowledge learning and application activity.',ids:[k.id]}));}
 else if(template==='individual-ksb'){groups=ks.map(k=>({title:k.reference+' — '+k.description,description:'Individual criterion development and evidence.',ids:[k.id]}));}
 else if(template==='holistic'||primary==='Evidence'){groups=chunk(ks,Math.max(1,Math.ceil(ks.length/6))).map((g,i)=>({title:themeFor(g,'Holistic evidence')+' — Activity '+(i+1),description:'Integrated evidence covering several related criteria.',ids:g.map(x=>x.id)}));}
 else if(template==='5x5x5'){const g=chunk(ks,5);groups=Array.from({length:5},(_,i)=>({title:themeFor(g[i]||ks,'Course unit')+' — Unit '+(i+1),description:'Five-activity unit generated from the master course.',ids:(g[i]||[]).map(x=>x.id)}));}
 else {groups=chunk(ks,Math.max(1,Math.ceil(ks.length/10))).map((g,i)=>({title:themeFor(g,'Course development')+' — Unit '+(i+1),description:'Course unit generated from the master course criteria.',ids:g.map(x=>x.id)}));}
 return groups.map((g,ui)=>{let activityGroups;
  if(template==='5x5x5'){activityGroups=chunk((g.ids||[]).map(id=>ks.find(k=>k.id===id)).filter(Boolean),5).map(x=>x.map(k=>k.id));while(activityGroups.length<5)activityGroups.push([]);}
  else if(template==='duty-led'||dutyMode){activityGroups=chunk((g.ids||[]).map(id=>ks.find(k=>k.id===id)).filter(Boolean),Math.max(1,Math.ceil((g.ids||[]).length/3))).map(x=>x.map(k=>k.id));}
  else activityGroups=[g.ids||[]];
  if(!activityGroups.length)activityGroups=[[]];
  return{id:uid(),title:g.title,description:g.description,duty_id:g.duty?.id||null,ksb_ids:g.ids||[],activities:activityGroups.map((ids,ai)=>{const ks2=ks.filter(k=>ids.includes(k.id));const title=template==='5x5x5'?themeFor(ks2,'Course activity')+' — '+(ai+1):g.title;return makeActivity(d,title,ids,ks2.every(k=>k.ksb_type==='K')?'knowledge_question':'practical_evidence',g.duty);})};
 });
}
function renderRich(){const d=window.state?.draft;if(!d)return;const units=build(d);d.units=units;const box=document.querySelector('#studioGenerated');if(!box)return;box.innerHTML=`<div class="engine-summary"><strong>${esc(d.title||'Untitled course')}</strong><span>${units.length} units · ${units.reduce((n,u)=>n+u.activities.length,0)} activities · ${d.ksbs.length} KSBs</span><p>Naxos has built learner-facing guidance from the master course. KSB codes remain mapped underneath each activity.</p></div>`+units.map((u,ui)=>`<article class="engine-unit"><header><span>Unit ${ui+1}</span><h4>${esc(u.title)}</h4><p>${esc(u.description)}</p></header>${u.activities.map((a,ai)=>`<section class="engine-activity"><div class="engine-activity-head"><div><small>Activity ${ai+1}</small><h5>${esc(a.title)}</h5></div><span class="engine-type">${a.type==='knowledge_question'?'Knowledge / learning':'Practical evidence'}</span></div><div class="engine-grid"><div><b>Context</b><p>${esc(a.context)}</p></div><div><b>What the learner does</b><p>${esc(a.learner_task)}</p></div><div><b>Written evidence</b><p>${esc(a.written_prompt)}</p></div><div><b>Assessment</b><p>${esc(a.assessment_criteria)}</p></div></div>${a.photo_prompts.length?`<div class="engine-photos"><b>Photo evidence — 6 required</b>${a.photo_prompts.map((p,i)=>`<label><span>${i+1}</span>${esc(p)}</label>`).join('')}</div>`:''}<div class="engine-docs"><b>Supporting documents</b><p>${a.documents.map(esc).join(' · ')}</p></div><div class="engine-ksb"><b>Mapped KSBs</b>${(a.ksb_ids||[]).map(id=>{const k=d.ksbs.find(x=>x.id===id);return k?`<span>${esc(k.reference)} <i>${esc(k.description)}</i></span>`:''}).join('')}</div><div class="engine-epa"><b>EPA relevance</b><p>${esc(a.epa_relevance)}</p></div></section>`).join('')}</article>`).join('');
}
function hook(){document.addEventListener('click',e=>{if(e.target.closest('#studioGenerate'))setTimeout(renderRich,30);if(e.target.closest('.template-card'))setTimeout(()=>{},0);if(e.target.closest('#studioSave'))setTimeout(()=>{if(window.state?.draft){window.state.draft.units=build(window.state.draft)}},0);});
 const obs=new MutationObserver(()=>{if(document.querySelector('#studioGenerated')&&!document.querySelector('.engine-summary')&&window.state?.draft?.units?.length)renderRich()});obs.observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();
