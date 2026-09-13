(()=>{
const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
function currentDraft(){return window.state?.draft||null}
function inject(){
 const builder=document.querySelector('#builder');
 if(!builder||document.querySelector('#courseWebsiteReference'))return;
 const draft=currentDraft();
 if(!draft)return;
 const section=document.createElement('section');
 section.className='studio-section';
 section.id='courseWebsiteReference';
 section.innerHTML=`<div class="studio-section-title"><span>REF</span><div><h3>Official apprenticeship / standard website</h3><p>Save the official course or apprenticeship page for quick reference. This belongs to the master course and is carried into every structure.</p></div></div><div class="course-website-row"><input id="courseWebsiteUrl" type="url" inputmode="url" autocomplete="url" value="${esc(draft.website||'')}" placeholder="https://www.instituteforapprenticeships.org/..." aria-label="Official apprenticeship or standard website"><button type="button" class="secondary" id="openCourseWebsite" ${draft.website?'':'disabled'}>Open website</button></div><div class="course-website-note" id="courseWebsiteNote">${draft.website?'Saved with this master course.':'Optional — add the official apprenticeship or standard website.'}</div>`;
 const first=builder.querySelector('.studio-section');
 first?.after(section);
 const input=section.querySelector('#courseWebsiteUrl');
 const open=section.querySelector('#openCourseWebsite');
 const note=section.querySelector('#courseWebsiteNote');
 const valid=v=>{try{const u=new URL(v);return u.protocol==='https:'||u.protocol==='http:'}catch{return false}};
 input.addEventListener('input',()=>{
  draft.website=input.value.trim();
  const ok=valid(draft.website);
  open.disabled=!ok;
  note.textContent=!draft.website?'Optional — add the official apprenticeship or standard website.':ok?'Saved with this master course.':'Enter a complete website address beginning with https:// or http://.';
 });
 open.addEventListener('click',()=>{if(valid(input.value.trim()))window.open(input.value.trim(),'_blank','noopener,noreferrer')});
}
const originalSet=Storage.prototype.setItem;
Storage.prototype.setItem=function(key,value){
 if(key==='naxos3_courses'){
  try{
   const courses=JSON.parse(value);
   const draft=currentDraft();
   if(draft&&draft.id){
    const idx=courses.findIndex(c=>c.id===draft.id);
    if(idx>=0)courses[idx].website=draft.website||'';
   }else if(courses.length&&draft){
    courses[courses.length-1].website=draft.website||'';
   }
   value=JSON.stringify(courses);
  }catch{}
 }
 return originalSet.call(this,key,value);
};
new MutationObserver(inject).observe(document.body,{childList:true,subtree:true});
setTimeout(inject,150);
})();
