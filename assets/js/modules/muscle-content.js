/* Scientific content for the Signal Atlas skeletal-muscle mechanism. */
window.SignalAtlasMuscleContent = {
  steps: [
    {
      title: 'A motor neuron fires',
      short: 'Motor-neuron signal',
      part: '01 / The signal',
      scene: 'nmj',
      text: 'An action potential travels along a somatic motor neuron to its axon terminal. This brief electrical event begins the sequence at the neuromuscular junction.',
      key: 'The neuron and muscle fiber generate separate action potentials.',
      cause: 'Motor-neuron action potential',
      effect: 'Axon terminal depolarizes'
    },
    {
      title: 'Acetylcholine carries the message',
      short: 'ACh release',
      part: '01 / The signal',
      scene: 'nmj',
      text: 'Terminal depolarization opens voltage-gated Ca²⁺ channels. Entering Ca²⁺ triggers vesicle fusion, releasing acetylcholine (ACh) into the synaptic cleft.',
      key: 'Presynaptic Ca²⁺ entry triggers neurotransmitter release.',
      cause: 'Ca²⁺ enters the nerve terminal',
      effect: 'ACh vesicles release their contents'
    },
    {
      title: 'A local end-plate potential forms',
      short: 'Nicotinic receptors',
      part: '01 / The signal',
      scene: 'nmj',
      text: 'ACh opens nicotinic receptors on the motor end plate. These channels conduct Na⁺ and K⁺; their net inward current at rest creates a local, graded end-plate potential (EPP).',
      key: 'The EPP is a local depolarization, not the propagated muscle action potential.',
      cause: 'ACh activates nicotinic receptors',
      effect: 'An end-plate potential develops'
    },
    {
      title: 'Threshold launches a muscle action potential',
      short: 'Muscle action potential',
      part: '01 / The signal',
      scene: 'nmj',
      text: 'The end-plate potential brings nearby membrane to threshold. Voltage-gated Na⁺ channels then generate a regenerative, all-or-none muscle action potential.',
      key: 'Nicotinic channels initiate the EPP; voltage-gated channels generate the muscle AP.',
      cause: 'Nearby membrane reaches threshold',
      effect: 'A muscle action potential begins'
    },
    {
      title: 'The signal reaches inside the fiber',
      short: 'Sarcolemma → T-tubules',
      part: '02 / Calcium switch',
      scene: 'triad',
      text: 'The muscle action potential propagates along the sarcolemma and into its T-tubule invaginations. This carries the voltage change close to the SR around the myofibrils.',
      key: 'A T-tubule is continuous with the cell surface; its lumen is extracellular.',
      cause: 'The sarcolemma depolarizes',
      effect: 'T-tubule membranes depolarize'
    },
    {
      title: 'CaV1.1 senses the voltage change',
      short: 'DHPR / CaV1.1',
      part: '02 / Calcium switch',
      scene: 'triad',
      text: 'Depolarization changes the conformation of DHPR / CaV1.1 in the T-tubule membrane. This voltage sensor couples to nearby RyR1 channels in the SR membrane.',
      key: 'Normal skeletal-muscle coupling does not require Ca²⁺ influx through CaV1.1.',
      cause: 'CaV1.1 senses depolarization',
      effect: 'Conformational coupling activates RyR1'
    },
    {
      title: 'RyR1 releases the SR calcium store',
      short: 'RyR1 → Ca²⁺ release',
      part: '02 / Calcium switch',
      scene: 'triad',
      text: 'RyR1 opens a path from the SR lumen into the cytosol. Stored Ca²⁺ flows through these release channels, rapidly raising cytosolic Ca²⁺.',
      key: 'CaV1.1 senses voltage; RyR1 releases stored calcium.',
      cause: 'RyR1 channels open',
      effect: 'Cytosolic Ca²⁺ rises'
    },
    {
      title: 'Calcium binds troponin C',
      short: 'Troponin C',
      part: '02 / Calcium switch',
      scene: 'sarco',
      text: 'Ca²⁺ binds the regulatory sites of troponin C on the thin filament. This changes the troponin complex and prepares the filament for myosin binding.',
      key: 'Calcium controls access to actin; myosin generates the pulling force.',
      cause: 'Ca²⁺ binds troponin C',
      effect: 'The troponin complex changes shape'
    },
    {
      title: 'Tropomyosin shifts to permit binding',
      short: 'Tropomyosin moves',
      part: '02 / Calcium switch',
      scene: 'sarco',
      text: 'The activated troponin complex shifts tropomyosin along actin. Myosin-binding sites become accessible, allowing cross-bridges to form.',
      key: 'Tropomyosin moves on the thin filament; it is not removed or destroyed.',
      cause: 'Troponin changes conformation',
      effect: 'Tropomyosin permits myosin access'
    },
    {
      title: 'An energized myosin head attaches',
      short: '01 · Attach',
      part: '03 / Molecular motor',
      scene: 'sarco',
      text: 'A cocked myosin head carrying ADP and inorganic phosphate (Pi) binds accessible actin. This cross-bridge links a thick filament to a thin filament.',
      key: 'Myosin is already energized by the preceding ATP-hydrolysis step.',
      cause: 'An energized head meets accessible actin',
      effect: 'A cross-bridge forms'
    },
    {
      title: 'The power stroke pulls actin inward',
      short: '02 · Power stroke',
      part: '03 / Molecular motor',
      scene: 'sarco',
      text: 'Strong actin binding and Pi release accompany the force-generating stroke. The myosin head pivots, pulling the thin filament toward the M line; ADP subsequently leaves.',
      key: 'The stroke uses energy stored in the myosin head after ATP hydrolysis.',
      cause: 'The attached myosin head changes conformation',
      effect: 'Actin is pulled toward the M line'
    },
    {
      title: 'A new ATP molecule releases myosin',
      short: '03 · ATP detaches',
      part: '03 / Molecular motor',
      scene: 'sarco',
      text: 'ATP binds the attached myosin head and reduces its affinity for actin. The head detaches, freeing it to begin another cycle.',
      key: 'ATP binding causes detachment; ATP hydrolysis happens afterward.',
      cause: 'New ATP binds myosin',
      effect: 'The cross-bridge detaches'
    },
    {
      title: 'ATP hydrolysis resets the motor',
      short: '04 · Hydrolysis resets',
      part: '03 / Molecular motor',
      scene: 'sarco',
      text: 'Myosin hydrolyzes ATP into ADP and Pi, which remain bound. This re-cocks the detached head into an energized position for its next attachment.',
      key: 'Attachment, stroke, detachment, and reset repeat while calcium and ATP permit.',
      cause: 'Myosin hydrolyzes ATP',
      effect: 'The head is ready to attach again'
    },
    {
      title: 'Filaments slide; the sarcomere shortens',
      short: 'Sliding filaments',
      part: '03 / Molecular motor',
      scene: 'sarco',
      text: 'Repeated cross-bridge cycles draw the Z discs toward one another as thin filaments slide past thick filaments. Overlap increases, while actin and myosin retain their lengths.',
      key: 'The A band stays constant; the I bands and H zone become narrower.',
      cause: 'Many myosin heads pull repeatedly',
      effect: 'Z discs approach and overlap increases'
    },
    {
      title: 'Closely spaced signals add force',
      short: 'Summation & tetanus',
      part: '03 / Molecular motor',
      scene: 'sarco',
      text: 'A new stimulus before full relaxation can add to the preceding twitch: temporal summation. Faster trains sustain Ca²⁺ and produce unfused, then fused tetanus, with little fluctuation in force.',
      key: 'Mechanical twitches merge; individual action potentials remain separate.',
      cause: 'Stimuli arrive before complete relaxation',
      effect: 'Calcium and force remain elevated'
    },
    {
      title: 'SERCA pumps calcium back into the SR',
      short: 'SERCA reuptake',
      part: '04 / Recovery',
      scene: 'triad',
      text: 'As excitation ends, RyR1-mediated release subsides. SERCA uses ATP to return cytosolic Ca²⁺ to the SR; uptake now exceeds release and cytosolic Ca²⁺ falls.',
      key: 'SERCA works during activation too; recovery depends on uptake exceeding release.',
      cause: 'Release declines while SERCA pumps',
      effect: 'Cytosolic Ca²⁺ falls'
    },
    {
      title: 'The molecular brake returns',
      short: 'Relaxation',
      part: '04 / Recovery',
      scene: 'sarco',
      text: 'As Ca²⁺ leaves troponin C, tropomyosin again restricts myosin binding. ATP allows attached heads to detach; force declines, and elastic recoil or an external load can restore length.',
      key: 'Removing calcium prevents new cycling; ATP is still needed to release attached heads.',
      cause: 'Troponin C loses bound Ca²⁺',
      effect: 'Binding is restricted and force declines'
    },
    {
      title: 'The molecular field guide',
      short: 'Glossary',
      part: '05 / Field notes',
      scene: 'glossary',
      text: 'Meet the structures, signals, and motors in the pathway. Each term connects to a specific job in the mechanism.',
      key: 'Follow each molecule by what it senses, carries, releases, or moves.',
      cause: 'A name becomes a function',
      effect: 'The mechanism becomes easier to follow'
    },
    {
      title: 'Eight distinctions that matter',
      short: 'Key facts',
      part: '05 / Field notes',
      scene: 'facts',
      text: 'Keep these causal distinctions in view as you explore the lab. They separate an accurate model from common shortcuts.',
      key: 'Contraction depends on electrical signaling, calcium regulation, and ATP-powered motors.',
      cause: 'Connect the individual events',
      effect: 'Build a coherent explanation'
    },
    {
      title: 'Trace the mechanism yourself',
      short: 'Checkpoint',
      part: '05 / Field notes',
      scene: 'quiz',
      text: 'Eight questions test the links between signal, calcium, movement, and recovery. Use the explanations to revisit any uncertain step.',
      key: 'Predict what follows from each event, rather than recalling the sequence alone.',
      cause: 'Choose the causal connection',
      effect: 'Check and strengthen your understanding'
    }
  ],
  glossary: [
    { term: 'Acetylcholine (ACh)', definition: 'The neurotransmitter released by the motor neuron. Acetylcholinesterase breaks it down in the synaptic cleft, ending its receptor action.' },
    { term: 'Nicotinic ACh receptor', definition: 'An ACh-gated cation channel at the motor end plate. Its net inward current at rest initiates local depolarization.' },
    { term: 'End-plate potential (EPP)', definition: 'The local, graded depolarization caused by nicotinic receptor current. It can trigger a separate, propagated muscle action potential.' },
    { term: 'Sarcolemma', definition: 'The muscle fiber’s plasma membrane, along which the muscle action potential propagates.' },
    { term: 'T-tubule', definition: 'An inward extension of the sarcolemma that carries depolarization into the fiber. Its lumen remains continuous with extracellular fluid.' },
    { term: 'DHPR / CaV1.1', definition: 'The skeletal-muscle L-type calcium-channel complex that serves as the T-tubule voltage sensor for activation of RyR1.' },
    { term: 'Ryanodine receptor 1 (RyR1)', definition: 'The SR calcium-release channel activated through coupling to CaV1.1 during skeletal-muscle excitation.' },
    { term: 'Sarcoplasmic reticulum (SR)', definition: 'An intracellular membrane network that stores and releases Ca²⁺. It is distinct from the T-tubule membrane.' },
    { term: 'Troponin C', definition: 'The calcium-binding component of the troponin regulatory complex. Calcium binding promotes a change in tropomyosin position.' },
    { term: 'Tropomyosin', definition: 'A protein running along actin that regulates access to myosin-binding sites. It changes position as the thin filament is activated.' },
    { term: 'Actin', definition: 'The main structural protein of thin filaments. Myosin binds actin and pulls the thin filament toward the sarcomere center.' },
    { term: 'Myosin', definition: 'The motor protein of thick filaments. Its heads bind actin, generate force, detach with ATP binding, and reset through ATP hydrolysis.' },
    { term: 'Sarcomere', definition: 'The contractile unit between two Z discs, which anchor thin filaments. The central M line organizes thick filaments.' },
    { term: 'A band', definition: 'The region spanning the full length of the thick filaments, including their overlap with thin filaments. Its width stays constant during sliding.' },
    { term: 'I band / H zone', definition: 'The I band contains thin filaments without thick filaments; the H zone contains thick filaments without thin filaments. Both narrow as the sarcomere shortens.' },
    { term: 'SERCA', definition: 'The sarcoplasmic/endoplasmic reticulum Ca²⁺-ATPase: an ATP-powered pump that moves cytosolic calcium back into the SR.' }
  ],
  facts: [
    { title: 'An EPP is not an action potential', body: 'The EPP is local and graded. When it reaches threshold in adjacent membrane, voltage-gated channels produce a regenerative muscle action potential.' },
    { title: 'Two calcium signals, two locations', body: 'Calcium enters the nerve terminal to trigger ACh release. Later, RyR1 releases the muscle fiber’s own SR calcium store into its cytosol.' },
    { title: 'A voltage sensor and a release channel', body: 'CaV1.1 senses T-tubule voltage; RyR1 releases SR calcium. Normal skeletal-muscle coupling does not require calcium influx through CaV1.1.' },
    { title: 'Calcium regulates; myosin pulls', body: 'Calcium binds troponin C, shifting tropomyosin and permitting binding. The actin–myosin interaction generates force.' },
    { title: 'ATP supports cycling and recovery', body: 'ATP binding detaches myosin. Hydrolysis resets the head. SERCA also consumes ATP to restore low cytosolic calcium.' },
    { title: 'ATP depletion is a lock, not relaxation', body: 'Already attached heads cannot detach without ATP. Lowering calcium alone does not release those rigor-like bridges. This extreme state is distinct from ordinary exercise fatigue.' },
    { title: 'Shorter sarcomere, unchanged filaments', body: 'Z discs approach as overlap increases; the A band stays constant. Force does not always produce shortening: an isometric contraction develops tension at a fixed overall length.' },
    { title: 'Tetanus fuses force, not action potentials', body: 'Repeated stimuli can arrive before full relaxation and sum mechanically. At sufficiently high frequency the force becomes nearly steady; the fusion frequency varies with muscle-fiber properties.' }
  ],
  quiz: [
    {
      question: 'What converts the local end-plate potential into a propagated muscle action potential?',
      options: ['ACh moving directly into the SR', 'Nearby voltage-gated Na⁺ channels opening at threshold', 'Troponin C releasing calcium', 'Myosin hydrolyzing ATP'],
      correct: 1,
      explanation: 'Nicotinic receptors produce the local EPP. Threshold depolarization then activates nearby voltage-gated Na⁺ channels to generate the muscle AP.'
    },
    {
      question: 'Which pairing correctly describes skeletal-muscle excitation–contraction coupling?',
      options: ['RyR1 senses ACh; CaV1.1 pumps calcium', 'CaV1.1 binds actin; RyR1 releases ATP', 'CaV1.1 senses voltage; RyR1 releases SR calcium', 'Both channels generate the end-plate potential'],
      correct: 2,
      explanation: 'The T-tubule voltage sensor CaV1.1 couples to RyR1 in the SR membrane. Calcium influx through CaV1.1 is not required for this skeletal-muscle release mechanism.'
    },
    {
      question: 'Which event makes actin more accessible to myosin?',
      options: ['Calcium binding to troponin C shifts tropomyosin', 'ATP binding directly to tropomyosin removes it', 'Actin filaments becoming shorter', 'SERCA releasing calcium into the cytosol'],
      correct: 0,
      explanation: 'Ca²⁺ binds troponin C. The resulting regulatory change shifts tropomyosin on the thin filament, permitting myosin binding.'
    },
    {
      question: 'What happens when a new ATP molecule binds an actin-bound myosin head?',
      options: ['The power stroke begins immediately', 'The head becomes permanently attached', 'The SR releases calcium', 'The head detaches from actin'],
      correct: 3,
      explanation: 'ATP binding reduces myosin’s affinity for actin and causes detachment. ATP hydrolysis subsequently resets the detached head.'
    },
    {
      question: 'Which event resets detached myosin into its energized position?',
      options: ['Acetylcholine breakdown', 'ATP hydrolysis, leaving ADP and Pi bound', 'Calcium pumping by SERCA', 'The A band becoming narrower'],
      correct: 1,
      explanation: 'Myosin hydrolyzes ATP and re-cocks. ADP and Pi remain bound as the head prepares for another attachment.'
    },
    {
      question: 'ATP is absent and myosin is already firmly attached. What does lowering calcium alone accomplish?',
      options: ['It instantly detaches every head', 'It supplies energy for a new cycle', 'It limits new activation, but does not release the locked heads', 'It restores ATP through the power stroke'],
      correct: 2,
      explanation: 'Calcium withdrawal reduces thin-filament activation, but ATP binding is still required for existing rigor-like actin–myosin attachments to detach.'
    },
    {
      question: 'What remains approximately unchanged as a sarcomere shortens?',
      options: ['A-band width and filament lengths', 'The distance between Z discs', 'The widths of the I bands', 'The width of the H zone'],
      correct: 0,
      explanation: 'The filaments slide without shortening. Thick-filament length defines the A band; Z-disc spacing, I bands, and the H zone decrease.'
    },
    {
      question: 'Why can faster stimulation produce greater, more sustained force?',
      options: ['Individual action potentials become longer and fuse', 'Each stimulus makes myosin permanently shorter', 'ATP is no longer needed between stimuli', 'Calcium and mechanical activation persist between closely spaced stimuli'],
      correct: 3,
      explanation: 'Repeated stimuli before full relaxation cause temporal summation. Faster trains can produce fused tetanus while individual action potentials remain separate.'
    }
  ],
  sources: [
    { label: 'Purves · Neuromuscular junction and the end-plate potential', url: 'https://www.ncbi.nlm.nih.gov/books/NBK11013/' },
    { label: 'Nature Communications · CaV1.1 voltage sensing and coupling', url: 'https://www.nature.com/articles/s41467-024-51809-5' },
    { label: 'NCBI Bookshelf · Skeletal muscle contraction and SERCA', url: 'https://www.ncbi.nlm.nih.gov/books/NBK559006/' },
    { label: 'OpenStax · Cross-bridge cycling and sliding filaments', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/10-3-muscle-fiber-contraction-and-relaxation' },
    { label: 'OpenStax · Muscle tension, summation, and tetanus', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/10-4-nervous-system-control-of-muscle-tension' }
  ]
};
