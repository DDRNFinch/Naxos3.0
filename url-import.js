(() => {
  // Manual course structure editor. The file name is retained only because the existing app shell loads it.
  const ready = () => {
    const step = document.querySelector('.step[data-step="2"]');
    const ksb = document.querySelector('#ksbInput');
    if (!step || !ksb || document.querySelector('#manualStructure')) return;

    const box = document.createElement('div');
    box.id = 'manualStructure';
    box.className = 'manual-structure';
    box.innerHTML = `
      <div class="manual-head">
        <div><p class="step-kicker">Course structure</p><h3>Build units and activities manually</h3><p class="muted">Add as many units and activities as you need. Nothing is generated or mapped automatically.</p></div>
        <button id="addUnit" class="secondary" type="button">+ Add unit</button>
      </div>
      <div id="unitsEditor"></div>
    `;
    step.insertBefore(box, step.querySelector('#loadBricklayer') || null);

    const editor = box.querySelector('#unitsEditor');
    let units = [];
    try { units = JSON.parse(localStorage.getItem('naxos_manual_draft') || '[]'); } catch (_) { units = []; }

    const esc = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const read = (root, name) => root.querySelector(`[data-field="${name}"]`)?.value || '';
    const saveDraft = () => localStorage.setItem('naxos_manual_draft', JSON.stringify(units));

    function render() {
      editor.innerHTML = '';
      units.forEach((unit, ui) => {
        const card = document.createElement('section');
        card.className = 'manual-unit';
        card.innerHTML = `
          <div class="manual-unit-head"><strong>Unit ${ui + 1}</strong><button class="text-danger" data-remove-unit type="button">Remove unit</button></div>
          <label>Unit title<input data-field="title" value="${esc(unit.title)}" placeholder="e.g. Health & Safety" /></label>
          <label>Unit description<textarea data-field="description" rows="2" placeholder="What does this unit cover?">${esc(unit.description)}</textarea></label>
          <label>KSB mapping <span class="optional">e.g. S1, S2, K1, B1</span><input data-field="ksb_ids" value="${esc(unit.ksb_ids)}" placeholder="S1, S2, K1" /></label>
          <div class="activity-list"></div>
          <button class="outline-btn" data-add-activity type="button">+ Add activity</button>
        `;
        const list = card.querySelector('.activity-list');
        (unit.activities || []).forEach((activity, ai) => {
          const row = document.createElement('div');
          row.className = 'manual-activity';
          row.innerHTML = `
            <div class="manual-activity-head"><strong>Activity ${ai + 1}</strong><button class="text-danger" data-remove-activity type="button">Remove</button></div>
            <label>Activity title<input data-field="title" value="${esc(activity.title)}" placeholder="e.g. PPE" /></label>
            <label>Activity type<select data-field="activity_type"><option value="practical_evidence" ${activity.activity_type==='practical_evidence'?'selected':''}>Practical evidence</option><option value="knowledge_question" ${activity.activity_type==='knowledge_question'?'selected':''}>Knowledge question</option><option value="witness_testimony" ${activity.activity_type==='witness_testimony'?'selected':''}>Witness testimony</option><option value="other" ${activity.activity_type==='other'?'selected':''}>Other</option></select></label>
            <label>Photo instruction<textarea data-field="photo_instruction" rows="2" placeholder="What photo should the learner provide?">${esc(activity.photo_instruction)}</textarea></label>
            <label>Written response prompt<textarea data-field="written_prompt" rows="3" placeholder="What should the learner write?">${esc(activity.written_prompt)}</textarea></label>
            <label>KSB mapping <input data-field="ksb_ids" value="${esc(activity.ksb_ids)}" placeholder="S1, K1" /></label>
            <div class="two-col"><label><input type="checkbox" data-field="photo_required" ${activity.photo_required!==false?'checked':''}> Photo required</label><label><input type="checkbox" data-field="written_required" ${activity.written_required!==false?'checked':''}> Written response required</label></div>
          `;
          row.querySelector('[data-remove-activity]').onclick = () => { sync(); unit.activities.splice(ai,1); render(); saveDraft(); };
          list.appendChild(row);
        });
        card.querySelector('[data-remove-unit]').onclick = () => { sync(); units.splice(ui,1); render(); saveDraft(); };
        card.querySelector('[data-add-activity]').onclick = () => { sync(); unit.activities.push({title:'',activity_type:'practical_evidence',photo_instruction:'',written_prompt:'',ksb_ids:'',photo_required:true,written_required:true}); render(); saveDraft(); };
        editor.appendChild(card);
      });
    }

    function sync() {
      [...editor.querySelectorAll('.manual-unit')].forEach((card, ui) => {
        const unit = units[ui] || {activities:[]};
        unit.title = read(card,'title');
        unit.description = read(card,'description');
        unit.ksb_ids = read(card,'ksb_ids');
        unit.activities = [...card.querySelectorAll('.manual-activity')].map(row => ({
          title: read(row,'title'), activity_type: read(row,'activity_type'), photo_instruction: read(row,'photo_instruction'), written_prompt: read(row,'written_prompt'), ksb_ids: read(row,'ksb_ids'), photo_required: !!row.querySelector('[data-field="photo_required"]')?.checked, written_required: !!row.querySelector('[data-field="written_required"]')?.checked
        }));
        units[ui] = unit;
      });
      saveDraft();
    }

    box.addEventListener('input', sync);
    box.querySelector('#addUnit').onclick = () => { sync(); units.push({title:'',description:'',ksb_ids:'',activities:[]}); render(); saveDraft(); };
    render();

    // After the existing Naxos builder creates a course, replace its generated structure
    // with the manually authored units/activities, if the user supplied any.
    const buildButton = document.querySelector('#nextStep');
    if (buildButton) buildButton.addEventListener('click', () => {
      setTimeout(() => {
        if (!Array.isArray(units) || !units.length || !units.some(u => (u.activities || []).length)) return;
        sync();
        const courses = JSON.parse(localStorage.getItem('naxos3_courses') || '[]');
        const course = courses[courses.length - 1];
        if (!course) return;
        course.packs = units.map((u, ui) => ({
          id: `P${ui + 1}`,
          title: u.title || `Unit ${ui + 1}`,
          description: u.description || '',
          ksb_ids: String(u.ksb_ids || '').split(',').map(x => x.trim()).filter(Boolean),
          activities: (u.activities || []).map((a, ai) => ({
            id: `P${ui + 1}A${ai + 1}`,
            title: a.title || `Activity ${ai + 1}`,
            activity_type: a.activity_type || 'practical_evidence',
            photo_instruction: a.photo_instruction || '',
            written_prompt: a.written_prompt || '',
            photo_required: !!a.photo_required,
            written_required: !!a.written_required,
            completed: false,
            ksb_ids: String(a.ksb_ids || '').split(',').map(x => x.trim()).filter(Boolean)
          }))
        }));
        course.packCount = course.packs.length;
        course.activityCount = course.packs.reduce((n,p) => n + p.activities.length, 0);
        localStorage.setItem('naxos3_courses', JSON.stringify(courses));
        localStorage.removeItem('naxos_manual_draft');
      }, 50);
    }, true);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();