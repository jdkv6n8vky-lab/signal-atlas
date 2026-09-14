/* CRISPR-Cas9: artificial teaching sequences, never a laboratory design tool. */
(function () {
  'use strict';
  const sequence = 'GACTGACCTAGGATCGTACA';
  const complement = base => ({A:'T',T:'A',G:'C',C:'G'})[base];
  const candidates = {
    A: {sequence:'GACTCACCTAGGATCGAACA',pam:'AGG'},
    B: {sequence,pam:'AGG'},
    C: {sequence,pam:'AAA'}
  };
  const selectTarget = {type:'choices',id:'target',label:'Choose a DNA target',options:['A','B','C'].map(value=>({value,label:'Target '+value})),hint:'Compare both the 20-base sequence and its neighboring PAM.'};
  const repairControl = {type:'choices',id:'repair',label:'Explore a repair pathway',options:[{value:'NHEJ',label:'NHEJ'},{value:'HDR',label:'HDR'}],hint:'A teaching comparison. Cells do not obey a repair-pathway switch.'};
  const sources = [
    {label:'Jinek et al. · RNA-programmable DNA cleavage · Science, 2012',url:'https://doi.org/10.1126/science.1225829'},
    {label:'NHGRI · How genome editing works',url:'https://www.genome.gov/about-genomics/policy-issues/Genome-Editing/How-genome-editing-works'},
    {label:'National Academies · The basic science of genome editing',url:'https://www.ncbi.nlm.nih.gov/books/NBK447276/'},
    {label:'Repair outcomes after CRISPR cleavage · 2021',url:'https://pubmed.ncbi.nlm.nih.gov/34203807/'}
  ];
  const mechanism = (title,phase,description,stageTitle,body,controls=[]) => ({title,phase,description,stageTitle,stageSubtitle:'SpCas9 · artificial teaching sequence',context:{title:'Follow the molecular logic',body},controls,note:'Simplified SpCas9 model. Artificial sequence; not a guide-design or laboratory tool.'});
  const quiz = (title,question,options,correct,explanation) => ({title,type:'quiz',description:'Choose an answer, then connect it to the mechanism.',quiz:{question,options,correct,explanation}});
  const steps = [
    mechanism('A molecular address','dna','DNA stores information in a sequence of four bases. Editing begins by identifying a location in that sequence. Unwind the helix into a readable ladder and follow a short, artificial DNA segment.','A sequence, not just a shape','DNA strands are antiparallel. A pairs with T, and G pairs with C. The displayed letters are an invented teaching example.'),
    mechanism('Give Cas9 a guide','guide','A guide RNA contains a targeting segment and a scaffold that binds Cas9. Its targeting segment can base-pair with one DNA strand, directing the complex toward a compatible site.','The address is written in RNA','The guide uses U instead of T. Its sequence matches the displayed non-target DNA strand, with U replacing T, and pairs with the complementary target strand.'),
    mechanism('Three possible destinations','targets','A DNA match alone is not enough for SpCas9. A neighboring PAM, commonly NGG, is also needed. Compare three candidates and find the one with both a fully matching sequence and a compatible PAM.','Find the matching address','Target A has two guide mismatches. Target C lacks the required NGG PAM. Target B satisfies both rules in this simplified example.',[selectTarget]),
    mechanism('Check the base pairs','match','The complex samples DNA near a PAM and tests pairing with its guide. Choose a target and inspect the mismatches. Correct pairing helps stabilize the RNA–DNA hybrid.','Complementarity meets the PAM','Highlighted bases reveal mismatches. Real recognition depends on mismatch position and other conditions; imperfect matches are not guaranteed to be rejected.',[selectTarget]),
    mechanism('Form the editing complex','bind','We now follow Target B so the later steps stay coherent. Cas9 separates the strands locally. The guide pairs with the target strand, while the other DNA strand is displaced to form an R-loop.','Target B is locked in','The RNA–DNA hybrid and compatible PAM help stabilize a cleavage-capable configuration. The protein is shown as a translucent envelope around the strands.'),
    mechanism('Cut both DNA strands','cut','Cas9 has two nuclease domains that cut opposite DNA strands. For this SpCas9 example, the double-strand break is shown about three bases upstream of the PAM.','Recognition → double-strand break','The cut is a break in the DNA backbone. Cas9 does not directly write the desired replacement sequence; the cell’s repair machinery determines what follows.'),
    mechanism('The cell takes over','repair','A DNA break recruits repair machinery. End joining can reconnect the ends without a supplied template. Homology-directed repair can copy information from a suitable donor template.','One break. Different repair routes.','Select NHEJ or HDR to compare their logic. These are simplified pathways: real cells can use other repair routes, and outcomes depend on cell state and sequence.',[repairControl]),
    mechanism('Repair changes the outcome','outcome','End joining may restore the original sequence or create an insertion or deletion. With an appropriate donor, HDR may copy a specified change. Explore example outcomes; none is guaranteed.','An edit is a repair outcome','The examples illustrate possible outcomes, not their probabilities. A selected HDR route does not guarantee template incorporation.',[repairControl,{type:'actions',label:'Compare possible results',options:[{action:'another',label:'Show another outcome'}]}]),
    mechanism('Specific is not infallible','offtarget','Similar sequences elsewhere can sometimes be cut. A mismatch does not make a site automatically safe, especially when its location is tolerated. Guide selection and experimental validation both matter.','A match has degrees','Target A illustrates a near match with a compatible PAM. Its mismatches lower complementarity here, but this visualization cannot predict whether a real site would be cut.'),
    mechanism('Connect the whole mechanism','whole','Guide RNA supplies sequence recognition. A compatible PAM enables interrogation. Cas9 cuts, then cellular repair produces the final outcome. Revisit the earlier chapters to test each link.','Recognition → cleavage → repair','Genome editing combines a programmable targeting system with the cell’s own repair biology. Precision of targeting and precision of the final edit are different questions.'),
    {title:'The editing vocabulary',type:'glossary',description:'Keep the targeting machinery separate from the repair machinery.',stageTitle:'Eight terms that connect the sequence',terms:[
      {term:'Guide RNA',definition:'An RNA with a targeting segment and a scaffold that associates with Cas9.'},
      {term:'Cas9',definition:'An RNA-guided nuclease with domains that can cut the two strands of DNA.'},
      {term:'PAM',definition:'A short neighboring DNA motif recognized by the nuclease. SpCas9 commonly recognizes NGG.'},
      {term:'Complementarity',definition:'Base pairing between compatible sequences: A–T in DNA, A–U in RNA, and G–C.'},
      {term:'R-loop',definition:'A local RNA–DNA hybrid with the other DNA strand displaced.'},
      {term:'NHEJ',definition:'Non-homologous end joining: repair that joins broken DNA ends without an extensive homologous template.'},
      {term:'HDR',definition:'Homology-directed repair: repair using a homologous sequence as a template.'},
      {term:'Off-target edit',definition:'An unintended edit at a genomic location other than the intended target.'}
    ]},
    {title:'Beyond the molecular scissors',type:'facts',description:'The tool is programmable. The biology remains complex.',stageTitle:'What the simplified picture leaves out',facts:[
      {title:'An immune system became a tool',body:'CRISPR systems evolved in microbes. Researchers adapted an RNA-guided defense mechanism to recognize selected DNA sequences in the laboratory.'},
      {title:'RNA made targeting programmable',body:'The 2012 biochemical work showed that a designed RNA could direct Cas9 cleavage. Changing the RNA targeting segment changed the DNA address.'},
      {title:'The cut is only the beginning',body:'DNA repair can restore a sequence or change it. End joining, template-directed repair, and other pathways can produce different outcomes at the same target.'},
      {title:'This atlas is not a design predictor',body:'The artificial sequence illustrates pairing and PAM recognition. It does not search a genome, score off-target sites, estimate editing efficiency, or predict safety.'}
    ],sources},
    quiz('Checkpoint 01 · The address','Which candidate meets both recognition rules in this model?',['A: two mismatches and an AGG PAM','B: complete pairing and an AGG PAM','C: complete pairing and an AAA motif','Any site that has the same length'],1,'Target B combines full guide complementarity with a compatible NGG PAM. Real recognition is more nuanced than these two simplified checks.'),
    quiz('Checkpoint 02 · The guide','Which molecule pairs directly with the target DNA strand?',['The guide RNA targeting segment','A glucose transporter','The donor template before Cas9 binds','The PAM itself'],0,'The targeting segment of the guide RNA forms an RNA–DNA hybrid. The PAM is a neighboring DNA motif recognized by Cas9; it is not part of the guide.'),
    quiz('Checkpoint 03 · After the cut','What best describes the distinction between NHEJ and HDR?',['Both always insert the exact desired sequence','NHEJ needs a donor, whereas HDR never uses one','NHEJ joins ends; HDR can copy a homologous template','Cas9 performs both repair pathways itself'],2,'NHEJ reconnects DNA ends and can be precise or generate indels. HDR uses homologous sequence information, which can come from a supplied donor. Cellular repair, not Cas9 alone, determines the final sequence.'),
    quiz('Checkpoint 04 · Precision','Does a near match with a compatible PAM guarantee that no off-target cut will occur?',['Yes, one mismatch always blocks Cas9','Yes, any mismatched guide is inactive','No, mismatch tolerance depends on position and context','No, because all DNA sites are cut equally'],2,'Cas9 can tolerate some mismatches. Their positions, the guide, chromatin, and experimental conditions affect activity. Off-target risk requires evaluation beyond this teaching model.')
  ];
  function metrics(state,step) {
    const candidate=candidates[state.target];
    const matches=[...sequence].filter((base,i)=>base===candidate.sequence[i]).length;
    return [{label:'DNA target',value:'Target '+state.target,unit:['targets','match'].includes(step.phase)?'selectable':'guided example'},
      {label:'Guide pairing',value:matches+'/20',unit:'bases'},
      {label:'PAM motif',value:candidate.pam,unit:candidate.pam.endsWith('GG')?'compatible':'not NGG'},
      {label:['repair','outcome'].includes(step.phase)?'Repair route':'Cas9 state',value:['repair','outcome'].includes(step.phase)?state.repair:step.phase==='cut'?'Cleaved':['bind','whole'].includes(step.phase)?'Bound':'Searching'}];
  }
  const text=(x,y,content,cls='crispr-label',anchor='start')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${content}</text>`;
  function defs(){return `<defs><linearGradient id="crispr-protein" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#759db2" stop-opacity=".3"/><stop offset=".5" stop-color="#2d5165" stop-opacity=".22"/><stop offset="1" stop-color="#69668a" stop-opacity=".3"/></linearGradient><linearGradient id="crispr-ribbon"><stop stop-color="#4c7184"/><stop offset=".45" stop-color="#8adee9"/><stop offset="1" stop-color="#456783"/></linearGradient></defs>`;}
  function candidatesView(state,step) {
    let out=text(48,58,step.phase==='offtarget'?'NEAR MATCHES DESERVE ATTENTION':'TWO CHECKS / SEQUENCE + PAM','crispr-eyebrow');
    out+=text(248,100,'20-base non-target DNA sequence · 5′ → 3′','crispr-small')+text(826,100,'PAM','crispr-small');
    Object.entries(candidates).forEach(([key,candidate],row)=>{
      const y=145+row*103, selected=state.target===key, good=key==='B';
      out+=`<rect x="45" y="${y-22}" width="910" height="83" rx="9" class="crispr-candidate ${selected?'selected':''}"/>`;
      out+=text(65,y+10,'TARGET '+key,'crispr-small')+text(65,y+34,selected?'SELECTED':'COMPARE','crispr-micro');
      [...candidate.sequence].forEach((base,i)=>{
        const x=250+i*27,wrong=base!==sequence[i];
        out+=`<rect x="${x-9}" y="${y-8}" width="22" height="30" rx="4" fill="${wrong?'#6d354d':'#192b36'}"/>`+text(x+2,y+14,base,wrong?'crispr-base mismatch':'crispr-base','middle');
      });
      out+=`<rect x="806" y="${y-8}" width="96" height="30" rx="4" fill="${key==='C'?'#593044':'#274639'}"/>`+text(854,y+14,candidate.pam,'crispr-base','middle');
      out+=text(250,y+44,good?'20/20 matched · compatible PAM':key==='A'?'18/20 matched · compatible PAM':'20/20 matched · incompatible PAM','crispr-small');
    });
    const message=state.target==='B'?'Target B confirmed: guide pairing and PAM both match.':state.target==='A'?'Two mismatches: compare the highlighted bases with the guide.':'The sequence matches, but this motif is not an NGG PAM.';
    out+=`<rect x="45" y="463" width="910" height="59" rx="7" fill="${state.target==='B'?'#17362b':'#242331'}" stroke="${state.target==='B'?'#426e56':'#665063'}"/>`+text(68,498,message,'crispr-status');
    return out;
  }
  function helix() {
    let out=text(70,85,'DNA / A DOUBLE-STRANDED ADDRESS','crispr-eyebrow');
    for(let i=0;i<31;i++){const x=100+i*26,y1=265+75*Math.sin(i*.34),y2=265-75*Math.sin(i*.34);out+=`<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${i%2?'#a995d0':'#7acdbd'}" stroke-width="4" opacity=".6"/>`;}
    for(let strand=0;strand<2;strand++){let d='';for(let i=0;i<=150;i++)d+=(i?'L':'M')+(100+i*5.2)+' '+(265+75*Math.sin(i*.068+strand*Math.PI));out+=`<path d="${d}" fill="none" stroke="${strand?'#b3a4e7':'url(#crispr-ribbon)'}" stroke-width="6"/>`;}
    out+=text(110,417,'A ↔ T','crispr-title')+text(310,417,'G ↔ C','crispr-title')+text(570,417,'Antiparallel strands','crispr-title');
    out+=text(110,450,'Four letters. Complementary pairs. A sequence you can recognize.','crispr-label');return out;
  }
  function ladder(state,step){
    const phase=step.phase, cut=phase==='cut',bound=['bind','cut','whole'].includes(phase),repair=['repair','outcome'].includes(phase);
    const x0=202,dx=28,yTop=260,yBottom=350,cutX=x0+16.5*dx;
    let shownSequence=sequence;
    if(phase==='outcome'){
      if(state.repair==='HDR' && state.outcome%2===0)shownSequence=sequence.slice(0,16)+'C'+sequence.slice(17);
      if(state.repair==='NHEJ' && state.outcome%3===0)shownSequence=sequence.slice(0,16)+'−'+sequence.slice(17);
      if(state.repair==='NHEJ' && state.outcome%3===1)shownSequence=sequence;
    }
    let out='';
    if(bound)out+=`<path class="crispr-complex" d="M184 200C162 133 265 99 342 137C419 91 538 104 563 149C661 103 771 154 773 219C827 260 795 365 748 389C700 448 582 455 522 413C431 458 296 430 269 398C168 420 113 313 164 268C134 239 149 217 184 200Z" fill="url(#crispr-protein)" stroke="#81b0bb" stroke-width="1.5"/>`+text(486,173,'Cas9','crispr-title','middle');
    else out+=text(48,67,repair?'CELLULAR REPAIR / TARGET B':'GUIDE RNA / SEQUENCE RECOGNITION','crispr-eyebrow');
    if(!repair)out+=text(48,214,'Guide RNA','crispr-small')+text(48,234,'5′ → 3′','crispr-micro');
    out+=text(45,yTop+5,'5′ DNA','crispr-small')+text(45,yBottom+5,'3′ DNA','crispr-small');
    for(let i=0;i<23;i++){
      const base=i<20?shownSequence[i]:'AGG'[i-20],x=x0+i*dx+(cut&&i>=17?18:0),pam=i>=20;
      const top=bound?yTop-30*Math.sin(Math.PI*i/23):yTop;
      out+=`<line x1="${x}" y1="${top+12}" x2="${x}" y2="${yBottom-12}" stroke="${pam?'#9dd5a9':'#3c5767'}" opacity="${bound&&!pam?.2:.6}" stroke-dasharray="3 4"/>`;
      out+=`<rect x="${x-10}" y="${top-16}" width="22" height="28" rx="4" fill="${pam?'#31513f':phase==='outcome'&&base!==sequence[i]?'#69445e':'#173646'}"/>`+text(x+1,top+5,base,'crispr-base','middle');
      out+=`<rect x="${x-10}" y="${yBottom-16}" width="22" height="28" rx="4" fill="#29283e"/>`+text(x+1,yBottom+5,(complement(base)||'−'),'crispr-base dna-complement','middle');
      if(i<20&&!repair){const gy=bound?315:208;out+=text(x+1,gy+5,sequence[i].replace('T','U'),'crispr-base rna','middle');if(bound)out+=`<line x1="${x}" y1="${gy+10}" x2="${x}" y2="${yBottom-17}" stroke="#94d9b4" opacity=".6"/>`;}
    }
    out+=text(870,yTop+5,'3′','crispr-small')+text(870,yBottom+5,'5′','crispr-small');
    out+=`<path d="M${x0+20*dx-12} 384v9h82v-9" fill="none" stroke="#9dd5a9"/>`+text(790,420,'NGG PAM','crispr-small','middle');
    if(cut)out+=`<path class="crispr-cut" d="M${cutX} 202v178" stroke="#ef91a7" stroke-width="2" stroke-dasharray="5 5"/>`+text(479,478,'Cut approximately 3 bases upstream of PAM','crispr-label','middle');
    if(phase==='guide')out+=`<path d="M750 205c50-73 97-34 64 2s25 47 37 16" fill="none" stroke="#a3edce" stroke-width="3"/>`+text(467,468,'Targeting segment pairs with the complementary DNA strand','crispr-label','middle');
    if(phase==='bind')out+=text(472,490,'RNA–DNA hybrid + displaced DNA strand = R-loop','crispr-label','middle');
    if(phase==='outcome'&&state.repair==='NHEJ'&&state.outcome%3===1)out+=`<path d="M665 282v30" stroke="#ed8195"/>`+text(665,304,'+A','crispr-base mismatch','middle');
    if(repair){
      const hdr=state.repair==='HDR';
      out+=text(70,120,hdr?'Copy from a homologous donor':'Join the broken ends','crispr-title');
      out+=text(70,153,hdr?'Template information can specify a change.':'No supplied homologous template is required.','crispr-label');
      if(hdr)out+=`<path d="M270 197h430" stroke="#a3edce" stroke-width="3" stroke-dasharray="15 6"/>`+text(730,202,'Donor','crispr-small');
      out+=`<rect x="65" y="450" width="870" height="73" rx="8" fill="#152d2c" stroke="#3d6660"/>`;
      const examples=hdr?['Example: template-specified base change','Example: no donor incorporation']:['Example: one-base deletion at the join','Example: one-base insertion at the join','Example: precise rejoining'];
      out+=text(90,480,phase==='outcome'?examples[state.outcome%examples.length]:(hdr?'HDR · template-directed repair':'NHEJ · end joining'),'crispr-status')+text(90,506,'Illustrative possibilities; no outcome frequency or guarantee is implied.','crispr-small');
    }
    if(phase==='whole'){
      ['Guide recognizes','PAM permits','Cas9 cleaves','Cell repairs'].forEach((label,i)=>{const x=49+i*238;out+=`<rect x="${x}" y="470" width="219" height="54" rx="7" fill="#17302d" stroke="#385c54"/>`+text(x+109,503,label,'crispr-small','middle');});
    }
    return out;
  }
  window.SignalAtlasModules=window.SignalAtlasModules||{};
  window.SignalAtlasModules.crispr={
    id:'crispr',number:'03',title:'How CRISPR Edits DNA',discipline:'Genetics',accent:'#75d8ed',initialState:{target:'B',repair:'NHEJ',outcome:0},steps,sources,
    onEnter(state,step){if(!['targets','match'].includes(step.phase))state.target='B';},
    onControl(state,id){if(id==='repair')state.outcome=0;},
    onAction(state,action){if(action==='another')state.outcome++;},metrics,
    render(state,step){const content=['targets','match','offtarget'].includes(step.phase)?candidatesView(state,step):step.phase==='dna'?helix():ladder(state,step);return `<svg class="crispr-svg" viewBox="0 0 1000 560" role="img" aria-label="${step.stageTitle}. Artificial DNA example with guide RNA, Cas9, and PAM; current target ${state.target}.">${defs()}${content}</svg>`;}
  };
}());
