(() => {
  const originalShow = window.show;
  window.show = function(view) {
    const previous = state.view;
    state.view = view;
    document.querySelectorAll('.page,.home').forEach(x => x.classList.add('hidden'));
    const el = document.querySelector(view === 'home' ? '#homeView' : `#${view}View`);
    if (el) el.classList.remove('hidden');
    if (view === 'ksb' || view === 'nvq') renderLists();
    if (view === 'course') renderCourse();
    if (view === 'create') {
      if (previous === 'course' && state.draft) renderBuilder();
      else startCreate();
    }
    window.scrollTo({top:0,behavior:'instant'});
  };
})();
