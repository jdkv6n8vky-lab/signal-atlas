(function () {
  'use strict';
  const glucoseControl = () => ({ type: 'range', id: 'glucose', label: 'Starting blood glucose', min: 80, max: 200, step: 5, unit: 'mg/dL', hint: 'Explore a simplified response; values are not a diagnostic test.' });
  const responseControl = () => ({ type: 'range', id: 'response', label: 'Insulin response strength', min: 0, max: 100, step: 5, unit: '%', hint: 'Change beta-cell secretion relative to the glucose stimulus.' });
  const experiment = () => ({ type: 'actions', label: 'Glucose experiment', options: [{ action: 'meal', label: 'Add a meal pulse' }, { action: 'restore', label: 'Restore baseline' }] });
  const sources = [
    { label: 'NIDDK · How eating and fasting regulate insulin', url: 'https://www.niddk.nih.gov/news/archive/2023/how-eating-fasting-regulate-insulin' },
    { label: 'Kearney et al. · Akt signaling and GLUT4-mediated uptake · eLife, 2017', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5462539/' },
    { label: 'Fisher & Kahn · Insulin signaling and hepatic glucose production · JCI, 2003', url: 'https://www.jci.org/articles/view/16426' },
    { label: 'NIDDK · Insulin resistance and prediabetes', url: 'https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance' }
  ];
  const checkpoint = (title, question, options, correct, explanation) => ({ title, type: 'quiz', description: 'Connect the molecular events to the whole-body response.', quiz: { question, options, correct, explanation } });
  const steps = [
    { title: 'After a meal', description: 'Digested carbohydrate supplies glucose to the circulation. Blood glucose rises, creating a signal that the body can use to coordinate fuel uptake and storage.', phase: 'meal', stageTitle: 'A nutrient becomes a signal', stageSubtitle: 'Bloodstream · pancreas · insulin-sensitive tissue', context: { title: 'Change the starting condition', body: 'Raise glucose and watch the number of glucose molecules in the bloodstream increase. The pancreas will respond to this changing supply.' }, controls: [glucoseControl()] },
    { title: 'Beta cells sense glucose', description: 'Glucose enters pancreatic beta cells and is metabolized. A rise in the ATP-to-ADP ratio helps close ATP-sensitive potassium channels, shifting the membrane toward depolarization.', phase: 'sense', stageTitle: 'Metabolism is the sensor', stageSubtitle: 'A beta cell within a pancreatic islet', context: { title: 'A chemical-to-electrical conversion', body: 'Glucose metabolism changes the cell’s energy state. Less potassium leaves through KATP channels, allowing the membrane voltage to become less negative.' }, controls: [glucoseControl()], note: 'This shows the canonical triggering pathway; beta-cell secretion also has amplifying and modulatory pathways.' },
    { title: 'Calcium triggers secretion', description: 'Depolarization opens voltage-gated calcium channels. Incoming calcium triggers insulin-containing granules to fuse with the beta-cell membrane and release their contents.', phase: 'secrete', stageTitle: 'The hormone is released', stageSubtitle: 'Depolarization → Ca²⁺ entry → exocytosis', context: { title: 'Granules, ready to release', body: 'Reduce insulin response strength to see fewer insulin molecules leave the cell, even with the same glucose stimulus.' }, controls: [glucoseControl(), responseControl()] },
    { title: 'A message in circulation', description: 'Insulin travels in blood to its target tissues. The hormone carries information about nutrient availability; it is not the glucose molecule and is not consumed as fuel.', phase: 'circulate', stageTitle: 'One hormone, many destinations', stageSubtitle: 'Endocrine signaling through the circulation', context: { title: 'First stop: the liver', body: 'Pancreatic blood drains into the portal circulation before reaching the wider body. This overview compresses that route to connect the pancreas with muscle and adipose tissue.' }, controls: [responseControl()] },
    { title: 'The receptor receives it', description: 'Insulin binds the insulin receptor on a muscle or adipose cell. The receptor’s internal tyrosine kinase activity initiates signaling inside the cell.', phase: 'receptor', stageTitle: 'The membrane receives the message', stageSubtitle: 'Insulin receptor · extracellular binding, intracellular response', context: { title: 'A receptor is not a glucose door', body: 'The insulin receptor transmits a signal. Glucose will cross through a separate transport protein called GLUT4.' }, controls: [responseControl()] },
    { title: 'Relay the signal', description: 'A major pathway links the activated receptor to IRS proteins, PI3K, and Akt. Through downstream regulators, including TBC1D4, this signaling releases constraints on GLUT4 vesicle trafficking.', phase: 'cascade', stageTitle: 'A molecular relay inside the cell', stageSubtitle: 'Insulin receptor → IRS → PI3K → Akt', context: { title: 'The message is amplified', body: 'Protein phosphorylation and membrane lipid signals coordinate the relay. This diagram groups several intermediate reactions into a few readable steps.' }, controls: [responseControl()], note: 'The pathway has branches and feedback; the diagram shows a major route to GLUT4 trafficking.' },
    { title: 'Bring transporters to the surface', description: 'GLUT4-containing vesicles move toward and fuse with the plasma membrane. More GLUT4 at the surface gives glucose more routes into muscle and adipose cells.', phase: 'glut4', stageTitle: 'A membrane that can change', stageSubtitle: 'Stored vesicles → surface transporters', context: { title: 'Location changes function', body: 'Most GLUT4 is held inside the cell between signals. Insulin shifts the balance toward the cell surface; transporters continue to cycle in both directions.' }, controls: [responseControl()] },
    { title: 'Glucose enters the cell', description: 'Glucose moves through GLUT4 by facilitated diffusion. Its intracellular metabolism helps maintain the inward gradient. Watch circulating glucose fall as uptake proceeds in this accelerated model.', phase: 'uptake', stageTitle: 'The fuel follows the signal', stageSubtitle: 'Surface GLUT4 → facilitated glucose uptake', context: { title: 'Run a small experiment', body: 'Change glucose or secretion strength to restart the response. Stronger insulin signaling recruits more GLUT4, making the excess glucose decline faster in this model.' }, controls: [glucoseControl(), responseControl(), experiment()], note: 'Time and uptake rates are illustrative. This is not a pharmacokinetic or clinical glucose model.' },
    { title: 'The liver changes the balance', description: 'Insulin promotes hepatic glycogen synthesis and suppresses glucose production. Liver glucose transport mainly uses GLUT2, so hepatic regulation is different from GLUT4 recruitment in muscle and fat.', phase: 'liver', stageTitle: 'Store supply. Reduce output.', stageSubtitle: 'Hepatic insulin action · glycogen synthesis', context: { title: 'A branched reserve', body: 'Glycogen is a polymer of glucose. Insulin shifts liver metabolism toward storage and away from releasing glucose; it does not insert GLUT4 into hepatocyte membranes.' }, controls: [responseControl()] },
    { title: 'Close the feedback loop', description: 'As uptake and storage reduce the glucose rise, the stimulus for insulin secretion weakens. Add a meal pulse, then watch glucose and the insulin signal move back toward the model’s baseline.', phase: 'feedback', stageTitle: 'A signal that quiets itself', stageSubtitle: 'Nutrient supply → hormone → uptake → feedback', context: { title: 'Less glucose, less stimulus', body: 'The falling glucose signal reduces beta-cell secretion. Other hormones, liver glucose output, and insulin-independent uptake also help regulate real glucose levels.' }, controls: [responseControl(), experiment()], note: 'The model uses an illustrative 90 mg/dL baseline and accelerated time; it does not simulate disease or treatment.' },
    { title: 'The language of metabolism', description: 'The essential terms behind this feedback system.', type: 'glossary', stageTitle: 'Insulin signaling, decoded', terms: [
      { term: 'Beta cell', definition: 'An insulin-secreting cell found in the pancreatic islets.' },
      { term: 'Insulin', definition: 'A peptide hormone that coordinates nutrient use and storage across several tissues.' },
      { term: 'KATP channel', definition: 'An ATP-sensitive potassium channel linking cellular energy state to membrane voltage.' },
      { term: 'Exocytosis', definition: 'Fusion of an internal vesicle with the cell membrane to release its contents.' },
      { term: 'Insulin receptor', definition: 'A membrane receptor with tyrosine kinase activity that initiates intracellular signaling.' },
      { term: 'Akt', definition: 'A protein kinase that helps relay insulin’s metabolic signal toward targets including GLUT4 trafficking machinery.' },
      { term: 'GLUT4', definition: 'An insulin-responsive glucose transporter prominent in skeletal muscle and adipose tissue.' },
      { term: 'Glycogen', definition: 'A highly branched glucose polymer that stores carbohydrate, especially in liver and muscle.' }
    ] },
    { title: 'Beyond the simplified model', description: 'Real regulation has more than one input and more than one destination.', type: 'facts', stageTitle: 'A flexible metabolic system', facts: [
      { title: 'Cells do not all respond equally', body: 'Insulin resistance means target tissues respond less effectively to insulin. Secretion strength and tissue sensitivity are distinct variables; this module changes secretion.' },
      { title: 'GLUT4 is not universal', body: 'Different tissues express different glucose transporters. The GLUT4 recruitment story applies especially to muscle and adipose tissue, not every cell in the body.' },
      { title: 'The liver does more than store', body: 'Insulin also restrains hepatic glucose production. Whole-body glucose balance depends on glucose entering the blood as well as glucose leaving it.' },
      { title: 'Secretion adapts', body: 'Beta cells respond on several timescales. Research in mouse and human islets also links nutrient conditions to gene and epigenome changes that modify insulin secretion.' }
    ], sources },
    checkpoint('Checkpoint 01 · The sensor', 'Which sequence best describes the beta-cell triggering pathway?', ['Insulin enters → glucose leaves → ATP falls', 'Glucose metabolism → KATP closure → depolarization → calcium entry', 'Calcium leaves → potassium enters → insulin is destroyed', 'GLUT4 makes insulin inside the bloodstream'], 1, 'Glucose metabolism raises the ATP-to-ADP ratio, helping close KATP channels. Depolarization then opens voltage-gated calcium channels, and calcium triggers granule exocytosis.'),
    checkpoint('Checkpoint 02 · Two proteins', 'How do the insulin receptor and GLUT4 differ?', ['Both are channels that transport insulin', 'GLUT4 receives insulin; its receptor stores glucose', 'The receptor relays a signal; GLUT4 transports glucose', 'They are two names for the same protein'], 2, 'The insulin receptor starts an intracellular signaling cascade. GLUT4 is a separate membrane transporter that allows glucose to cross by facilitated diffusion.'),
    checkpoint('Checkpoint 03 · The liver', 'Which statement accurately describes liver insulin action?', ['It inserts GLUT4 into every hepatocyte', 'It turns glycogen into insulin', 'It increases glucose production after every meal', 'It promotes glycogen synthesis and suppresses glucose production'], 3, 'Liver insulin action regulates metabolic pathways. Hepatocytes primarily use GLUT2 for glucose transport, so the hepatic mechanism differs from GLUT4 recruitment in muscle and fat.'),
    checkpoint('Checkpoint 04 · Feedback', 'Why does insulin secretion usually decrease as the meal-related glucose rise subsides?', ['The original glucose stimulus is becoming smaller', 'All beta cells are permanently switched off', 'Insulin receptors turn into glucose molecules', 'Negative feedback requires glucose to reach zero'], 0, 'As glucose falls, its stimulation of beta cells weakens. That is negative feedback: the response reduces the disturbance that first triggered it, while other mechanisms maintain glucose availability.')
  ];

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  function model(state, step) {
    const live = ['uptake', 'feedback'].includes(step.phase);
    const glucose = live ? state.currentGlucose : state.glucose;
    const stimulus = clamp((glucose - 85) / 100, 0, 1);
    const insulin = stimulus * state.response / 100;
    return { glucose, stimulus, insulin, transporters: Math.round(1 + insulin * 5), uptake: insulin * Math.max(0, glucose - 90) * .055, live };
  }
  // Preserve the motion phase when the engine redraws the live feedback model.
  let motionClock = 0;
  const move = (path, color, dur, delay, size) => `<circle r="${size || 4}" fill="${color}"><animateMotion path="${path}" dur="${dur}s" begin="-${(delay || 0) + motionClock}s" repeatCount="indefinite"/></circle>`;
  const hex = (x, y, r, opacity) => `<path d="M${x-r} ${y}l${r*.5} ${-r*.866}h${r}l${r*.5} ${r*.866}-${r*.5} ${r*.866}h-${r}Z" fill="#9aefcd" fill-opacity="${opacity || .75}" stroke="#bcf5df" stroke-width="1.2"/>`;
  const hormone = (x,y,opacity) => `<g opacity="${opacity === undefined ? 1 : opacity}"><path d="M${x-8} ${y+3}Q${x-2} ${y-11} ${x+8} ${y-1}Q${x+11} ${y+9} ${x} ${y+7}Z" fill="#67d8f0"/><circle cx="${x-8}" cy="${y+2}" r="3" fill="#adf0ff"/></g>`;
  function defs() { return `<defs>
    <linearGradient id="insulin-cell" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#183d45" stop-opacity=".7"/><stop offset="1" stop-color="#162139" stop-opacity=".45"/></linearGradient>
    <linearGradient id="insulin-organ" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#b698af" stop-opacity=".7"/><stop offset=".55" stop-color="#675270" stop-opacity=".6"/><stop offset="1" stop-color="#473950" stop-opacity=".5"/></linearGradient>
    <linearGradient id="insulin-blood" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#663544" stop-opacity=".32"/><stop offset=".5" stop-color="#342137" stop-opacity=".25"/><stop offset="1" stop-color="#663544" stop-opacity=".35"/></linearGradient>
    <linearGradient id="insulin-channel" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#478b7a"/><stop offset=".5" stop-color="#b9f1d8"/><stop offset="1" stop-color="#387063"/></linearGradient>
    <radialGradient id="insulin-nucleus"><stop stop-color="#b2a4fc" stop-opacity=".2"/><stop offset="1" stop-color="#747196" stop-opacity=".05"/></radialGradient>
    <marker id="insulin-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10" fill="none" stroke="#8bc8be" stroke-width="1.5"/></marker>
  </defs>`; }
  function legend() { return `<path d="M45 508H955" class="insulin-grid"/>${hex(58,535,6)}<text x="76" y="541" class="insulin-small">Glucose</text>${hormone(217,535)}<text x="235" y="541" class="insulin-small">Insulin</text><circle cx="381" cy="535" r="5" fill="#b2a4fc"/><text x="399" y="541" class="insulin-small">Intracellular signal</text><text x="952" y="541" text-anchor="end" class="insulin-small">Schematic · not to scale</text>`; }
  function pancreas(x,y,scale) {
    return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M8 66C-2 36 30 14 54 29C75 4 111 18 128 32C152 18 168 28 187 39C215 34 241 43 270 37C298 26 315 38 299 54C278 75 256 88 228 88C205 104 181 87 168 94C144 113 129 89 109 102C84 119 70 87 55 102C28 115 9 100 8 66Z" fill="url(#insulin-organ)" stroke="#baa3bc" stroke-opacity=".6" stroke-width="2"/>${Array.from({length:16},(_,i)=>`<ellipse cx="${29+(i*31)%245}" cy="${47+(i*17)%37}" rx="17" ry="12" transform="rotate(${i%2?20:-18} ${29+(i*31)%245} ${47+(i*17)%37})" fill="none" stroke="#d3b5ce" stroke-opacity=".19"/>`).join('')}<path d="M44 69Q135 56 268 53" fill="none" stroke="#e0b7c7" opacity=".45" stroke-width="2"/>${[[77,55],[130,76],[193,58],[248,60]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="5" fill="#67d8f0" opacity=".7"/>`).join('')}</g>`;
  }
  function vessel(p, x, y, width) {
    const count = Math.round((p.glucose - 60) / 6);
    return `<rect x="${x}" y="${y}" width="${width}" height="84" rx="42" fill="url(#insulin-blood)" stroke="#8e566a" stroke-opacity=".65"/><path d="M${x+38} ${y+8}H${x+width-38}M${x+38} ${y+76}H${x+width-38}" stroke="#aa6b7e" stroke-opacity=".18"/>${Array.from({length:count},(_,i)=>{const xx=x+34+(i*53)%(width-66),yy=y+23+(i%3)*19;return `<g class="insulin-glucose-drift" style="animation-delay:-${i*.31}s">${hex(xx,yy,5.5)}</g>`;}).join('')}${Array.from({length:Math.round(p.insulin*15)},(_,i)=>{const xx=x+59+(i*79)%(width-110);return hormone(xx,y+30+(i%2)*28,.85);}).join('')}<path d="M${x+width-45} ${y+42}h18" stroke="#ba8ca0" marker-end="url(#insulin-arrow)"/>`;
  }
  function overview(p,state,step) {
    const feedback=step.phase==='feedback';
    const active=step.phase!=='meal';
    const count=active?p.transporters:1;
    return `<text x="45" y="45" class="insulin-kicker">${feedback?'05 / WHOLE-BODY FEEDBACK':'01 / NUTRIENT SENSING'}</text>
      ${vessel(p,55,89,890)}<text x="65" y="75" class="insulin-small">CIRCULATION</text>
      <text x="70" y="228" class="insulin-kicker">PANCREAS</text>${pancreas(70,259,.96)}
      <circle cx="195" cy="331" r="34" fill="none" stroke="#67d8f0" stroke-dasharray="3 5" opacity=".7"/><text x="81" y="418">Islets contain beta cells</text><path d="M196 389V371" class="insulin-leader"/>
      ${active?`<path d="M335 300C440 290 434 204 461 174" class="insulin-flow"/>${Array.from({length:Math.round(p.insulin*7)},(_,i)=>move('M335 300C440 290 434 204 461 174','#67d8f0',2.6,i*.42,4)).join('')}<text x="389" y="326" class="insulin-small">Insulin</text>`:''}
      <text x="631" y="217" class="insulin-kicker">MUSCLE / ADIPOSE CELL</text>
      <ellipse cx="744" cy="351" rx="155" ry="118" fill="url(#insulin-cell)" stroke="#68999b" stroke-width="2"/><ellipse cx="744" cy="351" rx="146" ry="110" fill="none" stroke="#4b717f" stroke-width="1"/><ellipse cx="787" cy="374" rx="42" ry="34" fill="url(#insulin-nucleus)" stroke="#65678d" stroke-opacity=".35"/>
      ${Array.from({length:count},(_,i)=>{const x=662+i*31;return `<rect x="${x}" y="236" width="11" height="25" rx="4" fill="url(#insulin-channel)"/>${active?move(`M${x+5} 175Q${x-12} 202 ${x+5} 298`,'#9aefcd',2.3-i*.13,i*.5,4):''}`;}).join('')}
      <text x="648" y="326">${active?'Glucose uptake':'Ready to respond'}</text><text x="647" y="350" class="insulin-small">${active?'GLUT4 at the surface':'Basal glucose transport'}</text>
      ${feedback?`<path d="M584 409C491 478 398 449 326 404" class="insulin-flow" stroke-dasharray="5 7"/><text x="401" y="480" class="insulin-small">Glucose ↓ → secretion ↓</text>`:`<text x="78" y="477" class="insulin-small">${step.phase==='meal'?'Raise glucose to increase the nutrient signal.':'Insulin is the signal. Glucose is the fuel.'}</text>`}
      ${legend()}`;
  }
  function betaCell(p,step) {
    const secretion=step.phase==='secrete';
    const active=p.stimulus>.2;
    return `<text x="45" y="45" class="insulin-kicker">02 / BETA-CELL STIMULUS–SECRETION COUPLING</text>
      <ellipse cx="488" cy="278" rx="232" ry="174" fill="url(#insulin-cell)" stroke="#75aaad" stroke-width="2"/><ellipse cx="488" cy="278" rx="223" ry="165" fill="none" stroke="#527a8a" opacity=".55"/>
      <text x="395" y="83" class="insulin-small">GLUCOSE ENTRY</text>${hex(486,99,7)}${move('M487 99L487 176','#9aefcd',1.8,.5,5)}
      <g transform="translate(431 177)"><path d="M0 20C-4-4 49-16 77 2C112 20 96 49 64 52C25 59 1 43 0 20Z" fill="#665675" fill-opacity=".35" stroke="#b2a4fc" stroke-opacity=".75"/><path d="M12 20Q24 5 35 23T58 17T80 28M14 35Q26 18 38 36T67 35" fill="none" stroke="#b2a4fc" stroke-opacity=".7" stroke-width="2"/></g>
      <text x="421" y="259" class="insulin-small">Metabolism → ATP ↑</text>
      <path d="M436 277Q382 280 298 289" class="insulin-flow" marker-end="url(#insulin-arrow)"/>
      <rect x="245" y="264" width="30" height="58" rx="9" fill="#263c48" stroke="#9aefcd"/><path d="M251 282h18M251 304h18" stroke="#9aefcd" stroke-width="${active?5:1}"/>
      <text x="45" y="267">KATP channel</text><text x="45" y="292" class="insulin-small">${active?'Closing → less K⁺ exit':'Open → K⁺ can leave'}</text><path d="M172 307H228" class="insulin-leader"/>
      ${!active?move('M289 295L206 295','#9aefcd',2,.1,4):''}
      <path d="M293 352Q466 471 678 349" fill="none" stroke="#c3aaf6" stroke-dasharray="4 7" stroke-width="1.4" opacity="${active?.8:.25}"/>
      <text x="355" y="340" class="insulin-small">${active?'Membrane depolarizes':'Membrane near rest'}</text>
      <rect x="701" y="249" width="29" height="60" rx="9" fill="#294753" stroke="#67d8f0"/><path d="M707 268h17M707 291h17" stroke="#67d8f0" stroke-width="${active?1:5}"/>
      <text x="781" y="246">Ca²⁺ channel</text><text x="781" y="271" class="insulin-small">${active?'Voltage-gated · open':'Voltage-gated · closed'}</text><path d="M738 284H766" class="insulin-leader"/>
      ${active?Array.from({length:3},(_,i)=>move('M772 279L653 281','#67d8f0',1.8,i*.5,4)).join(''):''}
      ${[[601,323],[648,363],[603,390]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="21" fill="#214455" fill-opacity=".65" stroke="#78bed1"/>${hormone(x,y,.9)}`).join('')}
      <text x="776" y="380" class="insulin-small">Insulin granules</text><path d="M760 369H687" class="insulin-leader"/>
      ${secretion?Array.from({length:Math.round(p.insulin*8)},(_,i)=>move('M604 397Q659 437 725 470','#67d8f0',2.2,i*.29,4.5)).join(''):''}
      <text x="54" y="459" class="insulin-small">${secretion?'Ca²⁺ triggers granule fusion and release.':'Energy state controls electrical activity.'}</text>
      <path d="M525 477H942" stroke="#713d56" stroke-width="26" stroke-opacity=".25"/><path d="M525 461H942M525 493H942" stroke="#815063" stroke-opacity=".6"/><text x="798" y="483" class="insulin-small">To circulation</text>${legend()}`;
  }
  function receptor(x,active) { return `<g stroke="${active?'#67d8f0':'#597d8b'}" fill="none" stroke-linecap="round"><path d="M${x-8} 269V209L${x-40} 177M${x+8} 269V209L${x+40} 177" stroke-width="10" opacity=".28"/><path d="M${x-8} 269V209L${x-40} 177M${x+8} 269V209L${x+40} 177" stroke-width="4"/><path d="M${x-37} 177Q${x} 203 ${x+37} 177" stroke-width="3"/><circle cx="${x-8}" cy="276" r="8" fill="${active?'#67d8f0':'#294554'}"/><circle cx="${x+8}" cy="276" r="8" fill="${active?'#67d8f0':'#294554'}"/></g>`; }
  function channel(x,y) { return `<g><rect x="${x-14}" y="${y-22}" width="10" height="46" rx="5" fill="url(#insulin-channel)"/><rect x="${x+4}" y="${y-22}" width="10" height="46" rx="5" fill="url(#insulin-channel)"/><path d="M${x} ${y-14}v29" stroke="#9aefcd" stroke-opacity=".25" stroke-width="5"/></g>`; }
  function membrane(p,step) {
    const cascade=['cascade','glut4','uptake'].includes(step.phase);
    const trafficking=['glut4','uptake'].includes(step.phase);
    const uptake=step.phase==='uptake';
    const slots=[548,620,692,764,836,908];
    const number=trafficking?p.transporters:1;
    return `<text x="45" y="45" class="insulin-kicker">03 / INSULIN SIGNALING IN MUSCLE &amp; ADIPOSE TISSUE</text>
      <text x="51" y="94" class="insulin-small">OUTSIDE THE CELL</text>
      ${Array.from({length:Math.round((p.glucose-60)/8)},(_,i)=>hex(371+(i*79)%562,95+(i%3)*30,6)).join('')}
      <text x="54" y="140">Insulin receptor</text><path d="M186 148L212 172" class="insulin-leader"/>
      ${p.insulin>.01?hormone(235,178):''}${Array.from({length:Math.round(p.insulin*6)},(_,i)=>hormone(239+i*55,111+(i%2)*29,.55)).join('')}
      <path d="M45 227H955V489H45Z" fill="url(#insulin-cell)"/>
      ${Array.from({length:57},(_,i)=>{const x=49+i*16;return `<path d="M${x} 220v12M${x+4} 220v12M${x} 240v-8M${x+4} 240v-8" stroke="#629b99" stroke-opacity=".5"/><circle cx="${x}" cy="216" r="4" fill="#649d9b"/><circle cx="${x}" cy="244" r="4" fill="#416a7a"/>`;}).join('')}
      ${receptor(235,p.insulin>.02)}
      ${slots.slice(0,number).map(x=>channel(x,230)).join('')}
      <text x="410" y="307" class="insulin-small">${trafficking?'Surface GLUT4':'Basal GLUT4'}</text><path d="M521 289L540 254" class="insulin-leader"/>
      <text x="50" y="478" class="insulin-small">INSIDE THE CELL</text>
      <g opacity="${cascade?1:.25}"><path d="M235 291V340H499" class="insulin-flow"/>
      ${[['IRS',235],['PI3K',361],['Akt',487]].map(([name,x],i)=>`<circle cx="${x}" cy="349" r="30" fill="#242b48" stroke="#a99cdf" stroke-opacity="${Math.min(1,p.insulin+.25)}"/><text x="${x}" y="355" text-anchor="middle">${name}</text>${cascade&&p.insulin>.01&&i<2?move(`M${x+33} 349L${x+92} 349`,'#b2a4fc',1.3+i*.2,.3,4):''}`).join('')}
      <text x="261" y="409" class="insulin-small">A major signaling pathway</text></g>
      <path d="M523 350Q605 350 650 402" class="insulin-flow" opacity="${cascade?.6:.15}"/>
      <text x="561" y="451" class="insulin-small">Via TBC1D4 / Rab regulators</text>
      ${[[708,390],[841,397]].map(([x,y],i)=>`<g opacity="${trafficking?.9:.6}"><circle cx="${x}" cy="${y}" r="35" fill="#254443" fill-opacity=".3" stroke="#75b3a0" stroke-dasharray="${trafficking?'none':'4 4'}"/>${channel(x,y)}${trafficking?`<path d="M${x} ${y-41}Q${x+30} 312 ${slots[Math.min(number-1,i+1)]} 259" class="insulin-flow" marker-end="url(#insulin-arrow)"/>`:''}</g>`).join('')}
      <text x="719" y="482" class="insulin-small">GLUT4 storage vesicles</text>
      ${uptake?slots.slice(0,number).map((x,i)=>move(`M${x} 147L${x} 299`,'#9aefcd',2.2-p.insulin*.8,i*.35,5)).join(''):''}
      ${legend()}`;
  }
  function liver(p) {
    const branches=[[713,300,758,269],[758,269,803,236],[758,269,814,296],[713,300,738,346],[738,346,793,367],[738,346,765,400],[713,300,660,336],[660,336,624,306],[660,336,615,376]];
    return `<text x="45" y="45" class="insulin-kicker">04 / HEPATIC STORAGE &amp; GLUCOSE PRODUCTION</text>
      <text x="58" y="103" class="insulin-small">LIVER</text>
      <path d="M79 180C141 123 264 133 356 153L421 193C415 237 375 287 319 311C267 323 241 350 210 390C168 404 111 370 92 324C74 278 71 221 79 180Z" fill="url(#insulin-organ)" stroke="#b593a7" stroke-width="2"/><path d="M258 153Q228 245 220 339M80 221Q169 231 257 177M237 253Q313 212 390 213" fill="none" stroke="#c2a1b9" stroke-opacity=".3" stroke-width="2"/>
      <path d="M154 319Q193 259 227 281Q266 314 305 265" fill="none" stroke="#8269a4" stroke-width="4" opacity=".45"/>
      <text x="70" y="444">Glucose output ${p.insulin>.3?'↓':'less suppressed'}</text><text x="70" y="472" class="insulin-small">Insulin restrains hepatic production.</text>
      <path d="M384 266H501" class="insulin-leader" stroke-dasharray="4 5"/>
      <ellipse cx="729" cy="279" rx="192" ry="182" fill="url(#insulin-cell)" stroke="#6c989d" stroke-width="2"/><ellipse cx="729" cy="279" rx="183" ry="173" fill="none" stroke="#3d6570"/>
      <text x="637" y="84" class="insulin-small">HEPATOCYTE · CELL DETAIL</text>
      <text x="637" y="151">Glycogen synthesis ${p.insulin>.3?'↑':''}</text>
      <text x="641" y="177" class="insulin-small">A branched glucose reserve</text>
      <g opacity="${.35+p.insulin*.65}">${branches.map(([a,b,c,d])=>`<path d="M${a} ${b}L${c} ${d}" stroke="#9aefcd" stroke-width="2"/>`).join('')}${[[713,300],...branches.map(v=>[v[2],v[3]])].map(([x,y])=>hex(x,y,11)).join('')}</g>
      <rect x="529" y="232" width="22" height="39" rx="8" fill="url(#insulin-channel)"/><path d="M481 251H613" class="insulin-flow" marker-end="url(#insulin-arrow)"/>${move('M479 251L613 251','#9aefcd',2.3,.2,5)}
      <text x="469" y="217" class="insulin-small">GLUT2</text><text x="610" y="487" class="insulin-small">Transport is not GLUT4 recruitment.</text>${legend()}`;
  }
  window.SignalAtlasModules=window.SignalAtlasModules||{};
  window.SignalAtlasModules.insulin={
    id:'insulin',number:'02',title:'How Insulin Works',discipline:'Endocrinology',subtitle:'A molecular message that moves a meal.',accent:'#9aefcd',
    initialState:{glucose:145,currentGlucose:145,response:80,elapsed:0,absorbed:0},steps,sources,
    onEnter(state,step){if(['uptake','feedback'].includes(step.phase)){state.currentGlucose=state.glucose;state.elapsed=0;state.absorbed=0;}},
    onControl(state,id){if(id==='glucose'||id==='response'){state.currentGlucose=Number(state.glucose);state.elapsed=0;state.absorbed=0;}},
    onAction(state,action){if(action==='meal'){state.glucose=170;state.currentGlucose=170;}if(action==='restore'){state.glucose=90;state.currentGlucose=90;}state.elapsed=0;state.absorbed=0;},
    tick(state,dt,step){if(!['uptake','feedback'].includes(step.phase))return false;const p=model(state,step);if(p.glucose<=90.05||p.uptake<.001)return false;const amount=Math.min(p.glucose-90,p.uptake*Math.min(dt,1));state.currentGlucose-=amount;state.absorbed+=amount;state.elapsed+=dt;return true;},
    metrics(state,step){const p=model(state,step);if(step.phase==='sense')return[{label:'Blood glucose',value:Math.round(p.glucose),unit:'mg/dL · model'},{label:'ATP / ADP',value:p.stimulus>.2?'Rising':'Near baseline'},{label:'KATP channels',value:p.stimulus>.2?'Closing':'Open'},{label:'Membrane',value:p.stimulus>.2?'Depolarizing':'Near rest'}];return[{label:'Blood glucose',value:Math.round(p.glucose),unit:'mg/dL · model'},{label:'Insulin signal',value:Math.round(p.insulin*100),unit:'% · model'},{label:step.phase==='liver'?'Storage signal':'Surface GLUT4',value:step.phase==='liver'?Math.round(p.insulin*100):(['circulate','glut4','uptake','feedback'].includes(step.phase)?p.transporters:1),unit:step.phase==='liver'?'% · model':'relative units'},{label:p.live?'Glucose cleared':'Secretion strength',value:p.live?Math.round(state.absorbed):state.response,unit:p.live?'mg/dL · model':'%'}];},
    render(state,step){const p=model(state,step);motionClock=p.live?state.elapsed:0;const content=['meal','circulate','feedback'].includes(step.phase)?overview(p,state,step):['sense','secrete'].includes(step.phase)?betaCell(p,step):step.phase==='liver'?liver(p):membrane(p,step);return `<svg class="insulin-svg" viewBox="0 0 1000 560" role="img" aria-label="${step.stageTitle}. ${step.description}">${defs()}${content}</svg>`;}
  };
}());
