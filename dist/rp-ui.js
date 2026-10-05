// Ephemeral scene choices only. No storage, patient record or automatic outcome.
let rpContext={place:'',team:'',mood:'',resources:''};
let rpContextOpen=false;
let rpPhraseBlocks=[];
let rpPhraseHistory=new Map();
let rpPhraseOrder=new Map();
function resetRpScene(){rpContext={place:'',team:'',mood:'',resources:''};rpContextOpen=false;rpPhraseBlocks=[];rpPhraseHistory.clear();rpPhraseOrder.clear();if(typeof resetReportDraft==='function')resetReportDraft();}
function setReadingSize(value,persist=true){
 const size=['normal','large','xlarge'].includes(value)?value:'normal';
 document.documentElement.dataset.readingSize=size;
 document.getElementById('readingSize').value=size;
 if(persist)try{localStorage.setItem('elkins-reading-size',size);}catch(error){}
}
function placeReadingControls(){
 const control=document.querySelector('.reading-setting'),theme=document.getElementById('themeToggle');
 if(innerWidth<=760){document.getElementById('siteHeader').append(theme,control);}
 else{document.querySelector('.sidebar-note').before(theme,control);}
}
document.addEventListener('DOMContentLoaded',()=>{
 let size='normal';try{size=localStorage.getItem('elkins-reading-size') || 'normal';}catch(error){}
 setReadingSize(size,false);
 const mobile=matchMedia('(max-width:760px)');
 placeReadingControls();mobile.addEventListener('change',placeReadingControls);
});
function rpChoicesMarkup(){
 const fields={conscious:'État initial',headState:'État initial',poisonState:'État initial',unknownBreathing:'Respiration initiale',breathing:'Respiration initiale',unknownBleeding:'Saignement',unknownWake:'Dernière réaction',gunArea:'Zone',knifeArea:'Zone',knifeSeverity:'Plaie',horseArea:'Zone',horsePain:'Douleur',fracturePain:'Douleur',horseVisible:'Aspect',horseMove:'Mouvement',fightIssue:'Signe principal',bullet:'Projectile',needsSuture:'Fermeture',burnSeverity:'Brûlure',rpPain:'Douleur réévaluée',consultEvolution:'Évolution'};
 const manual={horseMove:{normal:'Normal',painful:'Douloureux',limited:'Limité',none:'Impossible',unknown:'Non évalué'},rpPain:{mild:'Légère',moderate:'Modérée',strong:'Forte',unsafe:'Conscience / respiration inquiétante',unknown:'Non évaluée'}};
 Object.assign(fields,{animalSpecies:'Animal',animalBleeding:'Saignement',animalInjury:'Blessures',animalArea:'Zone',animalDepth:'Aspect / fonction',animalVenomSigns:'Évolution après morsure',animalExposure:'Animal / circonstances'});
 const steps=activeRouteKind==='surgery'?surgeries[currentSurgery]?.steps:flows[currentFlow]?.steps;
 const choices=(steps || []).flatMap(step=>activeRouteKind==='flow'&&currentFlow==='animal'?animalChoicesForStep(step):step.choices || []);
 const chips=Object.entries(fields).flatMap(([key,label])=>{
   if(!Object.prototype.hasOwnProperty.call(answers,key))return [];
   const text=zoneKeys.includes(key)&&zoneSelections(key).length?zoneLabels(key):manual[key]?.[answers[key]] || choices.find(choice=>choice.set?.[key]===answers[key]&&Object.entries(choice.set).every(([k,v])=>answers[k]===v))?.label;
   if(!text)return [];
   return [`<span><b>${label} :</b> ${reportEscape(text)}</span>`];
 });
 return conciseCareRecap(chips);
}
function rpContextMarkup(kind){
 const select=(key,label,options)=>`<label>${label}<select data-rp-context="${key}" onchange="setRpContext('${key}',this.value,'${kind}')"><option value="">Non précisé</option>${options.map(([value,text])=>`<option value="${value}" ${rpContext[key]===value?'selected':''}>${text}</option>`).join('')}</select></label>`;
 const summary=[{field:'place',labels:{field:'Terrain',office:'Cabinet'}},{field:'team',labels:{solo:'Seul',assistant:'Avec un assistant'}},{field:'mood',labels:{panic:'Patient paniqué',calm:'Patient calme'}}].map(item=>item.labels[rpContext[item.field]]).filter(Boolean).join(' · ');
 return `<details class="rp-context" ${rpContextOpen?'open':''} ontoggle="if(this.isConnected)rpContextOpen=this.open"><summary>Contexte facultatif${summary?' : '+summary:''}</summary><div class="rp-context-fields">${select('place','Lieu',[['field','Terrain'],['office','Cabinet']])}${select('team','Aide',[['solo','Seul'],['assistant','Avec un assistant']])}${select('mood','Attitude jouée',[['panic','Paniqué'],['calm','Calme']])}<button type="button" class="secondary" onclick="resetRpContext('${kind}')">Effacer le contexte</button></div><p class="muted">N'indique que ce qui est joué. Ces choix ne décident ni du diagnostic ni de l'évolution.</p>${rpContext.team==='solo'?'<p>Seul : si un geste demande un assistant, demander du renfort avant de poursuivre. Le contexte ne rend pas une opération lourde réalisable seul.</p>':''}</details>`;
}
function setRpContext(key,value,kind){
 const allowed={place:['','field','office'],team:['','solo','assistant'],mood:['','panic','calm'],resources:['','limited','ready']};
 if(!allowed[key]?.includes(value))return;
 rpContext[key]=value;rpContextOpen=true;
 const y=scrollY;kind==='surgery'?renderSurgery():render();
 document.querySelector(`[data-rp-context="${key}"]`)?.focus({preventScroll:true});scrollTo(0,y);
}
function resetRpContext(kind){rpContext={place:'',team:'',mood:'',resources:''};rpContextOpen=true;kind==='surgery'?renderSurgery():render();}
function rpPatientState(){
 if(answers.latestBreathing==='no')return 'unresponsive';
 if(answers.latestState)return {awake:rpContext.mood==='panic'?'panic':'awake',confused:'confused',unresponsive:'unresponsive',unknown:'uncertain'}[answers.latestState];
 if(sleepingSurgery())return 'asleep';
 if(activeRouteKind==='surgery' && surgeries[currentSurgery]?.steps[surgeryStepIndex]?.recovery)return 'recovery';
 const state=answers.conscious || answers.headState || answers.poisonState || (currentFlow==='unknown'?answers.unknownWake:undefined);
 if(/unconscious|not_breathing/.test(state || '') || answers.breathing==='no' || !answers.unknownWake && answers.unknownBreathing==='no')return 'unresponsive';
 if(state==='unknown' || currentFlow==='unknown' && !state)return 'uncertain';
 if(state==='confused' || state==='sleepy')return 'confused';
 if(rpContext.mood==='panic')return 'panic';
 return state==='awake'?'awake':'uncertain';
}
function rpGesture(){
 if(activeRouteKind==='flow'&&flows[currentFlow]?.steps[stepIndex]?.animalSpeciesPicker)return '';
 const title=activeStepTitle.toLowerCase();
 let gesture='Se place à hauteur du patient et observe ses réactions avant de poursuivre.';
 if(/nettoy|antisept/.test(title))gesture='Déplie un linge propre et prépare le nécessaire près de la zone à soigner.';
 else if(/panser|pansement|protéger|fermer|sutur/.test(title))gesture='Dispose les compresses et le matériel de fermeture ou de protection à portée de main.';
 else if(/anesth|douleur|soulager/.test(title))gesture='Présente la préparation retenue et annonce le geste avant de l’effectuer.';
 else if(/respir|stabil|réveil|surveill/.test(title))gesture='Marque une pause et observe la poitrine ainsi que les réactions du patient.';
 else if(/immobil|fracture/.test(title))gesture='Prépare le support du membre sans lui imposer de mouvement.';
 else if(/opérer|explor|ligatur|décomprim/.test(title))gesture='Vérifie que le matériel est prêt avant de reprendre le geste décrit dans la scène.';
 if(activeRouteKind==='flow'&&currentFlow==='animal'&&animalIsVenom())gesture='Garde le patient au calme, observe sa respiration et prépare le transport sans manipuler la morsure.';
 else if(activeRouteKind==='flow'&&currentFlow==='animal'&&!animalHasWound())gesture='Soutient la zone touchée et demande au patient de préciser la gêne, sans lui imposer un mouvement.';
 if(rpContext.place==='field')gesture+=' Garde le nécessaire sur un linge propre à portée de main.';
 if(rpContext.place==='office')gesture+=' Dispose le nécessaire sur la table de soin.';
 return `<div class="rp-gesture"><b>Geste RP</b><span>${gesture}</span></div>`;
}
function rpDialogue(items){
 const state=rpPatientState();
 const ended=activeRouteKind==='surgery'?surgeryEnded:interventionEnded;
 const assistant=rpContext.team==='assistant' || rpContext.team==='';
 let audience='Au patient, s’il peut répondre';
 let pool=[...(items || []),casePhrase()].filter(Boolean);
 const title=activeStepTitle.toLowerCase();
 const stepAction=/nettoy|antisept/.test(title)?'préparer le nettoyage de cette zone':/sutur|fermer/.test(title)?'vérifier la plaie avant sa fermeture':/panser|protéger/.test(title)?'préparer la protection de la zone blessée':/douleur|soulager/.test(title)?'évaluer la douleur avant de choisir un produit':/saign|ligatur/.test(title)?'contrôler le saignement':/respir/.test(title)?'vérifier la respiration':/immobil|fracture/.test(title)?'préparer le soutien du membre':/blessure|zone|localis/.test(title)?'repérer la zone blessée':/explor|projectile|extrai/.test(title)?'évaluer ce qui est accessible dans la plaie':/anesth/.test(title)?'préparer l’anesthésie et sa surveillance':/réveil|surveill/.test(title)?'surveiller la respiration et les réactions':/état|conscien|stabil/.test(title)?'vérifier la conscience, la respiration et le saignement':`faire le point sur l’étape ${title}`;
 const alternative=/nettoy|antisept/.test(title)?'« Je prépare le nettoyage de cette zone. Prévenez-moi si le contact vous gêne. »':/sutur|fermer/.test(title)?'« Je vérifie les bords de la plaie avant de décider de sa fermeture. »':/panser|protéger/.test(title)?'« Je prépare la protection de cette zone. Dites-moi si elle vous gêne une fois posée. »':/douleur|soulager/.test(title)?'« Avant de poursuivre, décrivez-moi la douleur avec vos mots. »':/respir|surveill/.test(title)?'« Je reste près de vous pour observer votre respiration et vos réactions. »':`« Je vais ${stepAction}. Dites-moi si quelque chose vous gêne à cet instant. »`;
 if(!items?.length || /^« Très bien, je (continue|passe)/.test(items[0]))pool=[alternative,casePhrase()];
 pool.push(alternative);
 const question=/douleur|soulager/.test(title)?'« La douleur est-elle supportable, ou vous empêche-t-elle de rester tranquille ? »':/nettoy|antisept/.test(title)?'« Est-ce le contact du linge ou la plaie elle-même qui vous fait mal ? »':/sutur|fermer/.test(title)?'« Est-ce que cela tire davantage à un endroit précis ? »':/panser|protéger/.test(title)?'« Le pansement vous gêne-t-il quelque part ? »':/respir/.test(title)?'« Avez-vous du mal à reprendre votre souffle ? »':/saign/.test(title)?'« Vous sentez-vous faible ou étourdi pendant que je m’occupe du saignement ? »':'« Qu’est-ce qui vous gêne le plus à cet instant ? »';
 pool.push(question,`« Je vous annonce chaque geste avant de ${stepAction}. Si quelque chose vous inquiète, nous en parlons. »`,`« Pendant que je m’occupe de cette étape, restez dans cette position et signalez-moi tout changement. »`);
 if(state==='asleep' || state==='unresponsive'){
   audience=assistant?'À l’assistant':'Annonce RP / demande de renfort';
   const action=activeStepTitle.toLowerCase();
   const instruction=/saign|ligatur/.test(action)?'Gardez la pression sur la zone pendant que je contrôle le saignement.':/panser|fermer|sutur/.test(action)?'Gardez les compresses prêtes pendant que je protège la plaie.':'Surveillez sa respiration et prévenez-moi si son état change.';
   pool=assistant?[`« Je vais ${stepAction}. ${instruction} »`,`« Dites-moi si sa respiration ou ses réactions changent pendant ce geste. »`,`« Préparez ce dont j’ai besoin pour ${stepAction} ; je garde le patient sous observation. »`,`« Avant de poursuivre cette étape, faisons le point : répond-il à la voix ? »`]:[`« Pour ${stepAction}, j’ai besoin de renfort afin de garder ce patient sous surveillance. »`,`« Je suspends le geste : sa respiration et ses réactions passent en premier. »`,`« Que quelqu’un reste auprès du patient pendant que je prépare la suite. »`,`« Je ne poursuis pas cette étape sans pouvoir assurer sa surveillance. »`];
  if(assistant&&activeRouteKind==='surgery'&&additionalSurgeries[currentSurgery])pool=[...(items||[]).filter(text=>/^À l’assistant/.test(text)),...pool];
 }else if(state==='confused'){
   audience='Au patient, phrases courtes';
   pool=[`« Je suis le médecin. Je vais ${stepAction}. »`,'« Pouvez-vous me regarder et me dire votre nom ? »','« Vous n’avez pas besoin de tout raconter maintenant. Une réponse courte suffit. »',`« Je vous préviens avant le prochain geste. Dites-moi si vous avez mal. »`,alternative];
 }else if(state==='panic'){
   audience='Au patient paniqué';
   pool=[`« Je vais ${stepAction}. Je vous explique le geste avant de commencer. »`,'« Qu’est-ce qui vous inquiète le plus : le geste, la douleur ou autre chose ? »','« Je reste auprès de vous. Vous pouvez me dire ce qui vous gêne, sans chercher vos mots. »',`« Laissez-moi préparer le nécessaire ; je vous annonce ensuite ce que je fais. »`,alternative];
 }else if(state==='recovery'){
   audience='Réveil joué, sans résultat automatique';
   pool=assistant?['À l’assistant : « Restez auprès de lui et surveillez sa respiration pendant qu’il reprend ses esprits. »','Au patient, seulement s’il se réveille : « Ne vous relevez pas. Nous allons encore vous surveiller. »','Au patient, seulement s’il peut répondre : « Pouvez-vous me dire comment vous vous sentez ? »','À l’assistant : « Prévenez-moi de tout changement, même après les premières réponses. »']:['« Je reste auprès du patient et demande du renfort pour poursuivre la surveillance. »','Au patient, seulement s’il se réveille : « Vous êtes toujours auprès de nous. Ne vous relevez pas. »','Au patient, seulement s’il peut répondre : « Qu’est-ce qui vous gêne à cet instant ? »','« Le réveil ne termine pas la surveillance : je reste près du patient. »'];
 }else{
   if(state==='awake')audience='Au patient conscient';
   // Show different intentions together; keep authored alternatives in the pool.
   pool=[pool[0],question,...pool.slice(1)];
 }
 pool=[...new Set(pool.filter(Boolean))];
 if(ended){
   const notes=activeRouteKind==='surgery'?surgeryEndings[currentSurgery]:sceneEndings[currentFlow];
   const responsive=!['asleep','unresponsive'].includes(state);
   audience=responsive?'Pour conclure, selon l’état joué':'À l’accompagnant, s’il est présent';
   pool=responsive?[notes[1],`« Pour la suite : ${notes[2]} »`,`« Prévenez-moi si vous remarquez ceci : ${notes[3]} »`,'À l’accompagnant, s’il est présent : « Restez près de lui et prévenez-moi si son état change. »','« Avant de poursuivre, avez-vous une question sur les consignes ? »']:[`« La surveillance continue : ${notes[3]} »`,'« Il ne répond pas encore. La fin de ces gestes ne signifie pas qu’il peut repartir. »','« Si quelqu’un peut rester auprès de lui, prévenez-moi de toute modification de sa respiration ou de ses réactions. »'];
 }
 const firstBlock=rpPhraseBlocks.length===0;
 const stepKey=rpDialogueStepKey();
 // Keep every alternative, but show phrases not already displayed in other steps first.
 // Cache each context's order so re-rendering and going back do not shuffle it.
 const orderKey=JSON.stringify([stepKey,state,rpContext,answers,items]);
 if(!rpPhraseOrder.has(orderKey)){
   const used=new Set([...rpPhraseHistory].filter(([key])=>key!==stepKey).flatMap(([,phrases])=>[...phrases]));
   pool=pool.map((phrase,index)=>({phrase,index,used:used.has(phrase)})).sort((a,b)=>Number(a.used)-Number(b.used) || a.index-b.index).map(item=>item.phrase);
   rpPhraseOrder.set(orderKey,pool);
 }else pool=rpPhraseOrder.get(orderKey);
 const index=rpPhraseBlocks.push({pool,position:0,stepKey})-1;
 return `${ended || !firstBlock?'':rpGesture()}<div class="rp-lines rp-dialogue"><div class="rp-dialogue-heading"><span>${audience}</span><button type="button" class="secondary" onclick="alternateRpPhrase(${index},this)">Autre formulation</button></div><div class="rp-phrase-list" aria-live="polite">${rpPhraseRows(rpPhraseBlocks[index])}</div></div>`;
}
function alternateRpPhrase(index,button){
 const block=rpPhraseBlocks[index];
 const root=document.getElementById(activeRouteKind==='surgery'?'surgeryFlow':'flow');
 if(!block || block.stepKey!==rpDialogueStepKey() || !button.isConnected || !root?.contains(button))return;
 block.position=(block.position+1)%block.pool.length;
 button.closest('.rp-dialogue').querySelector('.rp-phrase-list').innerHTML=rpPhraseRows(block);
}
function rpPhraseRows(block){
 const speciesPicker=activeRouteKind==='flow'&&flows[currentFlow]?.steps[stepIndex]?.animalSpeciesPicker;
 const count=Math.min(compactMode?1:speciesPicker?2:3,block.pool.length);
 const phrases=Array.from({length:count},(_,offset)=>block.pool[(block.position+offset)%block.pool.length]);
 if(!rpPhraseHistory.has(block.stepKey))rpPhraseHistory.set(block.stepKey,new Set());
 phrases.forEach(phrase=>rpPhraseHistory.get(block.stepKey).add(phrase));
 return phrases.map(phrase=>`<div class="rp-line"><span class="rp-arrow" aria-hidden="true">→</span><span class="rp-current-phrase">${phrase}</span></div>`).join('');
}
function rpDialogueStepKey(){
 return activeRouteKind==='surgery'?`surgery:${currentSurgery}:${surgeryStepIndex}:${surgeryEnded}`:`flow:${currentFlow}:${stepIndex}:${interventionEnded}`;
}
