(function () {
  'use strict';

  const range = (id, label, min, max, value, hint) => ({ type: 'range', id, label, min, max, step: 5, value, unit: '%', hint });
  const drugControl = () => range('anesthetic', 'Anesthetic effect', 0, 100, 55, 'Relative effect in this model; not a drug dose.');
  const driveControl = () => range('drive', 'Excitatory input', 10, 100, 70, 'Stronger input brings the neuron closer to firing.');
  const gabaControl = () => range('gaba', 'GABA signaling', 0, 100, 50, 'Change the inhibitory signal arriving at this synapse.');
  const checkpoint = (title, question, options, correct, explanation) => ({ title, description: 'Test the mechanism. Choose an answer to reveal the reasoning.', type: 'quiz', quiz: { question, options, correct, explanation } });
  const sources = [
    { label: 'Kim et al. · GABA-A anesthetic binding structures · Nature, 2020', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7486282/' },
    { label: 'Krom et al. · Human cortical responses during propofol anesthesia · PNAS, 2020', url: 'https://doi.org/10.1073/pnas.1917251117' },
    { label: 'Liu et al. · Thalamocortical connectivity during propofol sedation · 2013', url: 'https://pubmed.ncbi.nlm.nih.gov/23221862/' }
  ];
  const steps = [
    { title: 'A conversation of neurons', description: 'Conscious experience depends on coordinated activity across brain networks. Zoom from this connected system to one inhibitory synapse, then follow an anesthetic effect back to the network.', phase: 'network-intro', stageTitle: 'The connected brain', stageSubtitle: 'Systems neuroscience · conceptual network', context: { title: 'Many cells. One changing state.', body: 'Excitation and inhibition shape when neurons fire. Communication across circuits supports perception, memory, and responsiveness.' }, controls: [driveControl()] },
    { title: 'An electrical pulse', description: 'When excitatory inputs carry a neuron to threshold, voltage-gated ion channels produce an action potential. The pulse travels along its axon toward a synaptic terminal.', phase: 'electrical', stageTitle: 'Voltage becomes a signal', stageSubtitle: 'Axon → synaptic terminal', context: { title: 'Frequency carries information', body: 'Stronger sustained input often increases firing frequency. Individual action potentials remain approximately all-or-none; this model changes their number, not their size.' }, controls: [driveControl()], note: 'Voltage traces and firing rates are illustrative, not recordings.' },
    { title: 'Across the synapse', description: 'At a terminal, an action potential opens calcium channels. Calcium entry triggers vesicle fusion and neurotransmitter release. Here the transmitter is GABA, an inhibitory signal.', phase: 'release', stageTitle: 'Electrical → chemical', stageSubtitle: 'A magnified inhibitory synapse', context: { title: 'A very small gap', body: 'GABA diffuses across the synaptic cleft and binds receptors on the next cell. It does not carry an action potential through the gap.' }, controls: [gabaControl()] },
    { title: 'A gate for inhibition', description: 'GABA opens GABA-A receptor channels. In many mature neurons, the resulting anion conductance stabilizes voltage near the chloride equilibrium potential and reduces the impact of excitatory inputs.', phase: 'gaba', stageTitle: 'GABA-A changes excitability', stageSubtitle: 'Receptor opening → increased anion conductance', context: { title: 'Inhibition has two routes', body: 'The cell can become more negative (hyperpolarization), or incoming excitation can be dissipated (shunting). Both can make a new action potential less likely.' }, controls: [gabaControl(), driveControl()], note: 'Chloride direction depends on its electrochemical gradient. Inward Cl⁻ is one common mature-neuron example.' },
    { title: 'An anesthetic amplifies it', description: 'Propofol-like anesthetic modulation strengthens GABA-A inhibition. Anesthetic molecules bind at sites distinct from GABA and alter channel behavior, increasing the effect of the inhibitory signal.', phase: 'potentiation', stageTitle: 'A small molecule. A larger effect.', stageSubtitle: 'One major inhibitory anesthetic pathway', context: { title: 'Turn up the effect', body: 'Increase anesthetic effect and watch chloride conductance rise while postsynaptic firing falls. This is a qualitative illustration of receptor modulation.' }, controls: [drugControl(), gabaControl()], note: 'Different anesthetics have different targets. Ketamine, for example, prominently blocks NMDA receptors.' },
    { title: 'Fewer signals get through', description: 'With stronger inhibition, the same excitatory input produces fewer action potentials in this neuron. Compare the output trace while changing anesthetic effect or excitatory input.', phase: 'suppression', stageTitle: 'Input remains. Output changes.', stageSubtitle: 'Single-cell response · illustrative voltage trace', context: { title: 'The threshold is harder to reach', body: 'The reference trace shows output without anesthetic modulation. The live trace shows how inhibition changes the response to the same input.' }, controls: [drugControl(), driveControl()] },
    { title: 'Communication is reorganized', description: 'Across many cells, anesthetics alter firing, rhythms, and communication between regions. Some local sensory responses may persist even as information transfer to higher-order cortex is strongly reduced.', phase: 'network-effect', stageTitle: 'From receptor to network', stageSubtitle: 'Long-range communication becomes less effective', context: { title: 'A network-level transition', body: 'Loss of consciousness involves distributed circuits, including cortex, thalamus, and arousal systems. It cannot be read from one receptor or one neuron.' }, controls: [drugControl()], note: 'Connection brightness is a conceptual communication index, not a measured consciousness score.' },
    { title: 'Follow the whole pathway', description: 'Explore the chain: anesthetic modulation → stronger inhibition → altered firing → disrupted network communication. Return the effect to zero to see the model recover its initial activity.', phase: 'whole', stageTitle: 'One pathway, across scales', stageSubtitle: 'Molecule → synapse → neuron → network', context: { title: 'Reversible does not mean simple', body: 'The biological return of responsiveness involves drug redistribution, elimination, and active arousal circuits. This slider only reverses the simplified pathway shown here.' }, controls: [drugControl(), { type: 'actions', label: 'Compare states', options: [{ action: 'baseline', label: 'Baseline' }, { action: 'enhance', label: 'Enhanced inhibition' }] }], note: 'General anesthesia has several components. Unconsciousness, amnesia, immobility, and pain control are not the same effect.' },
    { title: 'The language of signaling', description: 'A compact field guide to the mechanisms you just explored.', type: 'glossary', stageTitle: 'Neural signaling, decoded', terms: [
      { term: 'Action potential', definition: 'A brief, regenerative electrical signal that travels along a neuron’s membrane.' },
      { term: 'Synapse', definition: 'The junction where one cell communicates with another, often using a chemical transmitter.' },
      { term: 'GABA', definition: 'Gamma-aminobutyric acid, the major inhibitory neurotransmitter in the mature brain.' },
      { term: 'GABA-A receptor', definition: 'A GABA-gated ion channel that conducts anions, primarily chloride.' },
      { term: 'Hyperpolarization', definition: 'A shift of membrane voltage toward more negative values.' },
      { term: 'Shunting inhibition', definition: 'Increased conductance that weakens the voltage change produced by an excitatory input.' },
      { term: 'Allosteric modulation', definition: 'Changing a receptor’s response by binding at a site separate from its primary ligand.' },
      { term: 'Functional connectivity', definition: 'A statistical relationship between activities in different brain regions; not a direct measure of information transfer.' }
    ] },
    { title: 'Beyond the simplified model', description: 'Three details that make the real biology more interesting.', type: 'facts', stageTitle: 'The brain is still active', facts: [
      { title: 'One receptor, several binding sites', body: 'Structural studies have visualized anesthetics in pockets within GABA-A receptors. These pockets differ from the sites that recognize GABA.' },
      { title: 'Sound can still reach cortex', body: 'Human intracranial recordings during propofol anesthesia found persistent primary auditory responses alongside reduced responses in higher-order regions.' },
      { title: 'Connectivity is selective', body: 'Human imaging studies show unequal effects on thalamocortical pathways. The brain does not simply switch off every connection at once.' }
    ], sources },
    checkpoint('Checkpoint 01 · The crossing', 'What carries the signal across this chemical synaptic cleft?', ['An action potential jumps across the gap', 'Released GABA molecules diffuse to receptors', 'The two neurons fuse their membranes', 'Chloride travels down the presynaptic axon'], 1, 'Vesicles release GABA into the cleft. It diffuses to postsynaptic receptors, converting presynaptic electrical activity into a chemical message and then a change in postsynaptic conductance.'),
    checkpoint('Checkpoint 02 · The receptor', 'In this pathway, why does enhancing GABA-A activity often reduce firing?', ['It removes every excitatory receptor', 'It forces every neuron to stop permanently', 'It increases anion conductance, making excitation less effective', 'It turns GABA into a voltage-gated sodium channel'], 2, 'Greater GABA-A conductance can hyperpolarize a mature neuron or shunt excitatory input. Threshold is therefore less likely to be reached in the example shown.'),
    checkpoint('Checkpoint 03 · Across scales', 'Which statement best explains the link to unconsciousness?', ['One inactive neuron is sufficient', 'Every brain region becomes electrically silent', 'Blood stops delivering oxygen to the brain', 'Distributed network activity and communication are altered'], 3, 'Anesthetic unconsciousness involves changes across connected cortical and subcortical systems. Local activity may continue; there is no single-neuron consciousness switch.'),
    checkpoint('Checkpoint 04 · The boundary', 'Which conclusion is supported by this module?', ['GABA-A enhancement is one major anesthetic pathway', 'Every anesthetic acts through exactly the same receptor', 'The effect slider predicts a safe clinical dose', 'General anesthesia is identical to natural sleep'], 0, 'The module illustrates a major inhibitory pathway, particularly relevant to drugs such as propofol. Agents differ, and a qualitative educational model cannot predict a dose or a person’s state of consciousness.')
  ];

  // Deliberately qualitative: no dose, anesthetic-depth threshold, or clinical prediction.
  function physiology(state, step) {
    const hasDrug = ['potentiation', 'suppression', 'network-effect', 'whole'].includes(step.phase);
    const drug = hasDrug ? Number(state.anesthetic) / 100 : 0;
    const gaba = Number(state.gaba) / 100;
    const drive = Number(state.drive) / 100;
    const inhibition = Math.min(1, gaba * (0.45 + drug * 1.55));
    const firing = Math.max(1, Math.round(42 * drive * (1 - inhibition * 0.92)));
    return { drug, gaba, drive, inhibition, firing, baseline: Math.max(1, Math.round(42 * drive * (1 - gaba * 0.45 * 0.92))), voltage: Math.round(-62 - inhibition * 13), communication: Math.round(100 - drug * 76), duration: Math.max(0.7, 3.4 - firing * 0.085) };
  }
  function defs() {
    return `<defs>
      <linearGradient id="anesthesia-tissue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#254354" stop-opacity=".7"/><stop offset=".6" stop-color="#15273d" stop-opacity=".4"/><stop offset="1" stop-color="#30314c" stop-opacity=".7"/></linearGradient>
      <linearGradient id="anesthesia-post" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#133e42" stop-opacity=".55"/><stop offset="1" stop-color="#11232d" stop-opacity=".15"/></linearGradient>
      <linearGradient id="anesthesia-channel" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#42788a"/><stop offset=".45" stop-color="#b2dbdc"/><stop offset="1" stop-color="#447282"/></linearGradient>
      <radialGradient id="anesthesia-nucleus"><stop stop-color="#aec0f4" stop-opacity=".24"/><stop offset="1" stop-color="#7f89c1" stop-opacity=".02"/></radialGradient>
      <filter id="anesthesia-soft"><feGaussianBlur stdDeviation="5"/></filter>
      <marker id="anesthesia-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10" fill="none" stroke="#86c9d2" stroke-width="1.5"/></marker>
    </defs>`;
  }
  function pulse(path, color, duration, delay, radius) {
    return `<circle r="${radius || 4}" fill="${color}"><animateMotion dur="${duration}s" begin="-${delay || 0}s" repeatCount="indefinite" path="${path}"/></circle>`;
  }
  function wave(x, y, width, peaks, amplitude) {
    let d = `M ${x} ${y}`;
    const spacing = width / Math.max(1, peaks);
    for (let i = 0; i < peaks; i++) {
      const at = x + i * spacing;
      d += ` L${at + spacing * .22} ${y} L${at + spacing * .36} ${y - 8} L${at + spacing * .43} ${y - amplitude} L${at + spacing * .5} ${y + 15} L${at + spacing * .65} ${y} L${at + spacing} ${y}`;
    }
    return d;
  }
  function neuron(x, y, scale, color) {
    return `<g transform="translate(${x} ${y}) scale(${scale})" stroke="${color}" fill="none" stroke-linecap="round">
      <path d="M0 0C-40-15-62-50-85-74M-41-33L-32-85M-60-51L-110-48M-26-20L-79 8M0 0C-35 23-44 62-79 89M-46 55L-84 51M-29 31L-16 77M0 0C18-42 39-70 78-89M31-51L23-98M49-68L93-60M0 0C32 10 56 31 93 32M49 26L70 61" stroke-width="4" opacity=".65"/>
      <path d="M-18-22Q4-42 22-20L36 4Q23 28 0 26L-24 12Z" fill="url(#anesthesia-tissue)" stroke-width="2"/><circle r="12" fill="url(#anesthesia-nucleus)" stroke-opacity=".5"/>
      <path d="M25 7C82-3 114-1 160 8S235 18 289 7" stroke-width="6" opacity=".35"/><path d="M25 7C82-3 114-1 160 8S235 18 289 7" stroke-width="1.5"/>
    </g>`;
  }
  function electrical(p) {
    const peaks = Math.max(1, Math.round(p.drive * 6));
    return `<g class="anesthesia-electrical">
      <text x="45" y="48" class="anesthesia-kicker">01 / ELECTRICAL SIGNALING</text>
      ${neuron(175, 239, 1.4, '#74cbe1')}
      <path d="M580 250C616 239 635 217 654 196M605 244L645 266M580 250C618 265 631 295 653 313" fill="none" stroke="#74cbe1" stroke-width="5" opacity=".6"/>
      ${Array.from({ length: peaks }, (_, i) => pulse('M210 247C290 231 329 238 399 250S479 263 579 249', '#a8f5d5', p.duration + .4, i * (p.duration + .4) / peaks, 5)).join('')}
      <text x="72" y="410">Dendrites</text><path d="M148 386L148 339" class="anesthesia-leader"/>
      <text x="301" y="410">Axon</text><path d="M322 388L354 277" class="anesthesia-leader"/>
      <text x="535" y="410">Terminal</text><path d="M580 386L623 319" class="anesthesia-leader"/>
      <line x1="695" x2="695" y1="105" y2="440" stroke="#233540"/>
      <text x="735" y="151" class="anesthesia-kicker">MEMBRANE VOLTAGE</text><text x="735" y="188" class="anesthesia-label">All-or-none pulses</text>
      <path d="M735 245H947M735 295H947M735 345H947" class="anesthesia-grid"/>
      <path d="M735 267H947" stroke="#aa95e2" stroke-dasharray="5 6" opacity=".65"/>
      <path d="${wave(735, 324, 212, peaks, 92)}" stroke="#9aefcd" stroke-width="2.8" fill="none"/>
      <text x="736" y="387" class="anesthesia-small">More input → more pulses</text>
      <path d="M52 492H948" class="anesthesia-grid"/><text x="52" y="526" class="anesthesia-small">INPUT</text><text x="498" y="526" text-anchor="middle">Electrical propagation</text><text x="948" y="526" text-anchor="end" class="anesthesia-small">OUTPUT</text>
    </g>`;
  }
  function synapse(p, step) {
    const releasing = step.phase !== 'gaba' || p.gaba > 0;
    const drug = p.drug > 0;
    const channels = [230, 400, 570];
    const ions = Math.round(p.inhibition * 9);
    const vesicles = [[180, 168], [285, 159], [395, 175], [505, 154], [339, 222], [539, 219]];
    const lipid = Array.from({ length: 41 }, (_, i) => { const x = 55 + i * 15; return `<path d="M${x} 365v14M${x + 4} 366v14M${x} 395v-12M${x + 4} 394v-12" stroke="#67abae" stroke-opacity=".35"/><circle cx="${x}" cy="360" r="4" fill="#558b91"/><circle cx="${x}" cy="399" r="4" fill="#416c79"/>`; }).join('');
    return `<g class="anesthesia-synapse">
      <text x="45" y="46" class="anesthesia-kicker">${step.phase === 'suppression' ? '04 / POSTSYNAPTIC RESPONSE' : '02 / INHIBITORY SYNAPSE'}</text>
      <path d="M295 70L295 110C211 108 129 123 108 167C82 222 126 258 209 269C304 283 465 282 558 262C627 247 652 205 616 166C574 125 486 110 429 110L429 70" fill="url(#anesthesia-tissue)" stroke="#779abb" stroke-opacity=".65" stroke-width="2"/>
      <path d="M116 235C207 286 520 280 616 235" fill="none" stroke="#8aa0bc" stroke-width="2" opacity=".35"/>
      <text x="47" y="97" class="anesthesia-small">Presynaptic terminal</text><path d="M210 92L261 130" class="anesthesia-leader"/>
      <path d="M359 70V116" stroke="#9aefcd" stroke-opacity=".4" stroke-width="3"/>
      ${pulse('M360 74L360 118', '#9aefcd', 1.3, .4, 5)}
      ${vesicles.map(([x, y]) => `<g><circle cx="${x}" cy="${y}" r="25" fill="#534e85" fill-opacity=".13" stroke="#8d88bb" stroke-opacity=".65"/>${[[-7,-5],[6,-7],[-5,8],[9,7]].map(([dx,dy])=>`<circle cx="${x+dx}" cy="${y+dy}" r="4.5" fill="#b2a4fc"/>`).join('')}</g>`).join('')}
      ${releasing ? Array.from({ length: Math.round(p.gaba * 10) }, (_, i) => { const x = 190 + (i * 71) % 420; return pulse(`M${x} 253Q${x - 25} 288 ${channels[i % 3]} 338`, '#b2a4fc', 2.2, i * .24, 4.5); }).join('') : ''}
      <text x="54" y="318" class="anesthesia-small">Synaptic cleft</text>
      <path d="M48 381H675V482Q368 525 48 482Z" fill="url(#anesthesia-post)"/>
      ${lipid}
      ${channels.map((x, i) => `<g>
        <path d="M${x - 24} 335Q${x - 39} 340 ${x - 29} 365L${x - 25} 410Q${x - 12} 422 ${x - 8} 408L${x - 9} 347Z" fill="url(#anesthesia-channel)" stroke="#93cad1" stroke-width="1"/>
        <path d="M${x + 24} 335Q${x + 39} 340 ${x + 29} 365L${x + 25} 410Q${x + 12} 422 ${x + 8} 408L${x + 9} 347Z" fill="url(#anesthesia-channel)" stroke="#93cad1" stroke-width="1"/>
        <path d="M${x} 349V420" stroke="#b2a4fc" opacity="${p.inhibition * .7}" stroke-width="${4 + p.inhibition * 7}"/>
        ${p.gaba > .08 ? `<circle cx="${x - 25}" cy="337" r="7" fill="#b2a4fc"/>` : ''}
        ${drug ? `<path d="M${x+26} 366l9 9-9 9-9-9Z" fill="#9aefcd" stroke="#d9ffee"/>` : ''}
        ${Array.from({length: Math.ceil(ions/3)}, (_,j)=>pulse(`M${x} 311L${x} 437`, '#79d7ec', 2.1 - p.inhibition, j*.43+i*.25, 4)).join('')}
      </g>`).join('')}
      <text x="54" y="457">Postsynaptic neuron</text><text x="393" y="466" class="anesthesia-small" text-anchor="middle">GABA-A channels</text>
      <path d="M704 89V470" stroke="#233540"/>
      <text x="744" y="115" class="anesthesia-kicker">ELECTRICAL OUTPUT</text>
      <text x="744" y="151">${p.firing} <tspan class="anesthesia-small">spikes / s · model</tspan></text>
      <text x="744" y="198" class="anesthesia-small">Without modulation</text>
      <path d="${wave(744, 264, 209, Math.max(1,Math.round(p.baseline/5)), 39)}" stroke="#648290" stroke-width="2" fill="none"/>
      <text x="744" y="319" class="anesthesia-small">Current output</text>
      <path d="M744 342H953M744 393H953" class="anesthesia-grid"/>
      <path d="${wave(744, 393, 209, Math.max(1,Math.round(p.firing/5)), 47)}" stroke="#9aefcd" stroke-width="2.5" fill="none"/>
      <text x="744" y="453" class="anesthesia-small">${p.inhibition > .6 ? 'Inhibition dominates' : 'Excitation can reach threshold'}</text>
      <path d="M48 496H952" class="anesthesia-grid"/>
      <circle cx="60" cy="526" r="5" fill="#b2a4fc"/><text x="76" y="531" class="anesthesia-small">GABA</text>
      <circle cx="215" cy="526" r="5" fill="#79d7ec"/><text x="231" y="531" class="anesthesia-small">Cl⁻</text>
      <path d="M342 519l7 7-7 7-7-7Z" fill="#9aefcd"/><text x="361" y="531" class="anesthesia-small">Anesthetic modulator</text>
      <text x="950" y="531" text-anchor="end" class="anesthesia-small">Schematic · not to scale</text>
    </g>`;
  }
  function network(p, step) {
    const whole = step.phase === 'whole';
    const nodeList = [[255,172],[346,121],[452,102],[559,125],[670,164],[734,228],[647,298],[552,263],[440,311],[338,286],[242,252],[393,207],[507,211],[526,364]];
    const edges = [[0,1],[0,10],[0,11],[1,2],[1,11],[2,3],[2,12],[3,4],[3,12],[4,5],[4,7],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,7],[11,8],[12,13],[8,13],[0,4],[1,6],[10,5],[3,9]];
    const connection = (1 - p.drug * .82) * (step.phase === 'network-intro' ? .3 + .7 * p.drive : 1);
    return `<g class="anesthesia-network">
      <text x="45" y="46" class="anesthesia-kicker">${whole ? '04 / ACROSS SCALES' : '03 / DISTRIBUTED COMMUNICATION'}</text>
      <path d="M226 306C176 291 162 248 179 214C164 177 195 143 229 135C235 95 281 74 322 83C349 52 395 52 427 65C470 38 524 51 548 73C592 58 640 79 656 105C707 101 746 130 750 164C801 182 809 222 788 253C813 289 779 327 743 329C718 366 672 373 631 353C602 379 578 381 556 377L565 413L517 413L511 363C461 384 423 368 395 350C353 376 309 353 290 337C265 341 235 329 226 306Z" fill="url(#anesthesia-tissue)" stroke="#668999" stroke-width="1.8"/>
      <g fill="none" stroke="#618595" stroke-opacity=".22" stroke-width="2"><path d="M231 135Q300 129 302 197T270 283M322 83Q321 137 379 157T406 242M427 65Q455 127 407 145M548 73Q525 136 572 172T613 252M656 105Q622 159 680 202T714 281M226 306Q301 266 350 318M395 350Q432 276 483 318M556 377Q567 313 631 353M743 329Q738 277 671 290"/><path d="M184 226Q240 187 267 213M751 165Q713 145 687 182M489 66Q508 121 478 157M335 350Q343 305 386 295"/></g>
      ${edges.map(([a,b],i)=>{const [x1,y1]=nodeList[a], [x2,y2]=nodeList[b]; const long=i>21;const path=`M${x1} ${y1}Q${(x1+x2)/2} ${(y1+y2)/2-(long?40:10)} ${x2} ${y2}`;const opacity=long?.12+connection*.55:.18+connection*.43;return `<path d="${path}" fill="none" stroke="${long?'#b2a4fc':'#67d8f0'}" stroke-width="${long?1.5:1.7}" opacity="${opacity}"/>${i%3===0&& (connection>.25||!long)?`<g opacity="${opacity+.2}">${pulse(path,long?'#b2a4fc':'#9aefcd',2.5+p.drug*3,i*.23,3.5)}</g>`:''}`;}).join('')}
      ${nodeList.map(([x,y],i)=>`<g><circle cx="${x}" cy="${y}" r="${i===12?25:16}" fill="${i===12?'#b2a4fc':'#67d8f0'}" opacity=".055"/><circle cx="${x}" cy="${y}" r="${i===12?9:5}" fill="${i===12?'#b2a4fc':'#9aefcd'}" opacity="${.3+connection*.7}"/><circle cx="${x}" cy="${y}" r="${i===12?15:10}" stroke="${i===12?'#b2a4fc':'#67d8f0'}" fill="none" opacity=".3"/></g>`).join('')}
      <text x="44" y="128" class="anesthesia-small">CORTEX</text><path d="M115 134L165 134L211 170" class="anesthesia-leader"/>
      <text x="829" y="210" class="anesthesia-small">THALAMUS</text><path d="M813 219L769 219L535 214" class="anesthesia-leader"/>
      <text x="802" y="379" class="anesthesia-small">AROUSAL</text><text x="802" y="401" class="anesthesia-small">CIRCUITS</text><path d="M783 388L650 388L544 365" class="anesthesia-leader"/>
      ${whole ? `<g>${[['Modulate receptor','GABA-A'],['Increase inhibition','Conductance ↑'],['Alter firing','Output ↓'],['Change communication','Network effect']].map(([a,b],i)=>`<g transform="translate(${45+i*236} 463)"><rect width="202" height="70" rx="10" fill="#10232b" stroke="#315149"/><text x="101" y="27" text-anchor="middle" class="anesthesia-small" fill="#a9e9d3">${a}</text><text x="101" y="52" text-anchor="middle" class="anesthesia-small">${b}</text>${i<3?'<path d="M209 35h21" class="anesthesia-leader" marker-end="url(#anesthesia-arrow)"/>':''}</g>`).join('')}</g>` : `<path d="M46 469H952" class="anesthesia-grid"/><circle cx="60" cy="511" r="5" fill="#9aefcd"/><text x="78" y="516" class="anesthesia-small">Local circuit</text><path d="M267 511H298" stroke="#b2a4fc" stroke-width="2"/><text x="311" y="516" class="anesthesia-small">Long-range pathway</text><text x="950" y="516" text-anchor="end" class="anesthesia-small">${p.drug>.5?'Local activity persists · communication altered':'Coordinated activity across regions'}</text>`}
    </g>`;
  }
  window.SignalAtlasModules = window.SignalAtlasModules || {};
  window.SignalAtlasModules.anesthesia = {
    id: 'anesthesia', number: '01', title: 'How Anesthesia Works', discipline: 'Neuroscience', subtitle: 'A small molecule changes a connected mind.', accent: '#b2a4fc',
    initialState: { anesthetic: 55, drive: 70, gaba: 50 }, steps, sources,
    onAction(state, action) { if (action === 'baseline') state.anesthetic = 0; if (action === 'enhance') state.anesthetic = 85; },
    metrics(state, step) {
      const p = physiology(state, step);
      if (step.phase === 'electrical') return [{ label: 'Excitatory input', value: state.drive, unit: '%' }, { label: 'Output', value: Math.round(p.drive*35), unit: 'spikes/s · model' }, { label: 'Signal', value: 'All-or-none' }];
      if (step.phase === 'network-intro') return [{ label: 'Scale', value: 'Network' }, { label: 'Excitatory input', value: state.drive, unit: '%' }, { label: 'State', value: 'Communicating' }];
      return [{ label: 'Anesthetic effect', value: Math.round(p.drug * 100), unit: '% · model' }, { label: 'Inhibitory conductance', value: Math.round(p.inhibition * 100), unit: '% · model' }, { label: 'Neuron output', value: p.firing, unit: 'spikes/s · model' }, { label: ['network-effect','whole'].includes(step.phase) ? 'Communication' : 'Membrane potential', value: ['network-effect','whole'].includes(step.phase) ? p.communication : p.voltage, unit: ['network-effect','whole'].includes(step.phase) ? '% · model' : 'mV · model' }];
    },
    render(state, step) {
      const p = physiology(state, step);
      const visual = step.phase === 'electrical' ? electrical(p) : ['network-intro', 'network-effect', 'whole'].includes(step.phase) ? network(p, step) : synapse(p, step);
      return `<svg class="anesthesia-svg" viewBox="0 0 1000 560" role="img" aria-label="${step.stageTitle}. ${step.description}">${defs()}${visual}</svg>`;
    }
  };
}());
