/* Signal Atlas module engine. Classic scripts intentionally support file://. */
(function () {
  'use strict';
  const root = document.getElementById('module-root');
  if (!root) return;
  const moduleId = root.dataset.module;
  const definition = (window.SignalAtlasModules || {})[moduleId];
  if (!definition) {
    root.innerHTML = '<div class="no-js"><h1>Module could not load</h1><p>Keep the assets folder alongside the topics folder, then reopen this page.</p><a href="../index.html">Return to the atlas</a></div>';
    return;
  }
  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const icons = {
    back:'<path d="m11 4-6 6 6 6M5 10h12"/>', next:'<path d="m9 4 6 6-6 6M15 10H3"/>',
    play:'<path d="m7 4 9 6-9 6Z"/>', pause:'<path d="M7 4v12M13 4v12"/>',
    expand:'<path d="M7 3H3v4m10-4h4v4M3 13v4h4m10-4v4h-4"/>',
    reset:'<path d="M4 7a7 7 0 1 1-1 6M4 2v5h5"/>', check:'<path d="m4 10 4 4 8-8"/>'
  };
  const icon = name => '<svg class="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>';
  const brand = '<a class="brand" href="../index.html" aria-label="Signal Atlas home"><img class="brand-icon" src="../assets/icons/atlas.svg" alt=""><span>SIGNAL ATLAS</span></a>';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const initialState = () => JSON.parse(JSON.stringify(definition.initialState || {}));
  let state = initialState();
  let current = 0;
  let playing = !reducedMotion.matches;
  let completed = false;
  let answers = {};
  const visited = new Set();
  const storageKey = 'signal-atlas:v1:'+moduleId;
  try { const saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); if (saved.answers && typeof saved.answers === 'object') answers = saved.answers; } catch (_) { /* Local-file storage can be unavailable. */ }
  const save = () => { try { localStorage.setItem(storageKey, JSON.stringify({answers})); } catch (_) {} };
  const step = () => definition.steps[current];
  const isMechanism = () => !completed && (!step().type || step().type === 'mechanism');
  const quizIndices = definition.steps.map((item,index)=>item.type==='quiz'?index:-1).filter(index=>index>=0);
  const correctCount = () => quizIndices.filter(index=>answers[index]===definition.steps[index].quiz.correct).length;
  root.style.setProperty('--accent', definition.accent || '#a3edce');
  root.innerHTML = `
    <header class="module-header">
      <div class="module-heading">${brand}<span class="module-brand-divider"></span><div class="module-title-wrap"><div class="eyebrow">MODULE ${escape(definition.number)} / ${escape(definition.discipline)}</div><h1>${escape(definition.title)}</h1></div></div>
      <nav class="header-controls" aria-label="Playback and slide navigation">
        <button class="button back-control" id="previous-step" aria-label="Previous slide">${icon('back')}<span class="button-label">Back</span></button>
        <button class="button play-control" id="play-pause" aria-label="Pause simulation">${icon('pause')}<span class="button-label">Pause</span></button>
        <button class="button next-control" id="next-step" aria-label="Next slide"><span class="button-label">Next</span>${icon('next')}</button>
        <span class="control-separator"></span><button class="icon-button" id="fullscreen" aria-label="Enter fullscreen" title="Enter fullscreen">${icon('expand')}</button>
      </nav>
    </header>
    <div class="module-body">
      <aside class="module-sidebar" aria-label="Module guide">
        <div class="sidebar-step-content"><div class="slide-counter"><span>CHAPTER <strong id="slide-number"></strong></span><span id="slide-category"></span></div><div class="progress-track" role="progressbar" aria-label="Module progress" aria-valuemin="0" aria-valuemax="100"><span id="progress-fill"></span></div><h2 class="step-title" id="step-title" tabindex="-1"></h2><p class="step-description" id="step-description"></p></div>
        <div class="step-controls" id="step-controls"></div>
        <nav class="module-step-nav" aria-label="Module chapters"><p class="eyebrow">Inside this module</p><ol class="step-list" id="step-list"></ol></nav>
        <div class="sidebar-bottom"><button class="reset-module" id="reset-module">${icon('reset')}Restart module</button></div>
      </aside>
      <main class="module-workspace" id="main-content" tabindex="-1">
        <section class="metric-strip" id="metric-strip" aria-label="Illustrative scientific measurements"></section>
        <section class="stage-panel" aria-labelledby="stage-title">
          <header class="stage-header"><div><div class="stage-kicker" id="stage-kicker"></div><h2 class="stage-title" id="stage-title"></h2></div><div><div class="stage-subtitle" id="stage-subtitle"></div><span class="live-state" id="live-state"><i></i><span>SIMULATION ACTIVE</span></span></div></header>
          <div class="science-viewport" id="science-viewport"></div>
        </section>
        <aside class="context-panel" id="context-panel"><div><div class="context-label">What is happening?</div><div class="context-title" id="context-title"></div></div><p class="context-body" id="context-body"></p></aside>
      </main>
    </div>
    <footer class="module-footer"><span class="model-note" id="model-note">Simplified educational model · not a clinical prediction</span><div class="footer-shortcuts"><span><kbd>←</kbd><kbd>→</kbd>Navigate</span><span><kbd>SPACE</kbd>Play / pause</span><button class="footer-fullscreen" id="footer-fullscreen">${'⛶'} Fullscreen</button></div></footer>
    <div class="sr-only" role="status" aria-live="polite" id="announcement"></div>`;
  const $ = id => document.getElementById(id);
  const announce = message => { $('announcement').textContent = message; };
  function renderNavigation() {
    $('step-list').innerHTML = definition.steps.map((item,index)=>`<li><button class="step-nav-button" data-step="${index}" ${index===current&&!completed?'aria-current="step"':''} aria-label="Chapter ${index+1}: ${escape(item.title)}"><span class="nav-number">${String(index+1).padStart(2,'0')}</span><span class="nav-name">${escape(item.title)}</span>${item.type==='quiz'&&answers[index]===item.quiz.correct?'<span class="nav-done" aria-label="answered correctly">✓</span>':''}</button></li>`).join('');
  }
  function renderControls() {
    $('step-controls').innerHTML = (isMechanism() ? step().controls || [] : []).map((control,controlIndex) => {
      const groupId = 'group-'+controlIndex;
      const value = state[control.id] ?? control.value ?? control.min ?? '';
      const hint = control.hint ? `<p class="control-hint" id="hint-${escape(control.id || control.label)}">${escape(control.hint)}</p>` : '';
      if (control.type==='range') return `<div class="control-group"><label class="control-label" for="control-${escape(control.id)}">${escape(control.label)}<output id="output-${escape(control.id)}" for="control-${escape(control.id)}">${escape(value)}${escape(control.unit || '')}</output></label><input class="range-input" type="range" id="control-${escape(control.id)}" data-control="${escape(control.id)}" min="${control.min}" max="${control.max}" step="${control.step || 1}" value="${escape(value)}" ${control.hint?'aria-describedby="hint-'+escape(control.id)+'"':''}><div class="range-endpoints" aria-hidden="true"><span>${control.min}${escape(control.unit||'')}</span><span>${control.max}${escape(control.unit||'')}</span></div>${hint}</div>`;
      const choices = control.type==='choices';
      return `<div class="control-group"><div class="control-label" id="${groupId}">${escape(control.label)}</div><div class="choice-group" role="group" aria-labelledby="${groupId}">${control.options.map(option=>`<button class="choice-button ${choices?'':'action-button'}" ${choices?`data-choice="${escape(control.id)}" data-value="${escape(option.value)}" aria-pressed="${String(value)===String(option.value)}"`:`data-action="${escape(option.action)}"`}>${escape(option.label)}</button>`).join('')}</div>${hint}</div>`;
    }).join('');
  }
  function renderMetrics() {
    if (!isMechanism()) return;
    const metrics = definition.metrics ? definition.metrics(state,step()) : [];
    $('metric-strip').hidden = !metrics.length;
    $('metric-strip').style.setProperty('--metric-count',metrics.length);
    $('metric-strip').innerHTML = metrics.map(metric=>`<div class="metric"><div class="metric-label">${escape(metric.label)}</div><div class="metric-reading"><strong class="metric-value">${escape(metric.value)}</strong>${metric.unit?`<span class="metric-unit">${escape(metric.unit)}</span>`:''}${metric.trend?`<span class="metric-trend">${escape(metric.trend)}</span>`:''}</div></div>`).join('');
  }
  function applyPlayback() {
    const animate = playing && isMechanism();
    root.classList.toggle('is-paused',!animate);
    $('play-pause').disabled = !isMechanism();
    $('play-pause').setAttribute('aria-label',playing?'Pause simulation':'Play simulation');
    $('play-pause').setAttribute('aria-pressed',String(animate));
    $('play-pause').innerHTML = icon(playing?'pause':'play')+`<span class="button-label">${playing?'Pause':'Play'}</span>`;
    $('live-state').hidden = !isMechanism();
    $('live-state').querySelector('span').textContent = animate?'SIMULATION ACTIVE':'SIMULATION PAUSED';
    $('science-viewport').querySelectorAll('svg').forEach(svg=>{if(typeof svg.pauseAnimations==='function'){if(animate)svg.unpauseAnimations();else svg.pauseAnimations();}});
  }
  function renderMechanism() {
    $('science-viewport').className='science-viewport';
    $('science-viewport').innerHTML = definition.render(state,step());
    const context = typeof step().context==='function'?step().context(state):step().context;
    $('context-panel').hidden=!context;
    $('context-title').textContent=context?.title || '';
    $('context-body').textContent=context?.body || '';
    renderMetrics();
    applyPlayback();
  }
  function sourcesMarkup(sources) {
    if (!sources?.length) return '';
    return `<div class="source-list"><span class="eyebrow">Read the science / selected references</span>${sources.map(source=>`<a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.label)} ↗</a>`).join('')}</div>`;
  }
  function renderQuiz() {
    const quiz=step().quiz;
    const answer=answers[current];
    const answered=Number.isInteger(answer) && answer>=0 && answer<quiz.options.length;
    const correct=answered&&answer===quiz.correct;
    $('science-viewport').innerHTML=`<div class="quiz-layout"><div class="quiz-topline"><span>CHECKPOINT ${String(quizIndices.indexOf(current)+1).padStart(2,'0')} / ${String(quizIndices.length).padStart(2,'0')}</span><span>${correctCount()} OF ${quizIndices.length} UNDERSTOOD</span></div><h3 class="quiz-question">${escape(quiz.question)}</h3><div class="quiz-options" role="group" aria-label="Answer choices">${quiz.options.map((option,index)=>`<button class="quiz-option ${answered&&index===answer?(correct?'is-correct':'is-wrong'):''}" data-answer="${index}" ${answered?'disabled':''}><span class="quiz-letter">${answered&&index===answer?(correct?'✓':'×'):String.fromCharCode(65+index)}</span><span>${escape(option)}</span></button>`).join('')}</div>${answered?`<div class="quiz-feedback ${correct?'':'is-wrong'}" role="status"><strong class="feedback-heading">${correct?'That’s right.':'Take another look.'}</strong><p>${escape(quiz.explanation)}</p><button class="quiz-retry" data-retry="true">${correct?'Try again':'Retry this checkpoint'}</button></div>`:''}</div>`;
  }
  function renderReading() {
    $('science-viewport').className='reading-viewport';
    const item=step();
    if (item.type==='glossary') $('science-viewport').innerHTML=`<div class="glossary-grid">${item.terms.map((term,index)=>`<article class="term-card"><span class="term-index">${String(index+1).padStart(2,'0')} / FIELD NOTES</span><h3>${escape(term.term)}</h3><p>${escape(term.definition)}</p></article>`).join('')}</div>`;
    else if (item.type==='facts') $('science-viewport').innerHTML=`<div class="facts-grid">${item.facts.map((fact,index)=>`<article class="fact-card"><div class="fact-number">0${index+1}</div><h3>${escape(fact.title)}</h3><p>${escape(fact.body)}</p></article>`).join('')}</div>${sourcesMarkup(item.sources || definition.sources)}`;
    else if (item.type==='quiz') renderQuiz();
  }
  function renderStep() {
    completed=false;
    visited.add(current);
    const item=step();
    $('slide-number').textContent=String(current+1).padStart(2,'0')+' / '+String(definition.steps.length).padStart(2,'0');
    $('slide-category').textContent=item.type==='quiz'?'CHECKPOINT':item.type==='glossary'?'FIELD NOTES':item.type==='facts'?'PERSPECTIVE':'EXPLORATION';
    const progress=Math.round((current+1)/definition.steps.length*100);
    $('progress-fill').style.width=progress+'%';
    root.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',progress);
    $('step-title').textContent=item.title;
    $('step-description').textContent=item.description || '';
    $('stage-kicker').textContent=item.type==='quiz'?'Test your understanding':item.type==='glossary'?'The language of the system':item.type==='facts'?'Beyond the model':'Interactive mechanism / '+definition.number;
    $('stage-title').textContent=item.stageTitle || item.title;
    $('stage-subtitle').textContent=item.stageSubtitle || (isMechanism()?'Change a variable. Follow the signal.':'');
    $('model-note').textContent=item.note || 'Simplified educational model · not a clinical prediction';
    $('previous-step').disabled=current===0;
    $('next-step').innerHTML=`<span class="button-label">${current===definition.steps.length-1?'Finish':'Next'}</span>${icon('next')}`;
    $('next-step').setAttribute('aria-label',current===definition.steps.length-1?'Finish module':'Next slide');
    $('metric-strip').hidden=!isMechanism();
    $('context-panel').hidden=!isMechanism();
    $('main-content').classList.toggle('is-reading',!isMechanism());
    renderNavigation();renderControls();
    if (isMechanism()) renderMechanism(); else { $('metric-strip').innerHTML='';renderReading();applyPlayback(); }
    const viewport=$('science-viewport');viewport.scrollTop=0;
    root.querySelector('.module-sidebar').scrollTop=0;
  }
  function goTo(index, fromHash) {
    if (index<0||index>=definition.steps.length) return;
    current=index;completed=false;
    if (definition.onEnter) definition.onEnter(state,step(),current);
    renderStep();
    if (!fromHash) { try { history.replaceState(null,'','#step-'+(current+1)); } catch (_) {} }
    announce('Chapter '+(current+1)+': '+step().title);
  }
  function finish() {
    completed=true;
    $('main-content').classList.add('is-reading');
    $('metric-strip').hidden=true;$('metric-strip').innerHTML='';$('context-panel').hidden=true;$('step-controls').innerHTML='';
    $('stage-kicker').textContent='Module '+definition.number+' / Exploration complete';$('stage-title').textContent='The signal, connected.';$('stage-subtitle').textContent='';
    $('step-title').textContent='Keep making connections.';$('step-description').textContent='Revisit any chapter, test another variable, or explore a different system in the atlas.';$('slide-category').textContent='COMPLETE';
    const total=quizIndices.length, score=correctCount();
    $('science-viewport').className='reading-viewport';
    $('science-viewport').innerHTML=`<div class="completion-layout"><div class="completion-orbit">${definition.number}</div><div class="eyebrow">You explored ${escape(definition.discipline)}</div><h2>A mechanism becomes a map.</h2><p>You’ve reached the end of ${escape(definition.title)}. ${score} of ${total} checkpoints understood.${score<total?' Revisit the checkpoints to complete your understanding.':' Keep experimenting—the controls are yours.'}</p><div class="completion-actions"><a class="button button-primary" href="../index.html#modules">Explore the atlas ${icon('next')}</a><button class="button" data-review-quizzes>Review checkpoints</button></div></div>${sourcesMarkup(definition.sources)}`;
    $('next-step').disabled=true;applyPlayback();announce('Module complete. '+score+' of '+total+' checkpoints understood.');
  }
  function next() {if(completed)return;if(current===definition.steps.length-1)finish();else goTo(current+1);}
  function previous() {if(completed){$('next-step').disabled=false;goTo(current);}else goTo(current-1);}
  function togglePlay() {if(!isMechanism())return;playing=!playing;applyPlayback();announce(playing?'Simulation playing.':'Simulation paused.');}
  function updateControl(id,value) {
    state[id]=value;
    if (definition.onControl) definition.onControl(state,id,value,step());
    renderMechanism();
  }
  $('step-controls').addEventListener('input',event=>{
    const input=event.target.closest('[data-control]');if(!input)return;
    const control=step().controls.find(item=>item.id===input.dataset.control);
    const value=Number(input.value);updateControl(input.dataset.control,value);
    $('output-'+input.dataset.control).textContent=value+(control.unit||'');
  });
  root.addEventListener('click',event=>{
    const target=event.target.closest('button');if(!target)return;
    if(target.dataset.step!==undefined){$('next-step').disabled=false;goTo(Number(target.dataset.step));$('step-title').focus({preventScroll:true});}
    else if(target.dataset.choice){const control=step().controls.find(item=>item.id===target.dataset.choice);const option=control.options.find(item=>String(item.value)===target.dataset.value);updateControl(target.dataset.choice,option.value);renderControls();$('step-controls').querySelector(`[data-choice="${target.dataset.choice}"][data-value="${target.dataset.value}"]`)?.focus({preventScroll:true});}
    else if(target.dataset.action&&isMechanism()){if(definition.onAction)definition.onAction(state,target.dataset.action,step());renderMechanism();renderControls();$('step-controls').querySelector(`[data-action="${target.dataset.action}"]`)?.focus({preventScroll:true});}
    else if(target.dataset.answer!==undefined){answers[current]=Number(target.dataset.answer);save();renderQuiz();renderNavigation();$('science-viewport').querySelector('.quiz-retry')?.focus({preventScroll:true});}
    else if(target.dataset.retry){delete answers[current];save();renderQuiz();renderNavigation();$('science-viewport').querySelector('.quiz-option')?.focus({preventScroll:true});}
    else if(target.hasAttribute('data-review-quizzes')){$('next-step').disabled=false;goTo(quizIndices.find(index=>answers[index]!==definition.steps[index].quiz.correct) ?? quizIndices[0]);}
  });
  $('previous-step').addEventListener('click',previous);$('next-step').addEventListener('click',next);$('play-pause').addEventListener('click',togglePlay);
  $('reset-module').addEventListener('click',()=>{state=initialState();answers={};save();visited.clear();$('next-step').disabled=false;goTo(0);announce('Module restarted. Checkpoint progress cleared.');});
  async function fullscreen() {
    if(document.fullscreenElement){await document.exitFullscreen();return;}
    if(root.classList.contains('fullscreen-fallback')){root.classList.remove('fullscreen-fallback');updateFullscreenLabel();return;}
    try {if(!root.requestFullscreen)throw new Error('Fullscreen not available');await root.requestFullscreen();}
    catch(_){root.classList.add('fullscreen-fallback');updateFullscreenLabel();announce('Expanded view enabled. Press Escape to exit.');}
  }
  function updateFullscreenLabel(){const active=Boolean(document.fullscreenElement)||root.classList.contains('fullscreen-fallback');$('fullscreen').setAttribute('aria-label',active?'Exit fullscreen':'Enter fullscreen');$('fullscreen').title=active?'Exit fullscreen':'Enter fullscreen';$('footer-fullscreen').textContent=active?'⛶ Exit fullscreen':'⛶ Fullscreen';}
  $('fullscreen').addEventListener('click',fullscreen);$('footer-fullscreen').addEventListener('click',fullscreen);document.addEventListener('fullscreenchange',updateFullscreenLabel);
  document.addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey)return;
    if(event.key==='Escape'&&root.classList.contains('fullscreen-fallback')){root.classList.remove('fullscreen-fallback');updateFullscreenLabel();return;}
    if(event.target.closest('input,select,textarea,[contenteditable="true"]'))return;
    if(event.key==='ArrowRight'){event.preventDefault();next();}
    if(event.key==='ArrowLeft'){event.preventDefault();previous();}
    if(event.code==='Space'&&!event.target.closest('button,a')){event.preventDefault();togglePlay();}
  });
  function readHash(){const match=location.hash.match(/^#step-(\d+)$/);return match?Math.max(0,Math.min(definition.steps.length-1,Number(match[1])-1)):0;}
  window.addEventListener('hashchange',()=>{if(!/^#step-\d+$/.test(location.hash))return;$('next-step').disabled=false;goTo(readHash(),true);});
  reducedMotion.addEventListener?.('change',event=>{if(event.matches){playing=false;applyPlayback();}});
  let last=performance.now(),accumulator=0;
  function frame(now){const dt=Math.min((now-last)/1000,.5);last=now;if(playing&&isMechanism()&&!document.hidden&&definition.tick){accumulator+=dt;if(accumulator>=.25){const elapsed=accumulator;accumulator=0;if(definition.tick(state,elapsed,step()))renderMechanism();}}else accumulator=0;requestAnimationFrame(frame);}
  goTo(readHash(),true);requestAnimationFrame(frame);
  // Small read-only hook for integration checks and extension authors.
  window.SignalAtlasEngine={getCurrentStep:()=>current,getState:()=>({...state}),getModule:()=>definition.id};
})();
