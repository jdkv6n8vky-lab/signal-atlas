(function () {
  "use strict";

  const BASELINE = 95;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const sources = [
    { label: "Zeng et al. · PIEZO channels and the baroreflex · Science, 2018", url: "https://pubmed.ncbi.nlm.nih.gov/30361375/" },
    { label: "Pickering et al. · Cardiac and vascular baroreflex pathways · Journal of Physiology, 2003", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2343224/" },
    { label: "Sved & Tsukamoto · Reflex modulation in the NTS · Brain Research, 1992", url: "https://pubmed.ncbi.nlm.nih.gov/1333342/" }
  ];
  const challenges = {
    type: "actions", label: "Pressure challenge",
    options: [{ action: "low", label: "Low BP" }, { action: "high", label: "High BP" }, { action: "baseline", label: "Baseline" }]
  };
  const strength = {
    type: "range", id: "reflex", label: "Reflex strength", min: 0, max: 100, step: 5, unit: "%",
    hint: "An illustrative control for how strongly autonomic output responds."
  };
  const pressureImpulse = {
    type: "range", id: "challenge", label: "Pressure impulse", min: -35, max: 40, step: 5, unit: "mmHg",
    hint: "Shift pressure relative to the 95 mmHg model baseline."
  };
  const modelNote = "Illustrative short-term model. Values are not measurements or clinical predictions; organs are not drawn to scale.";

  // A one-time pressure impulse decays only when the reflex is active on the
  // effector / feedback slides. This intentionally omits renal and hormonal control.
  function physiology(state) {
    const deviation = state.pressure - BASELINE;
    const gain = state.reflex / 100;
    const sympathetic = clamp(1 - deviation * 0.018 * gain, 0.15, 1.9);
    const vagal = clamp(1 + deviation * 0.018 * gain, 0.15, 1.9);
    const radius = clamp(1 + deviation * 0.0034 * gain, 0.8, 1.2);
    return {
      deviation,
      firing: clamp(1 + deviation * 0.026, 0.1, 2.1),
      stretch: clamp(1 + deviation * 0.006, 0.7, 1.3),
      sympathetic, vagal, radius,
      resistance: 1 / Math.pow(radius, 4),
      heartRate: Math.round(72 - deviation * 0.58 * gain),
      output: clamp(5 - deviation * 0.042 * gain, 3, 7)
    };
  }

  function impulse(state, pressure) {
    state.pressure = pressure;
    state.challenge = pressure - BASELINE;
    state.elapsed = 0;
    state.trace = [pressure];
    state.started = true;
  }

  const steps = [
    {
      title: "A pressure worth protecting", phase: "system",
      description: "Blood pressure drives flow to tissues. The heart supplies flow, while small arteries and arterioles provide adjustable resistance. A fast neural feedback circuit buffers sudden changes in arterial pressure.",
      stageTitle: "The circulation, in balance", stageSubtitle: "A fast feedback circuit · seconds to act",
      context: { title: "Two adjustable levers", body: "Mean arterial pressure is approximately cardiac output × systemic vascular resistance, assuming central venous pressure is small. The reflex can change both." },
      controls: [challenges], note: modelNote
    },
    {
      title: "Disturb the balance", phase: "disturbance",
      description: "A sudden pressure rise stretches arterial walls more. A pressure fall stretches them less. Choose a direction and compare it with baseline; we will follow the reflex one link at a time.",
      stageTitle: "A change in arterial pressure", stageSubtitle: "Try High BP, Low BP, or a pressure impulse",
      controls: [challenges, pressureImpulse],
      context: { title: "The disturbance comes first", body: "Standing up can briefly reduce venous return and pressure. Other disturbances can raise pressure. This model injects a pressure change and holds it while you inspect the early steps." }, note: modelNote
    },
    {
      title: "Stretch becomes information", phase: "sensors",
      description: "Baroreceptors are stretch-sensitive nerve endings in the carotid sinus and aortic arch. More wall stretch generally increases their firing. Less stretch reduces firing; it does not switch the whole system off.",
      stageTitle: "Mechanical stretch → electrical signal", stageSubtitle: "Carotid sinus + aortic arch · two sensing sites",
      controls: [challenges, pressureImpulse],
      context: { title: "A mechanical sensor", body: "These receptors sense arterial-wall deformation. Mechanically activated ion channels help convert that deformation into nerve activity. The expanded artery is a schematic view of the sensing wall." }, note: modelNote
    },
    {
      title: "A message to the medulla", phase: "afferent",
      description: "Carotid sinus signals travel through the glossopharyngeal nerve (IX); aortic arch signals travel through the vagus nerve (X). Both reach the nucleus tractus solitarius, or NTS, in the medulla.",
      stageTitle: "The sensory side of the circuit", stageSubtitle: "Afferent = carrying information toward the brainstem",
      controls: [challenges],
      context: { title: "Frequency carries the message", body: "The cyan pulses represent nerve impulses. Higher pressure increases the rate of sensory signaling in this simplified view; real baroreceptor firing also follows the arterial pulse." }, note: modelNote
    },
    {
      title: "The brainstem integrates", phase: "medulla",
      description: "The NTS relays sensory input through medullary circuits. More baroreceptor input inhibits sympathetic output and promotes cardiac vagal output. With less input, sympathetic activity rises and vagal influence falls.",
      stageTitle: "One input, coordinated outputs", stageSubtitle: "Medullary circuits integrate sensory information",
      controls: [challenges],
      context: { title: "A circuit, not a conscious decision", body: "NTS projections recruit inhibitory pathways that reduce sympathetic drive and activate cardiac vagal neurons. The two output branches are drawn separately because their effects differ." }, note: modelNote
    },
    {
      title: "Turn the autonomic dials", phase: "autonomic",
      description: "After a pressure rise, stronger vagal influence slows the heart. Reduced sympathetic activity also lowers heart rate and contractility, and relaxes resistance vessels. A pressure fall produces the opposite pattern.",
      stageTitle: "Heart and vessels receive different messages", stageSubtitle: "Mint: cardiac vagal pathway · violet: sympathetic pathway",
      controls: [challenges, strength],
      context: { title: "Why vessels dilate", body: "Most systemic arterioles dilate here because sympathetic vasoconstrictor tone decreases. The vagus mainly acts on the heart; this diagram does not imply general vagal dilation of blood vessels." }, note: modelNote
    },
    {
      title: "The effectors push back", phase: "effectors",
      description: "The heart changes rate and pumping strength. Arterioles change resistance. Together they oppose the original disturbance. Press High BP or Low BP, then watch mean pressure move toward the model baseline.",
      stageTitle: "The response unfolds in real time", stageSubtitle: "Apply a challenge · compare strong and weak reflexes",
      controls: [challenges, strength],
      context: { title: "A response with the opposite sign", body: "High pressure triggers lower cardiac output and resistance. Low pressure triggers higher output and resistance. In this illustrative model, a stronger reflex corrects the same impulse more quickly." }, note: modelNote
    },
    {
      title: "Close the feedback loop", phase: "loop",
      description: "As pressure recovers, the change in baroreceptor firing shrinks, so the corrective drive fades. This is negative feedback: the response opposes the disturbance. Try a zero-strength reflex to see what the neural correction contributes.",
      stageTitle: "Negative feedback, connected", stageSubtitle: "Detect → transmit → integrate → respond → correct",
      controls: [challenges, strength],
      context: { title: "Fast buffering has limits", body: "The baroreflex helps stabilize pressure over short intervals. It is not the entire blood-pressure control system: blood volume, kidneys, hormones, local control, and reflex resetting also matter." }, note: modelNote
    },
    {
      title: "The working vocabulary", type: "glossary", stageTitle: "Eight terms. One connected system.",
      description: "Keep the sensor, the signal, and the response distinct.",
      terms: [
        { term: "Mean arterial pressure", definition: "The time-averaged pressure in an artery over a cardiac cycle; abbreviated MAP." },
        { term: "Baroreceptor", definition: "A sensory nerve ending that responds to mechanical stretch of a vessel wall." },
        { term: "Carotid sinus", definition: "A widened region near the start of the internal carotid artery containing arterial baroreceptors." },
        { term: "Afferent signal", definition: "Information traveling from a peripheral sensor toward the central nervous system." },
        { term: "NTS", definition: "Nucleus tractus solitarius: the medullary region receiving major baroreceptor inputs." },
        { term: "Cardiac output", definition: "The volume pumped by the heart each minute: heart rate × stroke volume." },
        { term: "Vascular resistance", definition: "Opposition to blood flow; systemic arterioles are a major adjustable source." },
        { term: "Negative feedback", definition: "A control process whose response reduces the original deviation." }
      ]
    },
    {
      title: "Beyond the simplified circuit", type: "facts", stageTitle: "A small circuit with a large job",
      description: "Experiments reveal both the sensor and the flexibility of the reflex.",
      facts: [
        { title: "A channel can sense a force", body: "In a 2018 mouse study, removing both Piezo1 and Piezo2 from relevant sensory neurons abolished the tested baroreflex. These channels link mechanical forces to electrical signals." },
        { title: "The brainstem changes the gain", body: "Experiments in the NTS show that local neurotransmitter signaling can alter reflex strength. The pathway is regulated, rather than being a fixed wire from artery to heart." },
        { title: "Heart and vessel responses can diverge", body: "A rat study found that nociceptive input attenuated the cardiac parasympathetic component without suppressing the sympathetic component in the same way. The two branches can be modulated differently." },
        { title: "This is a deliberately small model", body: "The simulator isolates a brief pressure impulse and its neural correction. It leaves out blood loss, drugs, disease, kidney responses, and long-term adaptation; its numbers are teaching values." }
      ], sources
    },
    {
      title: "Checkpoint 01 · The sensor", type: "quiz", stageTitle: "Read the disturbance",
      description: "Start at the arterial wall.",
      quiz: {
        question: "Arterial pressure suddenly rises. What is the expected immediate baroreceptor response?",
        options: ["Less wall stretch and fewer impulses", "More wall stretch and more sensory firing", "Direct secretion of insulin", "No change until the kidneys respond"], correct: 1,
        explanation: "Higher arterial pressure stretches the wall more, generally increasing baroreceptor firing. The sensory signal begins the rapid neural reflex."
      }
    },
    {
      title: "Checkpoint 02 · The pathway", type: "quiz", stageTitle: "Follow the message",
      description: "Match the sensor to its first central destination.",
      quiz: {
        question: "Where do carotid sinus and aortic arch baroreceptor signals mainly converge?",
        options: ["The liver", "The motor cortex", "The NTS in the medulla", "The sinoatrial node directly"], correct: 2,
        explanation: "Carotid sinus afferents travel through nerve IX and aortic arch afferents through nerve X. They converge in the nucleus tractus solitarius in the medulla."
      }
    },
    {
      title: "Checkpoint 03 · The response", type: "quiz", stageTitle: "Choose the corrective direction",
      description: "Apply the mechanism to a fall in pressure.",
      quiz: {
        question: "Which combination helps oppose a sudden fall in arterial pressure?",
        options: ["Lower sympathetic activity and a slower heart", "Higher vagal influence and widespread vagal vasodilation", "A slower heart and relaxed arterioles", "Higher sympathetic activity, faster heart rate, and vasoconstriction"], correct: 3,
        explanation: "Less baroreceptor input permits greater sympathetic output and reduces vagal influence. Heart rate and contractility rise, and arteriolar constriction increases resistance."
      }
    },
    {
      title: "Checkpoint 04 · The loop", type: "quiz", stageTitle: "Explain the feedback",
      description: "Look at the direction of cause and response.",
      quiz: {
        question: "Why is the baroreceptor reflex described as negative feedback?",
        options: ["Its response opposes the original pressure change", "It always decreases pressure", "It shuts all nerve signaling off", "It completely determines long-term pressure"], correct: 0,
        explanation: "The reflex lowers pressure after a rise and supports pressure after a fall. As the deviation becomes smaller, the corrective signal also diminishes. Other systems contribute to long-term regulation."
      }
    }
  ];

  function pulsePath(path, color, duration, count, elapsed, opacity) {
    return `<g opacity="${opacity}"><path d="${path}" fill="none" stroke="${color}" stroke-width="2" opacity=".24"/>${Array.from({ length: count }, (_, i) => `<circle r="3.4" fill="${color}" class="pressure-nerve-pulse"><animateMotion dur="${duration.toFixed(2)}s" begin="${(-i * duration / count - elapsed).toFixed(2)}s" path="${path}" repeatCount="indefinite"/></circle>`).join("")}</g>`;
  }

  function brain(phase, p) {
    const active = ["afferent", "medulla", "autonomic", "loop"].includes(phase);
    const bars = (value, color, y) => Array.from({ length: 9 }, (_, i) => `<rect x="${817 + i * 12}" y="${y}" width="7" height="11" rx="2" fill="${color}" opacity="${i < Math.round(value * 4.5) ? 0.9 : 0.12}"/>`).join("");
    return `<g class="pressure-brain" opacity="${active ? 1 : 0.55}">
      <text x="793" y="46" class="pressure-label">Medulla</text><text x="793" y="68" class="pressure-small">Brainstem control</text>
      <path d="M819 91 C813 81 801 87 790 98 C772 116 777 141 786 157 C795 174 813 178 820 196 L838 207 L861 207 C862 184 882 176 891 157 C901 137 896 108 875 95 C861 86 839 84 819 91Z" fill="url(#pressure-brain-fill)" stroke="#918cbd" stroke-opacity=".55" stroke-width="1.6"/>
      <path d="M810 101 C830 114 815 146 834 164 L847 191 M862 104 C843 127 862 150 846 167" fill="none" stroke="#a99cdd" opacity=".34" stroke-width="2"/>
      <ellipse cx="819" cy="133" rx="24" ry="21" fill="#67d8f0" fill-opacity=".12" stroke="#67d8f0" stroke-opacity="${active ? 0.9 : 0.3}"/><text x="819" y="139" text-anchor="middle" class="pressure-nts">NTS</text>
      <circle cx="860" cy="164" r="7" fill="#b2a4fc"/><circle cx="807" cy="166" r="7" fill="#9aefcd"/>
      <path d="M822 153 L808 163 M838 146 L858 160" stroke="#b9bfd2" stroke-width="1.4" fill="none" opacity=".7"/>
      ${["medulla", "autonomic", "loop"].includes(phase) ? `<g><text x="804" y="232" class="pressure-small" fill="#9aefcd">Vagal</text>${bars(p.vagal, "#9aefcd", 242)}<text x="804" y="277" class="pressure-small" fill="#b2a4fc">Sympathetic</text>${bars(p.sympathetic, "#b2a4fc", 287)}</g>` : ""}
    </g>`;
  }

  function heart(phase, p, elapsed) {
    const beat = 60 / p.heartRate;
    return `<g class="pressure-heart-wrap">
      <path d="M211 209 L210 151 C208 97 275 91 288 137 L306 256" fill="none" stroke="#3d1927" stroke-width="51"/>
      <path d="M211 209 L210 151 C208 97 275 91 288 137 L306 256" fill="none" stroke="url(#pressure-aorta)" stroke-width="41"/>
      <path d="M219 117 L220 83 M245 112 L249 75 M266 120 L280 87" fill="none" stroke="#864051" stroke-width="14" stroke-linecap="round"/>
      <path d="M249 79 L249 61 M280 87 L289 70" stroke="#d27688" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>
      <g class="pressure-heart" style="--pressure-beat:${beat.toFixed(3)}s;animation-delay:-${(elapsed % beat).toFixed(3)}s">
        <path d="M123 211 C104 177 92 154 112 129 L138 137 C127 155 141 174 156 190" fill="url(#pressure-vein)" stroke="#558098" stroke-opacity=".7" stroke-width="1.5"/>
        <path d="M179 206 C173 164 150 139 164 120 L186 127 C184 148 207 169 218 184" fill="url(#pressure-vein)" stroke="#6b99a6" stroke-opacity=".55" stroke-width="1.5"/>
        <path d="M190 183 C221 157 250 169 264 197 C284 235 283 282 263 324 C244 364 213 400 194 403 C176 406 138 375 119 343 C90 304 79 267 92 230 C103 198 140 179 165 191 C175 178 180 179 190 183Z" fill="url(#pressure-myocardium)" stroke="#c37585" stroke-opacity=".7" stroke-width="1.7"/>
        <path d="M171 211 C204 236 222 291 194 393 C165 376 140 343 130 305 C118 270 135 226 171 211Z" fill="#341f31" fill-opacity=".48" stroke="#bd6478" stroke-opacity=".28"/>
        <path d="M203 197 C229 188 256 218 260 249 C267 305 227 368 204 388 C224 332 221 270 192 220Z" fill="url(#pressure-ventricle)"/>
        <path d="M104 218 C120 201 146 199 165 210 C151 225 140 244 139 263 C109 265 95 244 104 218Z" fill="#bd6077" fill-opacity=".38"/>
        <path d="M113 290 C144 317 157 351 169 374 M135 240 C142 259 158 270 184 279 M200 219 C223 234 243 237 262 235" fill="none" stroke="#d18793" stroke-opacity=".17" stroke-width="3"/>
        <path d="M184 213 C170 242 169 264 184 290 C198 315 192 354 192 384 M180 277 C157 288 144 291 132 308 M184 294 C209 286 232 295 242 306 M173 249 C197 251 223 252 239 242" fill="none" stroke="#502137" stroke-width="7" stroke-linecap="round"/>
        <path d="M184 213 C170 242 169 264 184 290 C198 315 192 354 192 384 M180 277 C157 288 144 291 132 308 M184 294 C209 286 232 295 242 306 M173 249 C197 251 223 252 239 242" fill="none" stroke="#d4868c" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M106 215 C123 197 146 191 161 199" stroke="#efbec1" stroke-opacity=".32" fill="none" stroke-width="4" stroke-linecap="round"/>
        <ellipse cx="156" cy="214" rx="5" ry="7" fill="#9aefcd" opacity="${["autonomic", "effectors", "loop"].includes(phase) ? 0.95 : 0.35}"/>
      </g>
      <text x="81" y="437" class="pressure-label">Heart</text><text x="155" y="437" class="pressure-value" fill="#ed8195">${p.heartRate}<tspan class="pressure-small" fill="#92a4b6"> bpm</tspan></text>
    </g>`;
  }

  function vessel(phase, p, elapsed) {
    const mid = 274;
    const half = 29 * p.stretch;
    const top = mid - half;
    const bottom = mid + half;
    const sensorActive = ["sensors", "afferent", "medulla", "loop"].includes(phase);
    const rbcDuration = clamp(6.8 / (p.output / 5), 3.5, 9);
    return `<g class="pressure-vessel">
      <defs><clipPath id="pressure-lumen-clip"><rect x="308" y="${top + 4}" width="419" height="${half * 2 - 8}" rx="5"/></clipPath></defs>
      <path d="M296 ${top - 9} Q505 ${top - 13} 735 ${top - 9} L735 ${bottom + 9} Q511 ${bottom + 13} 296 ${bottom + 9}Z" fill="url(#pressure-wall)" stroke="#aa5e73" stroke-opacity=".7" stroke-width="1.5"/>
      <path d="M302 ${top} Q511 ${top - 4} 738 ${top} L738 ${bottom} Q511 ${bottom + 4} 302 ${bottom}Z" fill="url(#pressure-blood)"/>
      <path d="M310 ${top + 2} L721 ${top + 2} M310 ${bottom - 2} L721 ${bottom - 2}" stroke="#e88b9a" stroke-opacity=".4" stroke-width="1.5"/>
      <ellipse cx="736" cy="274" rx="15" ry="${half + 9}" fill="#462635" stroke="#ab697c" stroke-opacity=".7"/><ellipse cx="736" cy="274" rx="9" ry="${half}" fill="#210f1c" stroke="#ba7182" stroke-opacity=".5"/>
      <g clip-path="url(#pressure-lumen-clip)">${Array.from({ length: 10 }, (_, i) => {
        const lane = mid + ((i % 3) - 1) * half * 0.48;
        return `<g class="pressure-rbc"><animateMotion path="M295 ${lane} L770 ${lane}" dur="${rbcDuration.toFixed(2)}s" begin="${(-i * rbcDuration / 10 - elapsed).toFixed(2)}s" repeatCount="indefinite"/><g transform="rotate(${(i % 4) * 18 - 23}) scale(${i % 3 === 0 ? 0.75 : 0.9})"><use href="#pressure-rbc-cell"/></g></g>`;
      }).join("")}</g>
      <g opacity="${sensorActive ? 1 : 0.38}" stroke="#67d8f0" fill="none" stroke-linecap="round">
        <path d="M443 ${top - 3} Q426 ${top - 22} 438 ${top - 32} Q455 ${top - 35} 449 ${top - 15} M463 ${top - 4} Q477 ${top - 26} 466 ${top - 32} M440 ${top - 19} L473 ${top - 20}" stroke-width="2.3"/>
        ${sensorActive ? `<ellipse cx="453" cy="${top - 18}" rx="38" ry="27" stroke-opacity=".25" stroke-dasharray="3 5"/><path d="M478 ${top - 26} L514 185" stroke-opacity=".4"/>` : ""}
      </g>
      <text x="519" y="177" class="pressure-label" fill="${sensorActive ? "#9ee7f6" : "#91a4b5"}">${sensorActive ? "Stretch sensor" : "Arterial circulation"}</text>
      <text x="519" y="199" class="pressure-small">${sensorActive ? (p.firing > 1.05 ? "More stretch · more firing" : p.firing < 0.95 ? "Less stretch · less firing" : "Baseline sensory activity") : "Red cells carried with blood flow"}</text>
      <text x="315" y="355" class="pressure-small">${phase === "sensors" ? "Expanded view of a sensing vessel wall" : "Large artery · pressure distends the wall"}</text>
      ${phase === "disturbance" || phase === "sensors" ? `<g stroke="${p.deviation >= 0 ? "#ed8195" : "#67d8f0"}" stroke-width="1.5" fill="none"><path d="${p.deviation >= 0 ? `M601 ${top - 11} v-19 m-5 6 5-6 5 6 M601 ${bottom + 11} v19 m-5-6 5 6 5-6` : `M601 ${top - 30} v19 m-5-6 5 6 5-6 M601 ${bottom + 30} v-19 m-5 6 5-6 5 6`}"/></g>` : ""}
    </g>`;
  }

  function gauge(state) {
    const angle = (-132 + (clamp(state.pressure, 55, 145) - 55) / 90 * 264) * Math.PI / 180;
    const cx = 859, cy = 399, r = 45;
    const nx = cx + Math.sin(angle) * r;
    const ny = cy - Math.cos(angle) * r;
    const stroke = Math.abs(state.pressure - BASELINE) > 13 ? "#ed8195" : "#9aefcd";
    const ticks = Array.from({ length: 17 }, (_, i) => {
      const a = (-132 + i * 264 / 16) * Math.PI / 180;
      return `<line x1="${cx + Math.sin(a) * 49}" y1="${cy - Math.cos(a) * 49}" x2="${cx + Math.sin(a) * (i % 4 === 0 ? 55 : 52)}" y2="${cy - Math.cos(a) * (i % 4 === 0 ? 55 : 52)}" stroke="#698195" stroke-opacity="${i % 4 === 0 ? 0.9 : 0.4}"/>`;
    }).join("");
    return `<g class="pressure-gauge"><circle cx="859" cy="399" r="61" fill="#0c1722" stroke="#304252"/><circle cx="859" cy="399" r="56" fill="none" stroke="#1f3443"/>${ticks}<path d="M${cx} ${cy} L${nx.toFixed(1)} ${ny.toFixed(1)}" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round"/><circle cx="859" cy="399" r="4" fill="${stroke}"/><text x="859" y="429" text-anchor="middle" class="pressure-gauge-number">${Math.round(state.pressure)}<tspan class="pressure-tiny" fill="#92a4b6"> mmHg</tspan></text><text x="859" y="323" text-anchor="middle" class="pressure-small">Mean pressure</text></g>`;
  }

  function trace(state, phase) {
    const points = state.trace || [state.pressure];
    const width = 365;
    const d = points.map((value, i) => `${i === 0 ? "M" : "L"}${340 + i / Math.max(1, points.length - 1) * width} ${432 - (value - 60) / 80 * 34}`).join(" ");
    return `<g class="pressure-trace"><text x="337" y="380" class="pressure-small">${["effectors", "loop"].includes(phase) ? "PRESSURE RESPONSE" : "MODEL BASELINE"}</text><line x1="338" y1="417.1" x2="715" y2="417.1" stroke="#9aefcd" stroke-opacity=".25" stroke-dasharray="4 5"/><text x="722" y="422" class="pressure-tiny" fill="#9aefcd">95</text><path d="${d}" fill="none" stroke="#67d8f0" stroke-width="2" stroke-linecap="round"/><text x="337" y="456" class="pressure-small">${["effectors", "loop"].includes(phase) ? `${state.elapsed.toFixed(1)} s since challenge` : "95 mmHg · reference for this simulation"}</text></g>`;
  }

  function footer(phase, p) {
    if (phase === "loop") {
      return `<g class="pressure-feedback">${[["Detect", "stretch"], ["Send nerve", "signal"], ["Brainstem", "decides"], ["Heart / vessels", "respond"], ["Pressure", "corrected"]].map((lines, i) => {
        const x = 34 + i * 189;
        return `<g><rect x="${x}" y="486" width="176" height="56" rx="8" fill="#12312b" stroke="#3a7260" stroke-opacity=".7"/><text x="${x + 88}" y="508" text-anchor="middle" class="pressure-loop-label">${lines[0]}</text><text x="${x + 88}" y="530" text-anchor="middle" class="pressure-loop-label">${lines[1]}</text>${i < 4 ? `<path d="M${x + 180} 514 h5 m-2-3 3 3-3 3" fill="none" stroke="#76af98"/>` : ""}</g>`;
      }).join("")}</g>`;
    }
    if (["autonomic", "effectors"].includes(phase)) {
      const radius = 20 * p.radius;
      return `<g class="pressure-effectors"><line x1="34" y1="480" x2="966" y2="480" stroke="#203442"/><circle cx="68" cy="517" r="29" fill="#3d273f" stroke="#796b90"/><circle cx="68" cy="517" r="${radius}" fill="#181729" stroke="#b2a4fc" stroke-width="2"/><text x="111" y="510" class="pressure-label">Resistance arteriole</text><text x="111" y="535" class="pressure-small">${p.radius > 1.025 ? "Less sympathetic tone → wider lumen" : p.radius < 0.975 ? "More sympathetic tone → narrower lumen" : "Baseline vasoconstrictor tone"}</text><text x="530" y="510" class="pressure-label">${p.resistance.toFixed(2)}× resistance</text><text x="530" y="535" class="pressure-small">Radius controls resistance</text><text x="790" y="510" class="pressure-label">${p.output.toFixed(1)} L/min</text><text x="790" y="535" class="pressure-small">Model cardiac output</text></g>`;
    }
    return `<g class="pressure-legend"><line x1="34" y1="480" x2="966" y2="480" stroke="#203442"/><circle cx="49" cy="516" r="4" fill="#67d8f0"/><text x="64" y="522" class="pressure-small">Sensory signal</text><circle cx="287" cy="516" r="4" fill="#9aefcd"/><text x="302" y="522" class="pressure-small">Cardiac vagal output</text><circle cx="590" cy="516" r="4" fill="#b2a4fc"/><text x="605" y="522" class="pressure-small">Sympathetic output</text><text x="945" y="522" text-anchor="end" class="pressure-tiny">SCHEMATIC</text></g>`;
  }

  function render(state, step) {
    const phase = step.phase || "system";
    const p = physiology(state);
    const sensoryActive = ["sensors", "afferent", "medulla", "autonomic", "effectors", "loop"].includes(phase);
    const outputActive = ["medulla", "autonomic", "effectors", "loop"].includes(phase);
    const sensoryPath = `M461 ${(274 - 29 * p.stretch - 20).toFixed(1)} C495 105 664 127 792 133`;
    const vagalPath = "M807 166 C755 91 590 48 417 70 C310 82 209 132 156 214";
    const sympatheticPath = "M861 164 C951 171 970 247 946 307";
    const sympatheticHeart = "M946 307 C990 350 988 462 944 470 H320 Q277 461 214 369";
    const nerveDuration = clamp(2.8 / p.firing, 1.1, 8);
    return `<svg class="pressure-scene pressure-phase-${phase}" viewBox="0 0 1000 560" role="img" aria-label="Baroreceptor reflex: anatomical heart, artery with red blood cells and a stretch sensor, sensory nerves to the medulla, autonomic signals and mean arterial pressure gauge. Pressure is ${Math.round(state.pressure)} millimeters of mercury.">
      <defs>
        <radialGradient id="pressure-myocardium" cx="40%" cy="24%" r="80%"><stop stop-color="#b36279"/><stop offset=".37" stop-color="#783d56"/><stop offset=".75" stop-color="#422b41"/><stop offset="1" stop-color="#251c2d"/></radialGradient>
        <linearGradient id="pressure-ventricle" x1="0" x2="1" y2="1"><stop stop-color="#da8e9a" stop-opacity=".42"/><stop offset=".5" stop-color="#753950" stop-opacity=".28"/><stop offset="1" stop-color="#2c2239" stop-opacity=".8"/></linearGradient>
        <linearGradient id="pressure-aorta"><stop stop-color="#713749"/><stop offset=".5" stop-color="#b66679"/><stop offset="1" stop-color="#623047"/></linearGradient>
        <linearGradient id="pressure-vein"><stop stop-color="#38586c"/><stop offset=".5" stop-color="#72a2ab"/><stop offset="1" stop-color="#2a405c"/></linearGradient>
        <linearGradient id="pressure-wall" x1="0" x2="0" y2="1"><stop stop-color="#744453"/><stop offset=".15" stop-color="#422535"/><stop offset=".7" stop-color="#2e1b2a"/><stop offset="1" stop-color="#8f5368"/></linearGradient>
        <linearGradient id="pressure-blood" x1="0" x2="0" y2="1"><stop stop-color="#200f1d"/><stop offset=".5" stop-color="#481d31"/><stop offset="1" stop-color="#241421"/></linearGradient>
        <radialGradient id="pressure-rbc-fill"><stop stop-color="#601e37"/><stop offset=".38" stop-color="#8e2948"/><stop offset=".67" stop-color="#ed7892"/><stop offset=".84" stop-color="#be4665"/><stop offset="1" stop-color="#642139"/></radialGradient>
        <linearGradient id="pressure-brain-fill" x1="0" x2="1" y2="1"><stop stop-color="#524362"/><stop offset=".45" stop-color="#302d49"/><stop offset="1" stop-color="#191f34"/></linearGradient>
        <g id="pressure-rbc-cell"><ellipse rx="19" ry="12" fill="url(#pressure-rbc-fill)" stroke="#f295a8" stroke-opacity=".5" stroke-width=".8"/><ellipse rx="7" ry="3.4" fill="#671e39" fill-opacity=".66"/><path d="M-13-6 Q-1-12 12-5" fill="none" stroke="#ffd0d8" stroke-opacity=".3" stroke-width="1.5" stroke-linecap="round"/></g>
      </defs>
      <circle cx="191" cy="271" r="168" fill="#6c2b45" fill-opacity=".028"/>
      ${heart(phase, p, state.elapsed)}
      ${pulsePath(vagalPath, "#9aefcd", clamp(3.7 / p.vagal, 1.5, 8), Math.max(1, Math.round(p.vagal * 4)), state.elapsed, outputActive ? 0.8 : 0.1)}
      ${pulsePath(sympatheticPath, "#b2a4fc", clamp(2.5 / p.sympathetic, 1.3, 7), Math.max(1, Math.round(p.sympathetic * 3)), state.elapsed, outputActive ? 0.85 : 0.1)}
      ${outputActive ? `<path d="${sympatheticHeart}" fill="none" stroke="#b2a4fc" stroke-opacity=".3" stroke-width="1.5" stroke-dasharray="3 6"/>` : ""}
      ${vessel(phase, p, state.elapsed)}
      ${pulsePath(sensoryPath, "#67d8f0", nerveDuration, Math.max(2, Math.round(p.firing * 6)), state.elapsed, sensoryActive ? 0.95 : 0.2)}
      ${phase === "sensors" ? `<g><circle cx="254" cy="120" r="21" fill="none" stroke="#67d8f0" stroke-width="1.5" stroke-dasharray="3 5"/><path d="M275 119 L324 118" stroke="#67d8f0" stroke-opacity=".5"/><text x="334" y="122" class="pressure-small">Aortic arch</text><path d="M249 65 L325 43" stroke="#67d8f0" stroke-opacity=".5"/><text x="334" y="47" class="pressure-small">To carotid sinus</text></g>` : ""}
      ${phase === "afferent" ? `<g><text x="472" y="49" class="pressure-label" fill="#67d8f0">Afferent nerve traffic</text><text x="472" y="73" class="pressure-small">IX · carotid sinus / X · aortic arch</text></g>` : ""}
      ${phase === "disturbance" ? `<g><text x="402" y="64" class="pressure-challenge" fill="${p.deviation > 0 ? "#ed8195" : "#67d8f0"}">${p.deviation > 0 ? "+" : ""}${Math.round(p.deviation)}<tspan class="pressure-small"> mmHg</tspan></text><text x="402" y="88" class="pressure-small">from the model baseline</text></g>` : ""}
      ${brain(phase, p)}
      ${gauge(state)}
      ${trace(state, phase)}
      ${footer(phase, p)}
    </svg>`;
  }

  window.SignalAtlasModules = window.SignalAtlasModules || {};
  window.SignalAtlasModules.pressure = {
    id: "pressure", number: "04", title: "Blood Pressure Regulation", discipline: "PHYSIOLOGY",
    subtitle: "The reflex that keeps pressure in balance.", accent: "#9aefcd",
    initialState: { pressure: BASELINE, challenge: 0, reflex: 80, elapsed: 0, started: false, trace: [BASELINE] },
    steps, sources, render,
    onEnter(state, step) {
      if (step.phase === "disturbance" && !state.started) impulse(state, 130);
      if (["effectors", "loop"].includes(step.phase) && Math.abs(state.pressure - BASELINE) < 1) impulse(state, 130);
    },
    onControl(state, id, value) {
      if (id === "challenge") impulse(state, BASELINE + Number(value));
      if (id === "reflex") state.reflex = Number(value);
    },
    onAction(state, action) {
      if (action === "high") impulse(state, 130);
      if (action === "low") impulse(state, 65);
      if (action === "baseline") impulse(state, BASELINE);
    },
    metrics(state, step) {
      const p = physiology(state);
      if (step.phase === "autonomic" || step.phase === "medulla") {
        return [
          { label: "Mean pressure", value: Math.round(state.pressure), unit: "mmHg" },
          { label: "Sensor firing", value: p.firing.toFixed(2), unit: "× baseline" },
          { label: "Sympathetic", value: p.sympathetic.toFixed(2), unit: "× baseline" },
          { label: "Vagal influence", value: p.vagal.toFixed(2), unit: "× baseline" }
        ];
      }
      return [
        { label: "Mean pressure", value: Math.round(state.pressure), unit: "mmHg" },
        { label: "Sensor firing", value: p.firing.toFixed(2), unit: "× baseline" },
        { label: "Heart rate", value: p.heartRate, unit: "bpm" },
        { label: "Resistance", value: p.resistance.toFixed(2), unit: "× baseline" }
      ];
    },
    tick(state, dt, step) {
      if (!["effectors", "loop"].includes(step.phase)) return false;
      if (Math.abs(state.pressure - BASELINE) < 0.05 || state.reflex === 0) return false;
      const seconds = clamp(dt, 0, 0.5);
      state.elapsed += seconds;
      state.pressure = BASELINE + (state.pressure - BASELINE) * Math.exp(-0.29 * state.reflex / 100 * seconds);
      state.trace.push(state.pressure);
      if (state.trace.length > 110) state.trace.shift();
      return true;
    }
  };
}());
