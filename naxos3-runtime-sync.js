(()=>{
// The course seed and activity installer write to localStorage after app.js has already
// initialised state. Re-sync the live app state so the newly installed course is visible
// immediately without requiring a second page load.
try{
  if(typeof state!=='undefined'){
    state.courses=JSON.parse(localStorage.getItem('naxos3_courses')||'[]');
    state.selected=null;
  }
}catch(e){console.warn('Naxos runtime course sync failed',e)}
})();
