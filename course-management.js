(()=>{
const esc2=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
function cloneCourse(c){return JSON.parse(JSON.stringify(c))}
function beginEditCourse(){if(!state.selected)return;state.draft=cloneCourse(state.selected);renderBuilder();show('create')}
function deleteCourse(){const c=state.selected;if(!c)return;if(!confirm(`Delete “${c.title}”? This cannot be undone.`))return;state.courses=state.courses.filter(x=>x.id!==c.id);save();state.selected=null;show(c.type==='KSB'?'ksb':'nvq')}
function saveEditedCourse(){const d=state.draft;if(!d||!d.id)return;const i=state.courses.findIndex(x=>x.id===d.id);if(i<0){saveCourse();return}if(!d.type||!d.title.trim()||!d.ksbs.length||!d.units.length){alert('Choose a course type, enter a title, add at least one KSB and add at least one unit.');return}const course={...cloneCourse(d),title:d.title.trim(),reference:d.ref?.trim()||d.reference?.trim()||'',version:d.version?.trim()||'',level:d.level?.trim()||'',duration:d.duration?.trim()||''};course.ksbCount=course.ksbs.length;course.packCount=course.units.length;course.activityCount=course.units.reduce((n,u)=>n+(u.activities?.length||0),0);state.courses[i]=course;save();state.selected=course;show('course')}
const originalSaveCourse=saveCourse;
saveCourse=function(){if(state.draft?.id){saveEditedCourse();return}originalSaveCourse()};
const originalRenderCourse=renderCourse;
renderCourse=function(){originalRenderCourse();const c=state.selected;if(!c)return;const header=document.querySelector('#courseView .page-header');if(!header)return;let actions=header.querySelector('.course-actions');if(!actions){actions=document.createElement('div');actions.className='course-actions';header.appendChild(actions)}actions.innerHTML='<button class="secondary course-edit" type="button">Edit course</button><button class="danger course-delete" type="button">Delete course</button>';actions.querySelector('.course-edit').onclick=beginEditCourse;actions.querySelector('.course-delete').onclick=deleteCourse};
const originalStartCreate=startCreate;
startCreate=function(){state.draft=blankDraft();renderBuilder()};
window.beginEditCourse=beginEditCourse;
})();
