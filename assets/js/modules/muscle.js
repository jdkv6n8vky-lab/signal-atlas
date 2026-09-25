/* Signal Atlas / muscle contraction. No dependencies. One clock owns all animation.
   Geometry is conserved: Z discs + thin filaments translate; filament lengths never scale.
   The lab illustrates a lightly loaded fiber, not a measured force-length relationship. */
(() => {
  'use strict';
  const content = window.SignalAtlasMuscleContent;
  if (!content) return;
  const { steps, glossary, facts, quiz, sources } = content;
  const $ = id => document.getElementById(id);
  const root = $('module-root');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 600px)');
  const colors = { actin: '#e29aab', myosin: '#7cced6', ca: '#c0a5f5', signal: '#a3edce', force: '#edc584', tropo: '#e8b16d' };
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));
  const announce = message => { $('announcement').textContent = message; };
  const storeKey = 'signal-atlas-muscle-checkpoints-v2';
  let answers = {};
  try { const saved = JSON.parse(localStorage.getItem(storeKey) || '{}'); for (const [key, value] of Object.entries(saved || {})) if (quiz[key] && Number.isInteger(value) && value >= 0 && value < quiz[key].options.length) answers[key] = value; } catch (_) { /* Local-file and privacy modes still work. */ }
  function save() { try { localStorage.setItem(storeKey, JSON.stringify(answers)); } catch (_) { /* Persistence is optional. */ } }
  const initial = () => ({ index: 0, ca: 0, calciumSet: 85, frequency: 10, atp: true, force: 0, length: 100, rigor: false, rigorLength: 100, custom: false, mode: 'clamp', run: null, history: [], modelTime: 0, traceClock: 0, pendingPulse: false, phase: 0, cycle: false, cycleElapsed: 0, cycleTurns: 0, autoplay: false, autoplayTime: 0, motion: !reduced.matches, clock: 0, bands: true });
  let state = initial();
  let quizIndex = 0, completed = false, last = 0, paintTime = 0, svgWidth = 960;
  const isMechanism = () => !completed && state.index < 17;
  const isSarco = () => isMechanism() && steps[state.index].scene === 'sarco';
  const isLab = () => isMechanism() && state.index >= 7;
  const percent = value => `${Math.round(value)}<small>%</small>`;
  function activation(ca) { const x = Math.pow(ca, 3.2); return x / (x + Math.pow(36, 3.2)); }
  function targetForce() {
    if (!state.atp || state.index === 16 && !state.custom) return 0;
    const allowed = state.custom || state.run || state.index >= 10 && state.index <= 14;
    // Guided chapters first establish attachment, then the stroke, then the
    // ensemble. A learner's direct intervention unlocks the whole motor.
    const stageGain = !state.custom && state.index >= 10 && state.index <= 12 ? .6 : 1;
    return allowed ? activation(state.ca) * 100 * stageGain : 0;
  }
  function stagePhase() { return state.index >= 9 && state.index <= 12 ? state.index - 9 : 0; }
  function phaseName() { return ['Attach', 'Power stroke', 'ATP binding', 'ATP hydrolysis'][state.phase]; }
  function legend(items) { return items.map(([name, color]) => `<span><i style="--ink:${color}"></i>${name}</span>`).join(''); }
  function svgOpen(w, h, title, desc) { return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="muscle-svg-title muscle-svg-desc"><title id="muscle-svg-title">${title}</title><desc id="muscle-svg-desc">${desc}</desc><defs><linearGradient id="muscle-membrane" x2="0" y2="1"><stop stop-color="#263f47"/><stop offset="1" stop-color="#10202b"/></linearGradient><linearGradient id="muscle-terminal" x2=".8" y2="1"><stop stop-color="#2e4f4c"/><stop offset="1" stop-color="#142a32"/></linearGradient><linearGradient id="muscle-thick"><stop stop-color="#477d91"/><stop offset=".5" stop-color="#9bdde1"/><stop offset="1" stop-color="#477d91"/></linearGradient><pattern id="muscle-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" stroke="#52727b" stroke-opacity=".07" fill="none"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#muscle-grid)"/>`; }
  function renderNMJ() {
    const w = compact.matches ? 560 : 960, h = compact.matches ? 480 : 430;
    svgWidth = w;
    const c = w / 2, membrane = compact.matches ? 302 : 268, terminal = membrane - 120;
    let out = svgOpen(w, h, 'Neuromuscular junction: electrical to chemical to electrical', 'An arriving motor-neuron action potential opens presynaptic calcium channels. Acetylcholine reaches nicotinic receptors; their end-plate current can trigger a muscle action potential through nearby voltage-gated sodium channels.');
    out += `<path d="M${c - 190} 38V${terminal - 70}Q${c - 220} ${terminal - 30} ${c - 190} ${terminal + 10}Q${c - 165} ${terminal + 52} ${c} ${terminal + 52}Q${c + 165} ${terminal + 52} ${c + 190} ${terminal + 10}Q${c + 205} ${terminal - 20} ${c + 158} ${terminal - 65}V38" fill="url(#muscle-terminal)" stroke="#789b90" stroke-width="2"/>
    <path d="M${c - 152} 40V${terminal - 50}" stroke="#a3edce" stroke-width="3" stroke-dasharray="5 9" opacity=".4"/>
    <text x="${c - 118}" y="66" class="main-label">Motor neuron</text><text x="${c - 118}" y="91" class="small-label">AXON TERMINAL</text>
    <path d="M28 ${membrane}H${w - 28}V${h - 42}H28Z" fill="url(#muscle-membrane)" opacity=".65"/>
    <path d="M28 ${membrane}H${w - 28}M28 ${membrane + 9}H${w - 28}" stroke="#7fa0ae" stroke-width="2"/>
    <text x="32" y="${h - 18}" class="small-label">MUSCLE FIBER · SARCOLEMMA</text>`;
    for (const x of [c - 85, c, c + 85]) {
      out += `<circle cx="${x}" cy="${terminal}" r="22" fill="#8ea9860c" stroke="#a5bba1" stroke-width="1.5"/>`;
      for (let j = 0; j < 5; j++) out += `<circle cx="${x + Math.cos(j * 1.26) * 11}" cy="${terminal + Math.sin(j * 1.26) * 11}" r="3.5" fill="${colors.force}"/>`;
    }
    out += `<g id="nmj-presynaptic" opacity="${state.index >= 1 ? 1 : .35}"><path d="M${c + 135} ${terminal + 22}v32m12-32v32" stroke="${colors.ca}" stroke-width="7" stroke-linecap="round"/><text x="${c + 160}" y="${terminal - 10}" text-anchor="middle">Ca²⁺</text></g>`;
    for (let j = 0; j < 3; j++) out += `<g transform="translate(${c - 80 + j * 80},${membrane})"><path d="M-9-9V18M9-9V18" stroke="${state.index >= 2 ? colors.force : '#748591'}" stroke-width="8" stroke-linecap="round"/></g>`;
    out += `<text x="${c}" y="${membrane + 50}" text-anchor="middle">Nicotinic ACh receptors</text><text x="${c}" y="${membrane + 76}" text-anchor="middle" class="small-label">${state.index >= 2 ? 'NET Na⁺ IN / K⁺ OUT → END-PLATE POTENTIAL' : 'LIGAND-GATED ION CHANNELS'}</text>
    <g id="nmj-sodium" opacity="${state.index >= 3 ? 1 : .3}"><path d="M${w - 95} ${membrane - 12}v35m14-35v35" stroke="${colors.signal}" stroke-width="7" stroke-linecap="round"/></g>
    <text x="${c}" y="${membrane - 19}" text-anchor="middle" class="small-label">SYNAPTIC CLEFT</text>
    <g id="nmj-particles"></g><circle id="nmj-ap" r="8" fill="${colors.signal}" class="m-packet"/></svg>`;
    $('diagram').innerHTML = out;
    $('diagram').dataset.membrane = membrane;
    $('diagram').dataset.terminal = terminal;
    $('diagramLegend').innerHTML = legend([['ACh', colors.force], ['Presynaptic Ca²⁺', colors.ca], ['Electrical signal', colors.signal]]);
  }
  function renderTriad() {
    const w = compact.matches ? 560 : 960, h = 430, c = w / 2;
    svgWidth = w;
    const gap = compact.matches ? 70 : 92, srW = compact.matches ? 142 : 260;
    let out = svgOpen(w, h, 'Excitation–contraction coupling at a skeletal-muscle triad', 'A T-tubule sits between two SR terminal cisternae. CaV1.1 in the T-tubule membrane senses voltage and couples to RyR1 in the SR membrane. RyR1 releases calcium into the cytosol; SERCA pumps it back using ATP.');
    out += `<path d="M22 58H${c - 28}V274Q${c} 312 ${c + 28} 274V58H${w - 22}" fill="none" stroke="#769aab" stroke-width="14"/><path d="M22 58H${c - 28}V274Q${c} 312 ${c + 28} 274V58H${w - 22}" fill="none" stroke="#b7d3d6" stroke-opacity=".25" stroke-width="3"/>
    <text x="${c}" y="30" text-anchor="middle" class="small-label">SARCOLEMMA</text><text x="${c}" y="345" text-anchor="middle">T-tubule</text>`;
    for (const side of [-1, 1]) {
      const x = side < 0 ? c - gap - srW : c + gap;
      out += `<rect x="${x}" y="117" width="${srW}" height="177" rx="26" fill="#382e5345" stroke="#8c789e" stroke-width="2"/><text x="${x + srW / 2}" y="149" text-anchor="middle" class="main-label">SR</text><text x="${x + srW / 2}" y="174" text-anchor="middle" class="small-label">Ca²⁺ STORE</text>`;
      for (let i = 0; i < 15; i++) out += `<circle cx="${x + 23 + (i % 5) * (srW - 46) / 4}" cy="${196 + Math.floor(i / 5) * 26}" r="4" fill="${colors.ca}" opacity=".65"/>`;
      const ry = c + side * gap, dh = c + side * 29;
      out += `<path d="M${dh} 206H${ry}" stroke="#cdbe9e" stroke-width="3" stroke-dasharray="4 4"/><rect x="${dh - 10}" y="183" width="20" height="45" rx="7" fill="${state.index >= 5 && state.index < 15 ? '#edc584' : '#8197a1'}"/><path d="M${ry - 6} 183v45m12-45v45" stroke="${state.index === 6 ? colors.ca : '#b3a2c8'}" stroke-width="8" stroke-linecap="round"/>
      <path d="M${x + srW / 2 - 11} 290l11-11 11 11-11 11Z" fill="${state.index === 15 ? colors.signal : '#708d88'}"/>`;
    }
    out += `<text x="${c - gap - srW / 2}" y="330" text-anchor="middle" class="small-label">SERCA ↑ ATP</text><text x="${c + gap + srW / 2}" y="330" text-anchor="middle" class="small-label">SERCA ↑ ATP</text><text x="${c - gap - 10}" y="101" text-anchor="end">RyR1</text><path d="M${c - gap - 15} 106L${c - gap} 178" stroke="#807b99" fill="none"/><text x="${c + gap + 10}" y="101">CaV1.1</text><path d="M${c + gap + 17} 108L${c + 29} 178" stroke="#a49b84" fill="none"/>
    <text id="triad-caption" x="${c}" y="394" text-anchor="middle" class="small-label">${state.index === 15 ? 'ATP-POWERED UPTAKE → CYTOSOLIC Ca²⁺ FALLS' : 'VOLTAGE SENSOR → RELEASE CHANNEL'}</text><g id="triad-particles"></g><circle id="triad-ap" r="7" fill="${colors.signal}" class="m-packet"/></svg>`;
    $('diagram').innerHTML = out;
    $('diagramLegend').innerHTML = legend([['CaV1.1 / DHPR', colors.force], ['RyR1 + stored Ca²⁺', colors.ca], ['SERCA', colors.signal]]);
  }
  function thinFilament(length, row, side) {
    let out = `<g class="thin-filament" data-side="${side}" data-filament-length="${length}"><path d="M0 ${row}H${side * length}" stroke="${colors.actin}" stroke-width="5" opacity=".5"/>`;
    for (let x = 9; x < length; x += 13) out += `<circle cx="${side * x}" cy="${row + Math.sin(x / 13) * 4}" r="5" fill="${colors.actin}"/><circle cx="${side * x}" cy="${row - Math.sin(x / 13) * 4}" r="3.5" fill="#f5bfca" opacity=".85"/>`;
    out += `<path class="tropomyosin-strand" d="M0 ${row - 2}H${side * length}" stroke="${colors.tropo}" stroke-width="3.2" fill="none"/>`;
    for (let x = 35; x < length; x += 66) out += `<g class="troponin" transform="translate(${side * x},${row - 5})"><path d="M-5 0L0-7 7-1 3 6Z" fill="#d8dfce"/><circle class="bound-calcium" cx="3" cy="-13" r="4" fill="${colors.ca}"/></g>`;
    return out + '</g>';
  }
  function renderSarco() {
    const w = compact.matches ? 560 : 960, h = 375;
    svgWidth = w;
    const a = w * .29, b = w * .71, thin = w * .31;
    let out = svgOpen(w, h, 'Sliding filaments within a sarcomere', 'Pink actin thin filaments extend inward from the Z discs. Cyan myosin thick filaments remain centered on the M line. The fixed-length thin filaments slide inward during shortening; the I bands and H zone narrow, while A-band length remains constant.');
    out += `<g id="sarco-bands"><rect id="band-i-left" y="87" height="206" fill="${colors.actin}" opacity=".06"/><rect x="${a}" y="87" width="${b - a}" height="206" fill="${colors.myosin}" opacity=".07"/><rect id="band-i-right" y="87" height="206" fill="${colors.actin}" opacity=".06"/><rect id="band-h" y="110" height="160" fill="${colors.force}" opacity=".08"/>
    <path d="M${a} 70v-9H${b}v9" fill="none" stroke="#81a3b0"/><text x="${w / 2}" y="46" text-anchor="middle" class="small-label">A BAND · FIXED LENGTH</text><text id="i-label-left" y="78" text-anchor="middle" class="small-label">I BAND</text><text id="i-label-right" y="78" text-anchor="middle" class="small-label">I BAND</text><text id="h-label" x="${w / 2}" y="112" text-anchor="middle" class="small-label">H ZONE</text></g>
    <path d="M${w / 2} 126V290" stroke="#afc4c7" stroke-width="1.5" stroke-dasharray="3 5"/><text x="${w / 2}" y="315" text-anchor="middle">M line</text>
    <g id="z-left"><path d="M0 88v200" stroke="#ccdad7" stroke-width="6"/><path d="M-5 88l10 12-10 12 10 12-10 12 10 12-10 12 10 12-10 12 10 12-10 12 10 12-10 12 10 12-10 12 10 12" fill="none" stroke="#8da4ac" stroke-width="2"/><text x="0" y="315" text-anchor="middle">Z disc</text></g>
    <g id="z-right"><path d="M0 88v200" stroke="#ccdad7" stroke-width="6"/><path d="M-5 88l10 12-10 12 10 12-10 12 10 12-10 12 10 12-10 12 10 12-10 12 10 12-10 12 10 12-10 12 10 12" fill="none" stroke="#8da4ac" stroke-width="2"/><text x="0" y="315" text-anchor="middle">Z disc</text></g>`;
    for (const y of [170, 246]) {
      out += `<rect x="${a}" y="${y - 7}" width="${b - a}" height="14" rx="7" fill="url(#muscle-thick)" data-thick-filament-length="${b - a}"/>`;
      for (const side of [-1, 1]) for (let i = 0; i < 5; i++) {
        const x = w / 2 + side * (w * .06 + i * w * .033);
        out += `<g class="ensemble-head" data-side="${side}" data-n="${i}" transform="translate(${x},${y})"><path d="M0 0L${side * 12}-20" fill="none" stroke="${colors.myosin}" stroke-width="3"/><ellipse cx="${side * 12}" cy="-20" rx="7" ry="4" fill="${colors.myosin}"/></g>`;
      }
    }
    for (const row of [142, 218]) out += thinFilament(thin, row, 1) + thinFilament(thin, row, -1);
    out += `<path id="sarco-length-rule" stroke="#9a876f" fill="none"/><text id="sarco-length-label" x="${w / 2}" y="359" text-anchor="middle" class="small-label">Z-TO-Z DISTANCE</text><g id="sliding-arrows" fill="none" stroke="${colors.force}" stroke-width="2"><path d="M${w * .19} 110h35m-8-6 8 6-8 6M${w * .81} 110h-35m8-6-8 6 8 6"/></g></svg>`;
    $('diagram').innerHTML = out;
    $('diagramLegend').innerHTML = legend([['Actin', colors.actin], ['Myosin', colors.myosin], ['Tropomyosin', colors.tropo], ['Troponin C', '#d8dfce'], ['Ca²⁺', colors.ca]]) + `<button class="legend-action" id="bandsBtn" aria-pressed="${state.bands}">${state.bands ? 'Hide' : 'Show'} bands</button>`;
    $('bridgeDiagram').innerHTML = `<svg viewBox="0 0 250 153" role="img" aria-labelledby="bridge-title bridge-desc"><title id="bridge-title">One actin–myosin cross-bridge</title><desc id="bridge-desc">An enlarged myosin head demonstrates attachment, power stroke, ATP-driven detachment, and hydrolysis that resets the head.</desc><g id="bridge-actin"><path d="M35 40H245" stroke="${colors.actin}" stroke-width="7"/><g fill="${colors.actin}">${Array.from({ length: 15 }, (_, i) => `<circle cx="${39 + i * 14}" cy="40" r="6"/>`).join('')}</g><path id="bridge-tropo" d="M35 39H245" stroke="${colors.tropo}" stroke-width="3"/></g><path d="M30 123H212" stroke="${colors.myosin}" stroke-width="10" stroke-linecap="round"/><g id="bridge-head"><path id="bridge-arm" d="M123 119L160 54" stroke="${colors.myosin}" stroke-width="9" stroke-linecap="round"/><ellipse id="bridge-tip" cx="160" cy="54" rx="15" ry="8" fill="${colors.myosin}"/></g><text id="bridge-nucleotide" x="160" y="88" text-anchor="middle" fill="${colors.force}">ADP + Pi</text><text x="24" y="20">ACTIN</text><text x="24" y="148">MYOSIN</text></svg>`;
  }
  function renderScene() {
    const s = steps[state.index];
    $('bridgeFocus').hidden = !isSarco();
    if (s.scene === 'nmj') renderNMJ();
    else if (s.scene === 'triad') renderTriad();
    else renderSarco();
    $('diagram').classList.remove('transition-in');
    void $('diagram').offsetWidth;
    $('diagram').classList.add('transition-in');
    paint();
  }
  function updateSarco() {
    const w = svgWidth, a = w * .29, b = w * .71, thin = w * .31;
    const z = w * .1 + (100 - state.length) / 100 * w * .4, right = w - z;
    $('z-left').setAttribute('transform', `translate(${z},0)`);
    $('z-right').setAttribute('transform', `translate(${right},0)`);
    $('diagram').querySelectorAll('.thin-filament').forEach(el => el.setAttribute('transform', `translate(${el.dataset.side === '1' ? z : right},0)`));
    const free = state.ca > 12 ? activation(state.ca) : 0;
    $('diagram').querySelectorAll('.tropomyosin-strand').forEach(el => el.setAttribute('transform', `translate(0,${-free * 11})`));
    $('diagram').querySelectorAll('.bound-calcium').forEach(el => el.setAttribute('opacity', free));
    $('diagram').querySelectorAll('.ensemble-head').forEach(el => {
      const active = state.rigor || state.force > 3;
      const offset = state.rigor ? 0 : Math.sin(state.clock * 3 + Number(el.dataset.n) * 1.7) * 9;
      const tip = active ? Number(el.dataset.side) * (12 + offset) : Number(el.dataset.side) * 6;
      const y = active ? -27 : -16;
      el.querySelector('path').setAttribute('d', `M0 0L${tip} ${y}`);
      el.querySelector('ellipse').setAttribute('cx', tip);
      el.querySelector('ellipse').setAttribute('cy', y);
      el.setAttribute('opacity', active ? 1 : .45);
    });
    $('band-i-left').setAttribute('x', z); $('band-i-left').setAttribute('width', Math.max(0, a - z));
    $('band-i-right').setAttribute('x', b); $('band-i-right').setAttribute('width', Math.max(0, right - b));
    const hStart = Math.min(w / 2, z + thin), hEnd = Math.max(w / 2, right - thin);
    $('band-h').setAttribute('x', hStart); $('band-h').setAttribute('width', Math.max(0, hEnd - hStart));
    $('h-label').setAttribute('opacity', hEnd - hStart < 15 ? 0 : 1);
    $('i-label-left').setAttribute('x', (z + a) / 2); $('i-label-right').setAttribute('x', (right + b) / 2);
    $('sarco-bands').setAttribute('opacity', state.bands ? 1 : 0);
    $('sarco-length-rule').setAttribute('d', `M${z} 330v8H${right}v-8`);
    $('sarco-length-label').textContent = `Z-TO-Z ${Math.round(state.length)}% · FILAMENT LENGTHS UNCHANGED`;
    $('sliding-arrows').setAttribute('opacity', state.atp && state.force > 5 ? .8 : 0);
    updateBridge();
  }
  function updateBridge() {
    const blocked = state.ca < 18 && !state.rigor;
    const phase = state.rigor ? 1 : state.phase;
    const coordinates = [[162, 49], [100, 49], [104, 83], [163, 76]];
    let [x, y] = blocked ? [162, 79] : coordinates[phase];
    // Interpolate the motor's pose during an explicitly played cycle. Only the
    // attached stroke translates actin; detached resetting cannot pull it.
    const progress = state.cycle ? Math.min(1, state.cycleElapsed / .55) : 1;
    const ease = progress * progress * (3 - 2 * progress);
    if (state.cycle && !blocked && !state.rigor) {
      const previous = coordinates[(phase + 3) % 4];
      x = previous[0] + (x - previous[0]) * ease;
      y = previous[1] + (y - previous[1]) * ease;
    }
    const slide = state.rigor || blocked ? 0 : phase === 1 ? -24 * ease : phase > 1 ? -24 : 0;
    $('bridge-actin').setAttribute('transform', `translate(${slide},0)`);
    $('bridge-arm').setAttribute('d', `M123 119L${x} ${y}`);
    $('bridge-tip').setAttribute('cx', x); $('bridge-tip').setAttribute('cy', y);
    $('bridge-nucleotide').setAttribute('x', 178);
    $('bridge-nucleotide').textContent = state.rigor ? 'NO ATP' : blocked ? 'ADP + Pi' : ['ADP + Pi', 'Pi → ADP →', 'ATP', 'ADP + Pi'][phase];
    $('bridge-tropo').setAttribute('transform', `translate(0,${state.ca < 18 ? 0 : -12})`);
    const titles = ['An energized head attaches.', 'The head pivots. Actin moves.', 'ATP binding releases the head.', 'Hydrolysis resets the motor.'];
    const copy = ['Myosin carries ADP + Pi. Calcium has made the actin site accessible.', 'Strong binding and Pi release accompany the stroke; ADP then leaves.', 'A new ATP molecule lowers myosin’s affinity for actin, breaking the attachment.', 'ATP becomes ADP + Pi. The head returns to an energized position for the next attachment.'];
    $('cycleTitle').textContent = state.rigor ? 'No ATP. No detachment.' : blocked ? 'The binding sites are blocked.' : titles[phase];
    $('cycleCopy').textContent = state.rigor ? 'Already attached heads remain locked, even if calcium is lowered. Restore ATP to permit detachment and recovery.' : blocked ? 'Low calcium leaves tropomyosin in the blocking position. ATP alone cannot activate the thin filament.' : copy[phase];
    document.querySelectorAll('[data-phase]').forEach(el => { if (!blocked && Number(el.dataset.phase) === phase) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current'); });
    $('cycleBtn').textContent = state.cycle ? 'Pause cycle Ⅱ' : 'Run full cycle ↻';
  }
  function updateSignal() {
    const w = svgWidth, c = w / 2, t = state.clock;
    if (steps[state.index].scene === 'nmj') {
      const membrane = Number($('diagram').dataset.membrane), terminal = Number($('diagram').dataset.terminal);
      const phase = (t * .45) % 1;
      $('nmj-ap').setAttribute('cx', state.index === 3 ? 30 + phase * (w - 60) : c - 171);
      $('nmj-ap').setAttribute('cy', state.index === 3 ? membrane : 45 + phase * (terminal - 50));
      $('nmj-ap').setAttribute('opacity', state.index === 0 || state.index === 3 ? 1 : .15);
      let particles = '';
      if (state.index >= 1) for (let i = 0; i < 12; i++) {
        const p = (phase + i / 12) % 1;
        particles += `<circle cx="${c - 105 + (i % 5) * 49 + Math.sin(p * 3) * 7}" cy="${terminal + 30 + p * (membrane - terminal - 40)}" r="3.5" fill="${colors.force}" opacity="${.3 + Math.sin(p * Math.PI) * .7}"/>`;
      }
      if (state.index >= 2) for (let i = 0; i < 6; i++) { const p = (phase + i / 6) % 1; particles += `<circle cx="${c - 80 + (i % 3) * 80}" cy="${membrane - 12 + p * 48}" r="3" fill="${colors.signal}"/>`; }
      if (state.index >= 1) for (let i = 0; i < 3; i++) { const p = (phase + i / 3) % 1; particles += `<circle cx="${c + 141}" cy="${terminal + 66 - p * 58}" r="4" fill="${colors.ca}"/>`; }
      $('nmj-particles').innerHTML = particles;
    } else {
      const phase = (t * .35) % 1, recovery = state.index === 15, gap = compact.matches ? 70 : 92, srW = compact.matches ? 142 : 260;
      $('triad-ap').setAttribute('cx', c - 29); $('triad-ap').setAttribute('cy', 58 + phase * 215); $('triad-ap').setAttribute('opacity', state.index < 15 ? 1 : 0);
      let particles = '';
      if (state.index === 6 || recovery && state.atp) for (const side of [-1, 1]) for (let i = 0; i < (recovery ? Math.ceil(state.ca / 10) : 10); i++) {
        const p = (phase + i / 10) % 1;
        const x = recovery ? c + side * (gap + srW / 2) + Math.sin(i) * 10 : c + side * (gap - 15 - p * 25);
        const y = recovery ? 357 - p * 80 : 216 + p * 91 + (i % 3) * 5;
        particles += `<circle cx="${x}" cy="${y}" r="4" fill="${colors.ca}" opacity="${.8}"/>`;
      }
      $('triad-particles').innerHTML = particles;
      if (recovery) $('triad-caption').textContent = state.atp ? 'ATP-POWERED UPTAKE → CYTOSOLIC Ca²⁺ FALLS' : 'ATP DEPLETED → SERCA UPTAKE STOPS';
    }
  }
  function renderTrace() {
    const data = state.history;
    const path = key => data.map((point, i) => `${i ? 'L' : 'M'}${25 + point.t / 2 * 495},${120 - point[key]}`).join(' ');
    $('caTrace').setAttribute('d', path('ca')); $('forcePath').setAttribute('d', path('force'));
    $('stimTrace').setAttribute('d', data.filter(p => p.pulse).map(p => `M${25 + p.t / 2 * 495} 129v-8`).join(''));
    $('traceStatus').textContent = state.rigor ? 'Rigor-like attachment · active cycling stopped' : state.run ? `${state.run.kind === 'single' ? 'Single twitch' : state.run.kind === 'recovery' ? 'SERCA recovery' : state.frequency + ' Hz train'} · ${state.modelTime.toFixed(2)} s` : state.mode === 'evoked' ? 'Stimulation ended · recovery' : 'Calcium held · steady response';
  }
  function updateLab() {
    $('caVal').textContent = `${Math.round(state.mode === 'clamp' ? state.calciumSet : state.ca)}%`;
    $('caSlider').value = state.mode === 'clamp' ? state.calciumSet : state.ca;
    $('freqVal').textContent = `${state.frequency} Hz`; $('freqSlider').value = state.frequency;
    $('calciumPct').innerHTML = percent(state.ca); $('forcePct').innerHTML = percent(state.force); $('lengthPct').innerHTML = percent(state.length);
    $('atpOn').setAttribute('aria-pressed', state.atp); $('atpOff').setAttribute('aria-pressed', !state.atp);
    $('atpNote').textContent = state.atp ? '' : state.rigor ? 'Rigor-like lock: bound heads stay attached. SERCA is stopped.' : 'No ongoing cycling or SERCA uptake. Depletion at rest does not itself produce a contraction.';
    $('caNote').textContent = state.mode === 'evoked' ? 'Stimulus-evoked calcium. Drag to switch to a direct calcium clamp.' : state.ca < 18 ? 'Low Ca²⁺: tropomyosin restricts new attachments.' : 'Direct calcium clamp: higher Ca²⁺ increases thin-filament activation.';
    updatePlayback();
    $('motionBtn').textContent = state.motion ? 'Pause motion' : 'Resume motion'; $('motionBtn').setAttribute('aria-pressed', !state.motion);
    $('trainBtn').textContent = state.run?.kind === 'train' && state.modelTime < state.run.end ? 'Stop train' : 'Stimulate train';
    renderTrace();
  }
  function paint() {
    if (!isMechanism()) return;
    if (isSarco()) updateSarco(); else updateSignal();
    if (isLab()) updateLab();
  }
  function initTrace() { state.modelTime = 0; state.traceClock = 0; state.pendingPulse = false; state.history = [{ t: 0, ca: state.ca, force: state.force, pulse: false }]; }
  function stopActivity() { state.run = null; state.cycle = false; state.cycleElapsed = 0; state.autoplayTime = 0; }
  function go(index, options = {}) {
    index = clamp(index, 0, steps.length - 1);
    stopActivity(); completed = false; state.index = index;
    state.phase = stagePhase();
    if (!state.custom) {
      state.ca = index >= 7 && index <= 14 ? 85 : 0; state.calciumSet = state.ca;
      state.force = targetForce();
      if (state.motion && index === 10) state.force = 0;
      if (state.motion && index === 13) state.force *= .6;
      state.length = state.rigor ? state.rigorLength : 100 - state.force * .23;
    }
    state.mode = 'clamp'; state.calciumSet = state.ca;
    if (index === 15 && !state.custom) {
      state.ca = 85; state.calciumSet = 85; state.force = activation(state.ca) * 100;
      state.length = 100 - state.force * .23; state.mode = 'evoked';
      state.run = { kind: 'recovery', nextPulse: 3, end: 0 };
    }
    if (index >= 17) state.autoplay = false;
    const s = steps[index], sceneTitles = { nmj: 'An impulse. A connection.', triad: index === 15 ? 'Returning calcium home.' : 'Voltage becomes chemistry.', sarco: index === 16 ? 'The motor lets go.' : 'The architecture of movement.', glossary: 'The language of movement.', facts: 'A few things worth knowing.', quiz: 'Connect the mechanism.' };
    $('stepTitle').textContent = s.title; $('stepExplain').textContent = s.text; $('keyIdea').textContent = s.key;
    $('stepCounter').textContent = `${String(index + 1).padStart(2, '0')} / ${steps.length}`;
    $('partLabel').textContent = s.part.split('/').pop().trim().toUpperCase(); $('chapterCategory').textContent = index < 17 ? `MECHANISM / ${String(index + 1).padStart(2, '0')}` : 'FIELD NOTES';
    $('progressBar').style.width = `${(index + 1) / steps.length * 100}%`; root.querySelector('[role=progressbar]').setAttribute('aria-valuenow', index + 1);
    $('chapterSelect').value = index; $('sceneTitle').textContent = sceneTitles[s.scene];
    $('stageKicker').textContent = index < 17 ? 'FROM SIGNAL TO MOVEMENT' : 'UNDERSTAND THE CONNECTION';
    $('sceneLabel').textContent = { nmj: 'THE NEUROMUSCULAR JUNCTION', triad: 'THE TRIAD / ONE T-TUBULE + TWO SR CISTERNAE', sarco: 'ONE SARCOMERE / Z DISC TO Z DISC' }[s.scene] || '';
    $('signalState').textContent = ['MOTOR-NEURON AP', 'Ca²⁺ ENTRY → ACh RELEASE', 'LOCAL, GRADED EPP', 'REGENERATIVE MUSCLE AP', 'T-TUBULE DEPOLARIZATION', 'CaV1.1 SENSES VOLTAGE', 'RyR1 RELEASES Ca²⁺', 'Ca²⁺ BINDS TROPONIN C', 'TROPOMYOSIN SHIFTS', 'ATTACHMENT', 'POWER STROKE', 'ATP → DETACHMENT', 'HYDROLYSIS → RESET', 'SLIDING FILAMENTS', 'TWITCH → SUMMATION → TETANUS', 'SERCA USES ATP', 'RELEASE → RELAXATION'][index] || '';
    $('causeText').textContent = s.cause || ''; $('effectText').textContent = s.effect || '';
    $('navContext').textContent = s.short; $('prevBtn').disabled = index === 0; $('nextBtn').disabled = false;
    $('nextBtn').innerHTML = index === steps.length - 1 ? '<span>Finish module</span> →' : '<span>Next step</span> →';
    $('mechanismView').hidden = index >= 17; $('readingView').hidden = index < 17; $('labControls').hidden = !isLab();
    document.querySelectorAll('.step-link').forEach(el => { if (Number(el.dataset.go) === index) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current'); });
    document.querySelectorAll('.scale-nav button').forEach((el, i) => el.setAttribute('aria-current', String(index < 17 && i === (s.scene === 'nmj' ? 0 : s.scene === 'triad' ? 1 : 2))));
    initTrace();
    if (index < 17) renderScene(); else renderReading();
    updatePlayback();
    if (!options.fromHash) try { history.replaceState(null, '', `#step-${index + 1}`); } catch (_) { /* file URL support */ }
    if (options.focus) $('stepTitle').focus({ preventScroll: true });
    if (innerWidth > 900) root.querySelector('.muscle-guide').scrollTop = 0;
    if (options.scroll && innerWidth <= 900) $('stepTitle').scrollIntoView({ behavior: 'instant', block: 'start' });
    announce(`Chapter ${index + 1}: ${s.title}`);
  }
  function sourcesMarkup() { return `<div class="source-list"><span class="eyebrow">READ THE SCIENCE / SELECTED REFERENCES</span>${sources.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join('')}</div>`; }
  function renderReading() {
    const kind = steps[state.index].scene;
    if (kind === 'quiz') return renderQuiz();
    $('readingView').innerHTML = `<div class="reading-content"><p class="reading-intro">${kind === 'glossary' ? 'From a membrane voltage to a molecular motor. The structures and signals that connect the journey.' : 'Keep these distinctions in view as you explore. Each connects an observation to its underlying mechanism.'}</p>${kind === 'glossary' ? '<label class="sr-only" for="glossarySearch">Find a glossary term</label><input class="glossary-search" id="glossarySearch" type="search" placeholder="Find a term, molecule or structure…"><p id="searchStatus" class="search-status" role="status"></p>' : ''}<div class="reading-grid" id="resourceGrid">${(kind === 'glossary' ? glossary : facts).map((item, i) => `<article class="reading-card"><span class="eyebrow">${String(i + 1).padStart(2, '0')} / ${kind === 'glossary' ? 'FIELD NOTES' : 'KEY CONNECTION'}</span><h3>${esc(item.term || item.title)}</h3><p>${esc(item.definition || item.body)}</p></article>`).join('')}</div>${kind === 'facts' ? sourcesMarkup() : ''}</div>`;
  }
  function renderQuiz() {
    const q = quiz[quizIndex], answer = answers[quizIndex], answered = Number.isInteger(answer), correct = answer === q.correct;
    const score = quiz.filter((item, i) => answers[i] === item.correct).length;
    $('readingView').innerHTML = `<div class="reading-content"><div class="quiz-topline"><span>CHECKPOINT ${String(quizIndex + 1).padStart(2, '0')} / ${quiz.length}</span><span>${score} OF ${quiz.length} UNDERSTOOD</span></div><nav class="quiz-progress" aria-label="Checkpoint questions">${quiz.map((item, i) => `<button data-question="${i}" class="${answers[i] === item.correct ? 'correct' : ''}" ${i === quizIndex ? 'aria-current="step"' : ''} aria-label="Question ${i + 1}${answers[i] === item.correct ? ', answered correctly' : ''}">${i + 1}</button>`).join('')}</nav><h3 class="quiz-question" id="quizQuestion" tabindex="-1">${esc(q.question)}</h3><div class="quiz-options" role="group" aria-labelledby="quizQuestion">${q.options.map((option, i) => `<button class="quiz-option ${answered && i === q.correct ? 'is-correct' : answered && i === answer ? 'is-wrong' : ''}" data-answer="${i}" ${answered ? 'disabled' : ''}><span>${answered && i === q.correct ? '✓' : answered && i === answer ? '×' : String.fromCharCode(65 + i)}</span><span>${esc(option)}</span></button>`).join('')}</div>${answered ? `<div class="quiz-feedback" role="status"><strong>${correct ? 'That’s the connection.' : 'Follow the causal link.'}</strong><br>${esc(q.explanation)}</div>` : ''}<div class="quiz-actions">${answered ? `<button class="m-button next-button" id="quizNextBtn">${quizIndex === quiz.length - 1 ? 'See results' : 'Next question'} →</button><button class="text-control" data-retry>Retry question</button>` : ''}</div></div>`;
  }
  function finish() {
    stopActivity(); state.autoplay = false; completed = true; updatePlayback();
    $('mechanismView').hidden = true; $('readingView').hidden = false; $('labControls').hidden = true;
    $('sceneTitle').textContent = 'The signal, connected.'; $('stageKicker').textContent = 'MODULE 05 / EXPLORATION COMPLETE';
    const score = quiz.filter((q, i) => answers[i] === q.correct).length;
    $('readingView').innerHTML = `<div class="reading-content"><div class="completion"><span class="eyebrow">FROM ELECTRICITY TO MOVEMENT</span><div class="completion-number">${score}<span style="font-size:.35em"> / ${quiz.length}</span></div><h3>A signal becomes a movement.</h3><p>${score === quiz.length ? 'Every checkpoint connected. Keep experimenting with the variables, or follow the next signal in the atlas.' : 'You’ve traced the full mechanism. Revisit the checkpoints to connect the remaining links.'}</p><button class="m-button next-button" data-review>Review checkpoints →</button><a class="m-button" href="../index.html#modules">Explore the atlas ↗</a></div>${sourcesMarkup()}</div>`;
    $('nextBtn').disabled = true; announce(`Module complete. ${score} of ${quiz.length} checkpoints correct.`);
  }
  function updatePlayback() { $('headerMotionBtn').textContent = state.motion ? 'Ⅱ' : '▷'; $('headerMotionBtn').setAttribute('aria-label', state.motion ? 'Pause animation' : 'Resume animation'); $('headerMotionBtn').title = state.motion ? 'Pause animation' : 'Resume animation'; $('headerMotionBtn').setAttribute('aria-pressed', !state.motion); $('headerMotionBtn').disabled = !isMechanism(); $('playLabel').textContent = state.autoplay ? 'Pause' : 'Autoplay'; $('playIcon').textContent = state.autoplay ? 'Ⅱ' : '▶'; $('playBtn').setAttribute('aria-pressed', state.autoplay); $('playBtn').disabled = !isMechanism(); }
  function toggleAutoplay() { if (!isMechanism()) return; state.autoplay = !state.autoplay; if (state.autoplay) { state.motion = true; state.autoplayTime = 0; } else { state.motion = false; } updatePlayback(); paint(); announce(state.autoplay ? 'Autoplay started. Each mechanism chapter lasts eight seconds.' : 'Autoplay and motion paused.'); }
  function resetLab() {
    stopActivity(); state.atp = true; state.rigor = false; state.rigorLength = 100; state.frequency = 10; state.custom = false; state.mode = 'clamp'; state.motion = !reduced.matches;
    state.ca = state.index >= 7 && state.index <= 14 ? 85 : 0; state.calciumSet = state.ca; state.force = targetForce(); state.length = 100 - state.force * .23; state.phase = stagePhase(); initTrace(); paint();
    announce('Lab reset. ATP restored; calcium and frequency returned to chapter defaults.');
  }
  function restart() { state = initial(); answers = {}; quizIndex = 0; save(); go(0, { focus: true, scroll: true }); announce('Module restarted. All controls and checkpoint answers reset.'); }
  function stimulus(kind) {
    if (kind === 'train' && state.run?.kind === 'train' && state.modelTime < state.run.end) { state.run.end = state.modelTime; paint(); announce('Stimulation stopped. Observe calcium removal and relaxation.'); return; }
    state.custom = true; state.mode = 'evoked'; state.cycle = false; state.ca = state.atp ? 0 : state.ca; state.force = state.atp ? 0 : state.force; state.length = state.rigor ? state.rigorLength : 100;
    initTrace(); state.run = { kind, nextPulse: 0, end: kind === 'single' ? .001 : 1 }; state.motion = true;
    announce(kind === 'single' ? 'One stimulus applied. Calcium rises before force.' : `${state.frequency} hertz stimulation train applied for one second of model time.`);
  }
  function setATP(available) {
    if (available === state.atp) return;
    state.atp = available;
    if (!available) {
      state.rigor = state.force > 1 || state.ca > 18 && isSarco() && state.phase < 2;
      state.rigorLength = state.length; state.force = 0; state.cycle = false;
    } else { state.rigor = false; state.phase = 2; }
    state.custom = true;
    // A direct clamp is an experimental intervention; in evoked mode ATP-off stops uptake.
    if (!state.motion && available) { state.force = targetForce(); state.length = 100 - state.force * .23; }
    paint(); announce(available ? 'ATP restored. Myosin can detach and SERCA can transport calcium.' : state.rigor ? 'ATP depleted. Attached heads are locked; ongoing active force generation stops.' : 'ATP depleted at rest. There is no automatic shortening.');
  }
  function runCycle() {
    if (state.cycle) { state.cycle = false; paint(); return; }
    if (!state.atp || state.ca < 18) { announce(!state.atp ? 'Cycle stalled: ATP is required for detachment and resetting.' : 'Calcium is too low. Tropomyosin limits new attachments.'); paint(); return; }
    state.custom = true; state.cycle = true; state.phase = 0; state.cycleElapsed = 0; state.cycleTurns = 0; state.motion = true; paint();
    announce('Full cross-bridge cycle: attachment, stroke, detachment, and resetting.');
  }
  function simulate(dt) {
    state.clock += dt;
    if (state.autoplay) { state.autoplayTime += dt; if (state.autoplayTime >= 8) { if (state.index === 16) { state.autoplay = false; go(17); } else go(state.index + 1); return; } }
    if (state.cycle && !state.rigor) {
      state.cycleElapsed += dt;
      if (state.cycleElapsed >= 1.4) { state.cycleElapsed -= 1.4; state.phase = (state.phase + 1) % 4; state.cycleTurns++; if (state.cycleTurns >= 4) { state.cycle = false; announce('Cycle complete. The reset head is ready to attach again.'); } }
    }
    if (!isLab()) return;
    const bioDt = dt * .2;
    
    if (state.mode === 'evoked') {
      state.modelTime = Math.min(2, state.modelTime + bioDt);
      if (state.run && state.modelTime >= state.run.nextPulse && state.run.nextPulse < state.run.end) {
        state.ca = clamp(state.ca + 54); state.pendingPulse = true;
        state.run.nextPulse += state.run.kind === 'single' ? 3 : 1 / state.frequency;
      }
      if (state.atp) state.ca *= Math.exp(-bioDt / .07);
      if (state.run && state.modelTime >= 2) { state.run = null; announce('Response complete. Compare the calcium and force traces.'); }
    }
    const target = targetForce();
    state.force += (target - state.force) * (1 - Math.exp(-bioDt / (target > state.force ? .055 : .11)));
    if (state.rigor) state.length = state.rigorLength;
    else state.length += (100 - state.force * .23 - state.length) * (1 - Math.exp(-dt / .24));
    state.traceClock += dt;
    if (state.mode === 'evoked' && state.traceClock >= .04 && state.modelTime < 2) { state.traceClock = 0; state.history.push({ t: state.modelTime, ca: state.ca, force: state.force, pulse: state.pendingPulse }); state.pendingPulse = false; }
    else if (state.mode === 'clamp') state.history = [{ t: 0, ca: state.ca, force: state.force }, { t: 2, ca: state.ca, force: state.force }];
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) { await document.exitFullscreen(); return; }
      if (root.classList.contains('is-expanded')) { root.classList.remove('is-expanded'); document.body.style.overflow = ''; syncFullscreen(); return; }
      if (!root.requestFullscreen) throw new Error('Expanded view');
      await root.requestFullscreen();
    } catch (_) { root.classList.add('is-expanded'); document.body.style.overflow = 'hidden'; syncFullscreen(); announce('Expanded view. Use the fullscreen button or Escape to exit.'); }
  }
  function syncFullscreen() { const active = Boolean(document.fullscreenElement) || root.classList.contains('is-expanded'); $('fullBtn').setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen'); $('fullBtn').title = active ? 'Exit fullscreen' : 'Enter fullscreen'; }
  function next() { if (completed) return; if (state.index === steps.length - 1) finish(); else go(state.index + 1, { scroll: true }); }
  function previous() { if (completed) go(19); else if (state.index > 0) go(state.index - 1, { scroll: true }); }
  let previousPart = '';
  $('stepList').innerHTML = steps.map((s, i) => { const group = previousPart !== s.part ? `<li class="chapter-group">${esc(s.part.toUpperCase())}</li>` : ''; previousPart = s.part; return `${group}<li><button class="step-link" data-go="${i}" aria-label="Chapter ${i + 1}: ${esc(s.title)}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(s.short)}</button></li>`; }).join('');
  $('chapterSelect').innerHTML = steps.map((s, i) => `<option value="${i}">${String(i + 1).padStart(2, '0')} / ${esc(s.short)}</option>`).join('');
  root.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button || button.disabled) return;
    if (button.dataset.go !== undefined) go(Number(button.dataset.go), { focus: true, scroll: true });
    else if (button.dataset.phase !== undefined) { state.cycle = false; state.phase = Number(button.dataset.phase); paint(); announce(`${phaseName()}. ${$('cycleCopy').textContent}`); }
    else if (button.dataset.question !== undefined) { quizIndex = Number(button.dataset.question); renderQuiz(); $('quizQuestion').focus({ preventScroll: true }); }
    else if (button.dataset.answer !== undefined) { answers[quizIndex] = Number(button.dataset.answer); save(); renderQuiz(); $('quizNextBtn').focus({ preventScroll: true }); }
    else if (button.hasAttribute('data-retry')) { delete answers[quizIndex]; save(); renderQuiz(); $('readingView').querySelector('[data-answer]').focus({ preventScroll: true }); }
    else if (button.hasAttribute('data-review')) { quizIndex = quiz.findIndex((q, i) => answers[i] !== q.correct); if (quizIndex < 0) quizIndex = 0; go(19); $('quizQuestion').focus({ preventScroll: true }); }
    else if (button.id === 'quizNextBtn') { if (quizIndex === quiz.length - 1) finish(); else { quizIndex++; renderQuiz(); $('quizQuestion').focus({ preventScroll: true }); } }
    else if (button.id === 'bandsBtn') { state.bands = !state.bands; button.setAttribute('aria-pressed', state.bands); button.textContent = `${state.bands ? 'Hide' : 'Show'} bands`; paint(); }
  });
  $('readingView').addEventListener('input', event => {
    if (event.target.id !== 'glossarySearch') return;
    const query = event.target.value.toLowerCase().trim(); let count = 0;
    $('resourceGrid').querySelectorAll('article').forEach(card => { card.hidden = !card.textContent.toLowerCase().includes(query); if (!card.hidden) count++; });
    $('searchStatus').textContent = `${count} terms found.`;
  });
  $('chapterSelect').addEventListener('change', event => go(Number(event.target.value)));
  $('caSlider').addEventListener('input', event => {
    state.custom = true; state.run = null; state.mode = 'clamp'; state.ca = Number(event.target.value); state.calciumSet = state.ca;
    if (state.ca < 18) state.cycle = false;
    if (!state.motion) { state.force = targetForce(); if (!state.rigor) state.length = 100 - state.force * .23; }
    initTrace(); paint();
  });
  $('freqSlider').addEventListener('input', event => { state.frequency = Number(event.target.value); updateLab(); });
  $('lowCaPresetBtn').addEventListener('click', () => { $('caSlider').value = 8; $('caSlider').dispatchEvent(new Event('input')); announce('Low-calcium preset. New attachments are restricted.'); });
  $('atpOn').addEventListener('click', () => setATP(true)); $('atpOff').addEventListener('click', () => setATP(false));
  $('pulseBtn').addEventListener('click', () => stimulus('single')); $('trainBtn').addEventListener('click', () => stimulus('train'));
  $('cycleBtn').addEventListener('click', runCycle); $('resetLabBtn').addEventListener('click', resetLab);
  $('playBtn').addEventListener('click', toggleAutoplay); $('restartBtn').addEventListener('click', restart);
  $('nextBtn').addEventListener('click', next); $('prevBtn').addEventListener('click', previous);
  $('fullBtn').addEventListener('click', toggleFullscreen); document.addEventListener('fullscreenchange', syncFullscreen);
  function toggleMotion() { state.motion = !state.motion; if (!state.motion) state.autoplay = false; updatePlayback(); paint(); }
  $('motionBtn').addEventListener('click', toggleMotion);
  $('headerMotionBtn').addEventListener('click', toggleMotion);
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (event.key === 'Escape' && root.classList.contains('is-expanded')) { root.classList.remove('is-expanded'); document.body.style.overflow = ''; syncFullscreen(); $('fullBtn').focus(); return; }
    if (event.target.closest('input,select,textarea,[contenteditable="true"]')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); previous(); }
    else if (event.code === 'Space' && !event.target.closest('button,a,summary')) { event.preventDefault(); toggleAutoplay(); }
    else if (event.key.toLowerCase() === 'r' && !event.target.closest('button,a,summary')) { event.preventDefault(); restart(); }
  });
  const readHash = () => { const match = location.hash.match(/^#step-(\d+)$/); return match ? clamp(Number(match[1]) - 1, 0, steps.length - 1) : 0; };
  window.addEventListener('hashchange', () => { if (/^#step-\d+$/.test(location.hash)) go(readHash(), { fromHash: true }); });
  compact.addEventListener('change', () => { if (isMechanism()) renderScene(); });
  reduced.addEventListener('change', event => { if (event.matches) { state.motion = false; state.autoplay = false; updatePlayback(); paint(); } });
  document.addEventListener('visibilitychange', () => { last = 0; });
  function frame(now) {
    const dt = last ? Math.min((now - last) / 1000, .05) : 0; last = now;
    if (state.motion && isMechanism() && !document.hidden) { simulate(dt); if (now - paintTime > 33) { paint(); paintTime = now; } }
    requestAnimationFrame(frame);
  }
  go(readHash(), { fromHash: true }); requestAnimationFrame(frame);
  // Read-only diagnostics for integration QA. Mutations go through semantic UI controls.
  window.SignalAtlasMuscle = Object.freeze({ getState: () => JSON.parse(JSON.stringify(state)), getAnswers: () => ({ ...answers }), getStepCount: () => steps.length });
})();
