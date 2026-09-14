const KEY='naxos3_duty_engine_v2';
const KQ={
K1:'What health and safety requirements, hazards and controls do you need to consider for this work?',
K2:'What safety control equipment and PPE are required for this work, and how should they be used?',
K3:'What safe systems of work should be followed for this task, and what hazards need to be identified?',
K4:'How will you use resources efficiently, reduce waste and dispose of waste safely?',
K5:'How do thermal qualities, airtightness and ventilation affect buildings and this work?',
K6:'What building principles are relevant to this work, including protection from moisture, fire and air?',
K7:'Which British Standards, building regulations or warranty requirements apply to this work?',
K8:'Which materials and components are being used, and what are their relevant characteristics?',
K9:'What modern methods of construction could affect bricklaying work and how?',
K10:'How do you interpret the relevant information from the drawing or specification?',
K11:'How could digital design or modelling systems be used in this type of work?',
K12:'How would you estimate the quantities of materials needed for this task?',
K13:'Which hand tools are appropriate for this work, and how should they be used, maintained and stored?',
K14:'Which power tools are appropriate for this work, and what are their limitations?',
K15:'What bond types are relevant to brickwork, and how are they formed?',
K16:'How is a solid brick wall set out, constructed and capped?',
K17:'What joint finishes could be used here, and how are they produced?',
K18:'How are decorative walling features and piers set out and constructed?',
K19:'What is the purpose of an expansion joint and where would one be used?',
K20:'How is mortar mixed to the required ratio and consistency?',
K21:'How is a cavity wall set out using levels, profiles, gauge rods and squares?',
K22:'How are cavity walls constructed, including wall ties, insulation, DPCs, cavity trays, weep holes, lintels and fire stopping?',
K23:'How are brick-on-edge and soldier courses set out and constructed?',
K24:'What defects could occur in masonry and how would they be repaired?',
K25:'How should materials and completed work be protected from frost, water and construction damage?',
K26:'How should you communicate with others using appropriate construction terminology?',
K27:'What makes a construction team work effectively?',
K28:'How should inclusion, equity and diversity be applied in the workplace?',
K29:'How should bricks and blocks be measured, marked and cut using hand tools?',
K30:'How is a wall with a raking cut set out and constructed?',
K31:'How can you look after your own and others’ mental and physical wellbeing, and where can support be accessed?'
};
const BQ={
B1:'How did you put health, safety and wellbeing first during this work?',
B2:'How did you consider the environment when choosing resources and carrying out the work?',
B3:'How did you take ownership of the work you were given?',
B4:'How did you contribute to an inclusive and diverse workplace?',
B5:'What learning or development opportunity have you identified and how will you act on it?',
B6:'How did you work as part of the team and consider the needs of the wider build team?'
};
const ACTIVITIES=[
{id:'setout',title:'Set out masonry',summary:'Use drawings, dimensions, profiles, line, level and tolerances.',S:['S5','S8','S10','S13'],K:['K9','K10','K13','K16','K19','K21'],B:['B3'],photos:['Drawing / dimensions','Wall and opening position','Profiles / gauge rod / square','Measurement and tolerance check','First course / finished set-out']},
{id:'cavity',title:'Build cavity walling',summary:'Construct brick/block walling, returns, openings, bond and wall ties.',S:['S11'],K:['K6','K22'],B:['B3'],photos:['Set-out / first course','Wall in progress','Return / opening','Wall ties before covering','Line, level and plumb','Finished cavity wall']},
{id:'details',title:'Install cavity details',summary:'Install insulation, DPC, trays, weeps, fire stopping and closures.',S:['S11'],K:['K5','K6','K8','K22'],B:['B3'],photos:['Cavity before covering','Insulation continuity','DPC / cavity tray','Weep holes','Fire stopping / closure','Finished hidden-work check']},
{id:'openings',title:'Form openings & lintels',summary:'Set out openings and install lintels, bearings and feature courses.',S:['S10','S11'],K:['K8','K10','K22','K23'],B:['B3'],photos:['Opening set-out','Lintel and bearing','Soldier / brick-on-edge course','Cavity closure','Final opening dimensions']},
{id:'solid',title:'Build solid walling',summary:'Construct solid walls, bonds, capping and quality checks.',S:['S13'],K:['K15','K16'],B:['B3'],photos:['Solid wall set-out','Bond pattern','Wall in progress','Capping detail','Line, level and plumb','Finished solid wall']},
{id:'piers',title:'Build piers & decorative walling',summary:'Construct piers, projecting brickwork, contrasting work and banding.',S:['S11'],K:['K18','K23'],B:['B3'],photos:['Pier / decorative set-out','Bond detail','Feature work in progress','Alignment and gauge','Finished feature']},
{id:'rake',title:'Build raking or gable walling',summary:'Set out, cut and construct raking brickwork.',S:['S15','S22'],K:['K29','K30'],B:['B3'],photos:['Rake line / template','Marked cuts','Cut units','Wall in progress','Finished rake']},
{id:'mortar',title:'Mix mortar',summary:'Gauge and mix mortar to the required ratio and consistency.',S:['S14'],K:['K8','K14','K20'],B:['B3'],photos:['Materials','Ratio / gauging','Mixing process','Consistency check','Safe setup / controls']},
{id:'cut',title:'Cut bricks & blocks',summary:'Measure, mark and cut units using the appropriate tool and controls.',S:['S8','S15'],K:['K1','K13','K14','K29'],B:['B1','B3'],photos:['Measurement','Marked cut','Tool selection','Safe controls','Cutting process']},
{id:'joints',title:'Apply joint finishes',summary:'Apply half-round, flush, weather-struck or recessed finishes.',S:['S12'],K:['K13','K17'],B:['B3'],photos:['Joint before finishing','Tool selection','Finish in progress','Consistency check','Finished joints']},
{id:'repair',title:'Repair brickwork',summary:'Identify defects, remove damaged work, replace and match existing masonry.',S:['S16','S17'],K:['K24','K25'],B:['B2','B3'],photos:['Defect before work','Removal / preparation','Replacement','Joint and bond matching','Finished repair']},
{id:'complete',title:'Complete & protect masonry',summary:'Check quality, protect finished work, segregate waste and leave the area safe.',S:['S3','S4','S17'],K:['K4','K7','K24','K25'],B:['B1','B2','B3'],photos:['Finished work','Quality check','Protection from weather / damage','Waste segregation','Clean final area']}
];

/* AUTHORITATIVE DUTY-FIRST MASTER MAP.
   Duties are the primary mapping layer. Activities are supporting evidence routes only.
   K/S/B must not be removed from this master map when evidence is completed elsewhere. */
const DUTIES=[
{id:'d1',title:'Health, safety & environment',summary:'Work in compliance with occupational health, safety and environmental requirements to ensure the health, safety and wellbeing of self and others at all times. Report in a timely manner any non-compliances against the construction programme to the appropriate person.',K:['K1','K2','K3','K4','K5','K6','K7','K13','K30','K31'],S:['S1','S2','S6','S17','S19','S21'],B:['B1','B3','B4','B6'],activities:['cut','mortar','complete']},
{id:'d2',title:'Regulations, quality & instructions',summary:'Carry out their work conforming to all current and relevant building regulations, quality standards and work instructions.',K:['K1','K2','K3','K5','K6','K7','K8','K9','K10','K15','K17','K18','K19','K20','K21','K22','K23','K30'],S:['S1','S2','S3','S4','S9','S10','S11','S12','S13','S14','S22'],B:['B1','B2','B3','B4','B6'],activities:['setout','cavity','details','openings']},
{id:'d3',title:'Construction programme & change',summary:'Work to the construction programme, adapting to changes in schedule and requirements where necessary.',K:['K2','K3','K4','K5','K6','K9','K10','K30'],S:['S4','S22'],B:['B1','B2','B3','B6'],activities:['setout','cavity','complete']},
{id:'d4',title:'Prepare the work site',summary:'Prepare the work site including setting out the work and the selection of materials and tools appropriate to the project.',K:['K2','K3','K4','K6','K8','K10','K11','K12','K13','K14','K15','K16','K17','K18','K19','K20','K21','K22','K23'],S:['S4','S5','S6','S7','S8','S9','S10','S11','S12','S13','S14','S22'],B:['B1','B2','B3','B6'],activities:['setout','mortar','cut']},
{id:'d5',title:'Construct brick & block walls',summary:'Use the appropriate tools and equipment to construct walls with brick and block to industry standards.',K:['K1','K2','K3','K4','K5','K6','K7','K8','K9','K10','K11','K12','K13','K14','K15','K16','K17','K18','K19','K20','K21','K22','K23','K25','K29'],S:['S3','S4','S5','S7','S8','S9','S10','S11','S12','S13','S15','S22'],B:['B1','B2','B3','B6'],activities:['cavity','details','openings','solid','piers','rake','joints']},
{id:'d6',title:'Repairs & modifications',summary:'Carry out minor repairs or modifications to masonry.',K:['K1','K2','K3','K4','K6','K8','K9','K10','K11','K12','K13','K14','K15','K16','K17','K18','K22','K23','K24'],S:['S4','S5','S7','S8','S10','S11','S12','S13','S15','S16','S22'],B:['B1','B2','B3','B6'],activities:['repair']},
{id:'d7',title:'Collaboration',summary:'Collaborate with stakeholders including clients and other construction trades.',K:['K3','K4','K6','K10','K24','K26','K27','K28'],S:['S4','S18','S20'],B:['B1','B2','B3','B6'],activities:['cavity','openings','complete']},
{id:'d8',title:'Maintain a safe & sustainable site',summary:'Maintain a clear and safe worksite at all times, disposing of waste appropriately and sustainably.',K:['K2','K3','K4','K6'],S:['S2','S3','S6','S17'],B:['B1','B2','B3','B4','B6'],activities:['complete','mortar']},
{id:'d9',title:'Continuous professional development',summary:'Carry out continuous professional development to maintain knowledge of current and future developments affecting the role.',K:['K2','K3','K4','K6','K7','K8','K9','K10'],S:['S19'],B:['B1','B2','B3','B4','B5','B6'],activities:[]},
{id:'d10',title:'Materials handling',summary:'Receive, unload, move and lift materials to site for installation following good handling practices preventing injury or damage.',K:['K1','K2','K3','K4','K6','K8','K9','K11','K30'],S:['S7','S8'],B:['B1','B2','B3','B6'],activities:['setout','mortar','cut']}
];

const state={screen:'home',duty:null,activity:null,tab:'skills',data:load()};
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
function persist(){localStorage.setItem(KEY,JSON.stringify(state.data))}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function activityData(a){state.data[a.id]??={photos:{},knowledge:{},behaviours:{},witness:{}};return state.data[a.id]}
function go(screen){state.screen=screen;render();window.scrollTo(0,0)}
function header(title,kicker=''){return `<header><button class="back" onclick="back()">‹</button><div>${kicker?`<small class="kicker">${esc(kicker)}</small>`:''}<h1>${esc(title)}</h1></div><button class="home-btn" onclick="go('home')">N</button></header>`}
function back(){if(state.screen==='activity')state.screen='duty';else if(state.screen==='duty')state.screen='course';else state.screen='home';render();window.scrollTo(0,0)}
function home(){return `<main class="home"><div class="brand"><div class="naxos-face">N</div><h1>Naxos</h1><p>Master Course Engine</p></div><button class="home-card" onclick="go('course')"><span class="icon">K</span><span><b>Bricklayer ST0095</b><small>Version 1.2 · Duty-first evidence engine</small></span><strong>›</strong></button><div class="home-note"><b>Evidence model</b><span>Duty → official KSB mapping → practical evidence routes → learner completion. Shared evidence can be reused; completed KSBs are not repeated as new master requirements.</span></div></main>`}
function course(){return `<main class="page">${header('Bricklayer','ST0095 · VERSION 1.2')}<div class="course-rule"><b>Actual duties are the master map</b><span>Each duty retains its full official K/S/B mapping. Practical activities are supporting evidence routes and must never replace or redefine the duty mapping.</span></div><div class="pack-list">${DUTIES.map((d,i)=>`<button class="pack" onclick="openDuty('${d.id}')"><span class="pack-num">${String(i+1).padStart(2,'0')}</span><span class="pack-copy"><b>${esc(d.title)}</b><small>${esc(d.summary)}</small><em>${d.S.length} S · ${d.K.length} K · ${d.B.length} B</em></span><span class="pack-progress">›</span></button>`).join('')}</div></main>`}
function openDuty(id){state.duty=DUTIES.find(d=>d.id===id);state.screen='duty';render();window.scrollTo(0,0)}
function activityCard(a){const d=activityData(a),photos=Object.keys(d.photos).length;return `<button class="pack" onclick="openActivity('${a.id}')"><span class="pack-num">${photos}/5</span><span class="pack-copy"><b>${esc(a.title)}</b><small>${esc(a.summary)}</small><em>${a.S.length} S · ${a.K.length} K · ${a.B.length} B</em></span><span class="pack-progress">›</span></button>`}
function ksbGroup(label,items){return `<section class="ksb-master"><h2>${label} <small>${items.length}</small></h2><div class="ksb-pills">${items.map(x=>`<span>${x}</span>`).join('')}</div></section>`}
function dutyView(){const d=state.duty;return `<main class="page">${header(d.title,`DUTY ${d.id.slice(1)}`)}<section class="duty-statement"><small>ACTUAL DUTY</small><p>${esc(d.summary)}</p></section><div class="master-map">${ksbGroup('Skills',d.S)}${ksbGroup('Knowledge',d.K)}${ksbGroup('Behaviours',d.B)}</div><div class="course-rule"><b>Evidence route</b><span>The K/S/B above are the authoritative duty mapping. Practical activities below are only ways to collect evidence. If a K/S/B has already been met, the learner should not be asked to repeat it simply because it appears in another duty.</span></div>${d.activities.length?`<h2 class="section-title">Suggested practical evidence routes</h2><div class="pack-list">${d.activities.map(id=>activityCard(ACTIVITIES.find(a=>a.id===id))).join('')}</div>`:`<section class="question-card"><h2>Professional development</h2><p>This duty is not empty. Its mapped K/S/B requirements are shown above. Complete the required development evidence and reflection without inventing a practical activity.</p><textarea placeholder="What have you learned, how have you developed, and what will you do next?" oninput="saveDutyReflection(this)">${esc(state.data[d.id]?.reflection||'')}</textarea></section>`}</main>`}
function openActivity(id){state.activity=ACTIVITIES.find(a=>a.id===id);state.tab='skills';state.screen='activity';render();window.scrollTo(0,0)}
function activityView(){const a=state.activity,d=activityData(a);return `<main class="page">${header(a.title,'PRACTICAL ACTIVITY')}<p class="summary">${esc(a.summary)}</p><div class="ksb-strip"><b>Activity evidence mapping</b>${a.S.map(x=>`<span>${x}</span>`).join('')}${a.K.map(x=>`<span>${x}</span>`).join('')}${a.B.map(x=>`<span>${x}</span>`).join('')}</div><nav class="tabs"><button class="${state.tab==='skills'?'active':''}" onclick="tab('skills')">Skills</button><button class="${state.tab==='knowledge'?'active':''}" onclick="tab('knowledge')">Knowledge</button><button class="${state.tab==='behaviours'?'active':''}" onclick="tab('behaviours')">Behaviours</button></nav><section class="tab-body">${state.tab==='skills'?skillEvidence(a,d):state.tab==='knowledge'?knowledgeEvidence(a,d):behaviourEvidence(a,d)}</section></main>`}
function skillEvidence(a,d){return `<div class="notice"><b>Skills = 1–5 photos.</b> Use the fewest photos that genuinely demonstrate the work. A single photo may satisfy several Skills.</div>${a.photos.map((prompt,i)=>photoCard(a,i,prompt,d)).join('')}<div class="notice">${a.S.length} mapped Skill${a.S.length===1?'':'s'} · no duplicate evidence required.</div>`}
function photoCard(a,i,prompt,d){const n=i+1,has=!!d.photos[n];return `<article class="evidence-card"><div class="evidence-head"><span>PHOTO ${n}</span><b>${esc(prompt)}</b><small>${has?'Captured':'Optional'}</small></div><label class="photo-box ${has?'has-photo':''}"><input type="file" accept="image/*" capture="environment" onchange="photo(this,${n})"><span>${has?'Photo captured':'＋ Take photo'}</span></label></article>`}
function knowledgeEvidence(a,d){return `<div class="notice"><b>Knowledge = one focused question per K.</b> Answer briefly in your own words. Naxos records the answer against that Knowledge statement.</div>${a.K.map(k=>`<section class="question-card"><div class="ksb-title"><span>K</span><div><h2>${k}</h2><p>${esc(KQ[k]||'Explain what you know about this Knowledge statement and how it applies to the work.')}</p></div></div><textarea oninput="knowledge(this,'${k}')" placeholder="Write your answer…">${esc(d.knowledge[k]||'')}</textarea></section>`).join('')}`}
function behaviourEvidence(a,d){return `<div class="notice"><b>Behaviour = one reflection question per B.</b> Answer briefly. A witness can confirm the same behaviour where appropriate.</div>${a.B.map(b=>`<section class="question-card"><div class="ksb-title"><span>B</span><div><h2>${b}</h2><p>${esc(BQ[b]||'How did you demonstrate this behaviour during the work?')}</p></div></div><textarea oninput="behaviour(this,'${b}')" placeholder="Write your reflection…">${esc(d.behaviours[b]||'')}</textarea><label>Optional witness testimony<textarea oninput="witness(this,'${b}')" placeholder="Tutor, assessor or employer witness testimony…">${esc((d.witness||{})[b]||'')}</textarea></label></section>`).join('')}`}
function photo(input,n){const a=state.activity,d=activityData(a),file=input.files&&input.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{d.photos[n]=reader.result;persist();render()};reader.readAsDataURL(file)}
function knowledge(el,k){const d=activityData(state.activity);d.knowledge[k]=el.value;persist();saveFlash(el)}
function behaviour(el,b){const d=activityData(state.activity);d.behaviours[b]=el.value;persist();saveFlash(el)}
function witness(el,b){const d=activityData(state.activity);d.witness??={};d.witness[b]=el.value;persist();saveFlash(el)}
function saveDutyReflection(el){state.data[state.duty.id]??={};state.data[state.duty.id].reflection=el.value;persist();saveFlash(el)}
function saveFlash(el){el.classList.add('saved');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('saved'),700)}
function tab(t){state.tab=t;render();window.scrollTo(0,0)}
function render(){document.querySelector('#root').innerHTML=state.screen==='home'?home():state.screen==='course'?course():state.screen==='duty'?dutyView():activityView()}
Object.assign(window,{go,back,openDuty,openActivity,photo,knowledge,behaviour,witness,saveDutyReflection,tab});
document.addEventListener('DOMContentLoaded',render);
