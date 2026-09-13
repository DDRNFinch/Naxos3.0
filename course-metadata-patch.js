(()=>{
const META_KEY='naxos3_ksb_metadata_draft';
const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const defaults={reference:'',version:'',level:'',typicalDuration:'',assessmentPeriod:'',minimumHours:'',route:'',integration:'',dateUpdated:'',approvedForDelivery:'',larsCode:'',eqaProvider:'',review:''};
function getDraft(){try{return {...defaults,...JSON.parse(localStorage.getItem(META_KEY)||'{}')}}catch{return {...defaults}}}
function setDraft(v){localStorage.setItem(META_KEY,JSON.stringify(v))}
function field(id,label,key,placeholder=''){return `<label class="ksb-meta-field"><span>${label}</span><input id="${id}" data-meta-key="${key}" value="${esc(getDraft()[key])}" placeholder="${esc(placeholder)}"></label>`}
function inject(){
 const builder=document.querySelector('#builder');
 if(!builder||document.querySelector('#ksbMasterDetails'))return;
 const type=builder.querySelector('.type-choice.selected b')?.textContent||'';
 if(!/KSB Course/i.test(type))return;
 const section=document.createElement('section');section.className='studio-section';section.id='ksbMasterDetails';section.innerHTML=`<div class="studio-section-title"><span>02</span><div><h3>Standard details</h3><p>Keep the complete occupational standard information with the master KSB course. These details stay with the course whichever structure you generate.</p></div></div><div class="ksb-meta-grid">${field('metaReference','Reference','reference','ST0095')}${field('metaVersion','Version','version','1.2')}${field('metaLevel','Level','level','2')}${field('metaDuration','Typical duration','typicalDuration','24 months')}${field('metaAssessment','Typical assessment period','assessmentPeriod','3 months')}${field('metaHours','Minimum hours for compliance','minimumHours','578')}${field('metaRoute','Route','route','Construction and the built environment')}${field('metaIntegration','Integration','integration','None')}${field('metaUpdated','Date updated','dateUpdated','09/08/2023')}${field('metaApproved','Approved for delivery','approvedForDelivery','22 June 2018')}${field('metaLars','Lars code','larsCode','287')}${field('metaEqa','EQA provider','eqaProvider','Ofqual')}<label class="ksb-meta-field full"><span>Review</span><textarea id="metaReview" data-meta-key="review" rows="3" placeholder="Review statement">${esc(getDraft().review)}</textarea></label></div><div class="ksb-meta-preview" id="ksbMetaPreview"></div>`;
 const anchor=builder.querySelector('.studio-section');
 anchor?.after(section);
 section.querySelectorAll('[data-meta-key]').forEach(el=>el.addEventListener('input',()=>{const d=getDraft();d[el.dataset.metaKey]=el.value;setDraft(d);renderPreview(d)}));
 renderPreview(getDraft());
}
function renderPreview(d){const box=document.querySelector('#ksbMetaPreview');if(!box)return;box.innerHTML=`<b>KSB course standard record</b><div>Reference: ${esc(d.reference||'—')} · Version: ${esc(d.version||'—')} · Level: ${esc(d.level||'—')}</div><div>Typical duration: ${esc(d.typicalDuration||'—')} · Typical assessment period: ${esc(d.assessmentPeriod||'—')} · Minimum hours: ${esc(d.minimumHours||'—')}</div><div>Route: ${esc(d.route||'—')} · Integration: ${esc(d.integration||'—')}</div><div>Date updated: ${esc(d.dateUpdated||'—')} · Approved for delivery: ${esc(d.approvedForDelivery||'—')}</div><div>Lars code: ${esc(d.larsCode||'—')} · EQA provider: ${esc(d.eqaProvider||'—')}</div><div>Review: ${esc(d.review||'—')}</div>`}
const originalSet=Storage.prototype.setItem;
Storage.prototype.setItem=function(key,value){
 if(key==='naxos3_courses'){
  try{
   const courses=JSON.parse(value);const meta=getDraft();
   if(meta.reference||meta.version||meta.route||meta.minimumHours){
    const idx=courses.length-1;if(idx>=0&&courses[idx].type==='KSB')courses[idx].standardDetails={...meta};
    value=JSON.stringify(courses);
   }
  }catch{}
 }
 return originalSet.call(this,key,value);
};
const observer=new MutationObserver(()=>inject());observer.observe(document.body,{childList:true,subtree:true});
setTimeout(inject,100);
})();
