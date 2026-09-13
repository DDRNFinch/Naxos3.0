(()=>{
const KEY='naxos3_courses';
const courses=JSON.parse(localStorage.getItem(KEY)||'[]');
const id=()=>crypto.randomUUID();
const refs=(course,list)=>list.map(r=>course.ksbs?.find(k=>k.reference===r)?.id).filter(Boolean);
const findCourse=name=>courses.find(c=>c.title===name);
const activity=(title,type,extra={})=>({id:id(),title,type,photo_instruction:extra.photo_instruction||'',written_prompt:extra.written_prompt||'',reflection_prompt:extra.reflection_prompt||'',witness_prompt:extra.witness_prompt||'',photo_required:!!extra.photo_required,written_required:!!extra.written_required,reflection_required:!!extra.reflection_required,witness_required:!!extra.witness_required,evidence_modes:extra.evidence_modes||[],ksb_ids:[]});
const practical=(title)=>activity(title,'practical',{photo_required:true,written_required:true,evidence_modes:['photo','written']});
const knowledge=(title)=>activity(title,'knowledge',{written_required:true,evidence_modes:['write-up','audio']});
const behaviourPair=(title)=>[
 activity('Learner reflection','reflection',{written_required:true,reflection_required:true,evidence_modes:['reflection'],reflection_prompt:'Reflect on how you demonstrated this behaviour. Explain what you did, how you approached it, what you learned and what you would improve.'}),
 activity('Witness testimony','witness',{written_required:true,witness_required:true,evidence_modes:['witness'],witness_prompt:'A suitable witness records what they observed, how it demonstrated the behaviour, and their name, role and date.'})
];
function unit(course,section,title,ksb,opts={}){
 const u={id:id(),title,description:opts.description||'',category:section,ksb_refs:ksb,ksb_ids:refs(course,ksb),evidence_rule:opts.evidence_rule||'Evidence may be collected naturally during appropriate work; do not require duplicate evidence.',supporting_links:opts.supporting_links||[],work_areas:opts.work_areas||[],activities:[]};
 const a=opts.behaviour?behaviourPair(title):[opts.knowledge?knowledge(title+' — Knowledge activity'):practical(title+' — Evidence')];
 a.forEach(x=>{x.ksb_ids=u.ksb_ids; x.ksb_refs=ksb; u.activities.push(x)});
 return u;
}
function section(type,title,units){return{id:id(),type,title,description:'',units}};
function rebuild(name,spec){
 const c=findCourse(name); if(!c)return;
 const make=(type,title,items)=>section(type,title,items.map(x=>unit(c,type,x.title,x.ksb,x)));
 c.sections=[];
 c.sections.push(make('trade','TRADE SKILLS',spec.trade));
 c.sections.push(make('supporting','SUPPORTING',spec.supporting));
 c.sections.push(make('main','MAIN',spec.main));
 c.sections.push(make('knowledge','KNOWLEDGE — STANDALONE',spec.knowledge.map(x=>({...x,knowledge:true,evidence_rule:'Standalone Knowledge activity. Written response or audio evidence; do not bury this criterion inside another activity.'}))));
 c.sections.push(section('behaviours','BEHAVIOURS',spec.behaviours.map(x=>unit(c,'behaviours',x.title,[x.ref],{behaviour:true,evidence_rule:'Each behaviour is evidenced separately by learner reflection followed by witness testimony.'}))));
 c.architecture='K → S → Unit → Evidence';
 c.architecture_rules={standaloneKnowledge:'K → no suitable S → standalone Knowledge activity',naturalEvidence:'S evidence may be collected during any appropriate work activity and recorded against the relevant Supporting/Main/Trade unit without repeating the work',crossMapping:true,behaviours:'One Behaviour Unit per behaviour; Learner reflection followed by Witness testimony'};
 c.ksbCount=c.ksbs.length;
 c.unitCount=c.sections.reduce((n,s)=>n+s.units.length,0);
 c.activityCount=c.sections.reduce((n,s)=>n+s.units.reduce((m,u)=>m+u.activities.length,0),0);
}
const BRICK={
trade:[
{title:'Trade Skill Unit 1 — Health & Safety',ksb:['S1','K1','K3']},{title:'Trade Skill Unit 2 — Safety Control Equipment',ksb:['S2','K2']},{title:'Trade Skill Unit 3 — Environment & Sustainability',ksb:['S3','K4','K5']},{title:'Trade Skill Unit 4 — Industry Regulations',ksb:['S4','K7']},{title:'Trade Skill Unit 5 — Safe Working Area',ksb:['S7','K1','K3'],description:'Supporting K1/K3 evidence where demonstrated.'},{title:'Trade Skill Unit 6 — Communication',ksb:['S18','K26']},{title:'Trade Skill Unit 7 — Inclusion',ksb:['S19','K28']},{title:'Trade Skill Unit 8 — Team Working',ksb:['S20','K27']},{title:'Trade Skill Unit 9 — Wellbeing',ksb:['S21','K31']}],
supporting:[
{title:'Supporting Unit 1 — Drawings & Specifications',ksb:['S5','K10']},{title:'Supporting Unit 2 — Resource Estimation',ksb:['S6','K12']},{title:'Supporting Unit 3 — Hand Tools',ksb:['S8','K13']},{title:'Supporting Unit 4 — Hand Tool Maintenance & Storage',ksb:['S9','K13']},{title:'Supporting Unit 5 — Joint Finishes',ksb:['S12','K17']},{title:'Supporting Unit 6 — Mortar Mixing',ksb:['S14','K20']},{title:'Supporting Unit 7 — Cutting Bricks & Blocks',ksb:['S15','K29']},{title:'Supporting Unit 8 — Protecting Work',ksb:['S17','K25']}],
main:[
{title:'Main Unit 1 — Cavity Wall Setting Out',ksb:['S10','K21']},{title:'Main Unit 2 — Cavity Wall Construction',ksb:['S11','K22','K23','K8','K19']},{title:'Main Unit 3 — Solid Walling',ksb:['S13','K15','K16','K18','K19']},{title:'Main Unit 4 — Brickwork Repairs',ksb:['S16','K24']},{title:'Main Unit 5 — Raking Cut Wall',ksb:['S22','K30']}],
knowledge:[{title:'Knowledge Unit 1 — Principles of Building',ksb:['K6']},{title:'Knowledge Unit 2 — Modern Methods of Construction',ksb:['K9']},{title:'Knowledge Unit 3 — Power Tools',ksb:['K14']}],
behaviours:[{title:'Behaviour Unit 1 — B1 — Put health, safety and wellbeing first.',ref:'B1'},{title:'Behaviour Unit 2 — B2 — Consider the environment when using resources and carrying out processes.',ref:'B2'},{title:'Behaviour Unit 3 — B3 — Take ownership of given work.',ref:'B3'},{title:'Behaviour Unit 4 — B4 — Contribute to an inclusive and diverse culture.',ref:'B4'},{title:'Behaviour Unit 5 — B5 — Seek learning and development opportunities.',ref:'B5'},{title:'Behaviour Unit 6 — B6 — Team-focus to meet team goals including, considering the wider build team.',ref:'B6'}]};
BRICK.main[0].supporting_links=['S5','S6','S7','S8','S9','S12','S14','S15','S17'];
BRICK.main[1].work_areas=[]; BRICK.main[2].supporting_links=['S12'];
const SITE={
trade:[{title:'Trade Skill Unit 1 — Health & Safety',ksb:['S1','K1','K3']},{title:'Trade Skill Unit 2 — Safety Control Equipment',ksb:['S2','K2']},{title:'Trade Skill Unit 3 — Environment & Sustainability',ksb:['S3','K4']},{title:'Trade Skill Unit 4 — Industry Regulations',ksb:['S4','K7']},{title:'Trade Skill Unit 5 — Safe Working Area',ksb:['S5','K1','K3'],description:'K1/K3 where applicable.'},{title:'Trade Skill Unit 6 — Communication',ksb:['S8','K13']},{title:'Trade Skill Unit 7 — Wellbeing',ksb:['S13','K20']}],
supporting:[{title:'Supporting Unit 1 — Drawings & Specifications',ksb:['S6','K8']},{title:'Supporting Unit 2 — Resource Estimation & Cutting Lists',ksb:['S7','K12']},{title:'Supporting Unit 3 — Hand Tools',ksb:['S9','K14']},{title:'Supporting Unit 4 — Hand Tool Maintenance & Sharpening',ksb:['S11','K15']},{title:'Supporting Unit 5 — Power Tools',ksb:['S10','K17']},{title:'Supporting Unit 6 — Jigs',ksb:['S12','K16']},{title:'Supporting Unit 7 — Structural Fixings',ksb:['S15','K22']},{title:'Supporting Unit 8 — Timber Sizing',ksb:['S16','K23']},{title:'Supporting Unit 9 — Laser Levels',ksb:['S19','K29']},{title:'Supporting Unit 10 — Connections',ksb:['S20','K35']},{title:'Supporting Unit 11 — Measuring, Marking & Cutting',ksb:['S21','K21']},{title:'Supporting Unit 12 — Splicing & Scribing',ksb:['S22','K24']}],
main:[{title:'Main Unit 1 — First Fix Carpentry',ksb:['S14','K27'],supporting_links:['K21','K22','K23'],work_areas:['Structural carcassing','Straight timber/metal partition walls','Floor joists','Floor joist coverings','Straight flights of stairs']},{title:'Main Unit 2 — Second Fix Carpentry',ksb:['S17','K28'],supporting_links:['K11','K21','K30'],work_areas:['Service encasement','Cladding','Wall/floor units and fitments','Handrails and spindles','Internal/external doors','Skirting and architrave','Window boards']},{title:'Main Unit 3 — Roof Carpentry',ksb:['S18','K25'],work_areas:['Trussed roofs','Traditional roofs','Rafters','Verge','Eaves','Loft access']}],
knowledge:[{title:'Knowledge Unit 1 — Principles of Building & Modern Construction',ksb:['K5']},{title:'Knowledge Unit 2 — Digital Design & Modelling',ksb:['K6']},{title:'Knowledge Unit 3 — Timber Materials & Characteristics',ksb:['K9']},{title:'Knowledge Unit 4 — Timber Decay & Repair',ksb:['K10']},{title:'Knowledge Unit 5 — Flat Roofs',ksb:['K26']},{title:'Knowledge Unit 6 — Employment & Business',ksb:['K40']}],
behaviours:[{title:'Behaviour Unit 1 — B1 — Put health, safety and wellbeing first.',ref:'B1'},{title:'Behaviour Unit 2 — B2 — Consider the environment when using resources and carrying out processes.',ref:'B2'},{title:'Behaviour Unit 3 — B3 — Contribute to an inclusive and diverse culture.',ref:'B3'},{title:'Behaviour Unit 4 — B4 — Seek learning and development opportunities.',ref:'B4'},{title:'Behaviour Unit 5 — B5 — Team-focus to meet team goals including, considering the wider build team.',ref:'B5'}]};
const ARCH={
trade:[{title:'Trade Skill Unit 1 — Health & Safety',ksb:['S1','K1','K3']},{title:'Trade Skill Unit 2 — Safety Control Equipment',ksb:['S2','K2']},{title:'Trade Skill Unit 3 — Environment & Sustainability',ksb:['S3','K4']},{title:'Trade Skill Unit 4 — Industry Regulations',ksb:['S4','K7']},{title:'Trade Skill Unit 5 — Safe Working Area',ksb:['S5','K1','K3']},{title:'Trade Skill Unit 6 — Communication',ksb:['S8','K13']},{title:'Trade Skill Unit 7 — Wellbeing',ksb:['S13','K20']}],
supporting:[{title:'Supporting Unit 1 — Drawings & Specifications',ksb:['S6','K8']},{title:'Supporting Unit 2 — Material Estimation & Cutting Lists',ksb:['S7','K12']},{title:'Supporting Unit 3 — Hand Tools',ksb:['S9','K14']},{title:'Supporting Unit 4 — Hand Tool Maintenance & Sharpening',ksb:['S11','K15']},{title:'Supporting Unit 5 — Power Tools',ksb:['S10','K17']},{title:'Supporting Unit 6 — Jigs',ksb:['S12','K16']},{title:'Supporting Unit 7 — Setting Out',ksb:['S23','K32']},{title:'Supporting Unit 8 — Woodworking Joints',ksb:['S24','K33']},{title:'Supporting Unit 9 — Connections',ksb:['S25','K35']},{title:'Supporting Unit 10 — Ironmongery',ksb:['S29','K39']}],
main:[{title:'Main Unit 1 — Timber Window',ksb:['S26','K34'],work_areas:['Manufacture','Assembly','Casement','Glazing rebates','Ironmongery']},{title:'Main Unit 2 — First Fix Joinery',ksb:['S27','K36'],work_areas:['Straight staircases','Door frames','Door linings']},{title:'Main Unit 3 — Second Fix Joinery',ksb:['S28','K37'],work_areas:['Timber doors','Wall/floor units','Timber mouldings','Staircase spindles','Balustrades']},{title:'Main Unit 4 — Fixed Machinery',ksb:['S30','K31'],work_areas:['Inspection','Preparation','Crosscut saw','Band saw','Planer','Thicknesser','Mortiser','Safe operation']}],
knowledge:[{title:'Knowledge Unit 1 — Digital Design & Modelling',ksb:['K6']},{title:'Knowledge Unit 2 — Timber & Timber Products',ksb:['K9']},{title:'Knowledge Unit 3 — Timber Decay & Repair',ksb:['K10']},{title:'Knowledge Unit 4 — Carpentry & Joinery Products',ksb:['K11']},{title:'Knowledge Unit 5 — Finishing Techniques',ksb:['K38']},{title:'Knowledge Unit 6 — Employment & Business',ksb:['K40']}],
behaviours:[{title:'Behaviour Unit 1 — B1 — Put health, safety and wellbeing first.',ref:'B1'},{title:'Behaviour Unit 2 — B2 — Consider the environment when using resources and carrying out processes.',ref:'B2'},{title:'Behaviour Unit 3 — B3 — Contribute to an inclusive and diverse culture.',ref:'B3'},{title:'Behaviour Unit 4 — B4 — Seek learning and development opportunities.',ref:'B4'},{title:'Behaviour Unit 5 — B5 — Team-focus to meet team goals including, considering the wider build team.',ref:'B5'}]};
rebuild('Bricklayer',BRICK);rebuild('Site Carpentry',SITE);rebuild('Architectural Joinery',ARCH);
localStorage.setItem(KEY,JSON.stringify(courses));
window.dispatchEvent(new Event('naxos3:courses-updated'));
})();
