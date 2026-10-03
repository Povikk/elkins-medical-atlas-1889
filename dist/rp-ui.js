// Ephemeral scene choices only. No storage, patient record or automatic outcome.
let rpContext={place:'',team:'',mood:''};
let rpContextOpen=false;
let rpPhraseBlocks=[];
function resetRpScene(){rpContext={place:'',team:'',mood:''};rpContextOpen=false;rpPhraseBlocks=[];}
function rpContextMarkup(kind){
 const select=(key,label,options)=>`<label>${label}<select data-rp-context="${key}" onchange="setRpContext('${key}',this.value,'${kind}')"><option value="">Non précisé</option>${options.map(([value,text])=>`<option value="${value}" ${rpContext[key]===value?'selected':''}>${text}</option>`).join('')}</select></label>`;
 const summary=[{field:'place',labels:{field:'Terrain',office:'Cabinet'}},{field:'team',labels:{solo:'Seul',assistant:'Avec un assistant'}},{field:'mood',labels:{panic:'Patient paniqué',calm:'Patient calme'}}].map(item=>item.labels[rpContext[item.field]]).filter(Boolean).join(' · ');
 return `<details class="rp-context" ${rpContextOpen?'open':''} ontoggle="if(this.isConnected)rpContextOpen=this.open"><summary>Contexte facultatif${summary?' : '+summary:''}</summary><div class="rp-context-fields">${select('place','Lieu',[['field','Terrain'],['office','Cabinet']])}${select('team','Aide',[['solo','Seul'],['assistant','Avec un assistant']])}${select('mood','Attitude jouée',[['panic','Paniqué'],['calm','Calme']])}<button type="button" class="secondary" onclick="resetRpContext('${kind}')">Effacer le contexte</button></div><p class="muted">N'indique que ce qui est joué. Ces choix ne décident ni du diagnostic ni de l'évolution.</p>${rpContext.team==='solo'?'<p>Seul : si un geste demande un assistant, demander du renfort avant de poursuivre. Le contexte ne rend pas une opération lourde réalisable seul.</p>':''}</details>`;
}
function setRpContext(key,value,kind){
 const allowed={place:['','field','office'],team:['','solo','assistant'],mood:['','panic','calm']};
 if(!allowed[key]?.includes(value))return;
 rpContext[key]=value;rpContextOpen=true;
 const y=scrollY;kind==='surgery'?renderSurgery():render();
 document.querySelector(`[data-rp-context="${key}"]`)?.focus({preventScroll:true});scrollTo(0,y);
}
function resetRpContext(kind){rpContext={place:'',team:'',mood:''};rpContextOpen=true;kind==='surgery'?renderSurgery():render();}
function rpPatientState(){
 if(sleepingSurgery())return 'asleep';
 if(activeRouteKind==='surgery' && surgeries[currentSurgery]?.steps[surgeryStepIndex]?.recovery)return 'recovery';
 const state=answers.conscious || answers.headState || answers.poisonState || (currentFlow==='unknown'?answers.unknownWake:undefined);
 if(/unconscious|not_breathing/.test(state || '') || answers.breathing==='no' || answers.unknownBreathing==='no')return 'unresponsive';
 if(state==='unknown' || currentFlow==='unknown' && !state)return 'uncertain';
 if(state==='confused' || state==='sleepy')return 'confused';
 if(rpContext.mood==='panic')return 'panic';
 return state==='awake'?'awake':'uncertain';
}
function rpGesture(){
 const title=activeStepTitle.toLowerCase();
 let gesture='Se place à hauteur du patient et observe ses réactions avant de poursuivre.';
 if(/nettoy|antisept/.test(title))gesture='Déplie un linge propre et prépare le nécessaire près de la zone à soigner.';
 else if(/panser|pansement|protéger|fermer|sutur/.test(title))gesture='Dispose les compresses et le matériel de fermeture ou de protection à portée de main.';
 else if(/anesth|douleur|soulager/.test(title))gesture='Présente la préparation retenue et annonce le geste avant de l’effectuer.';
 else if(/respir|stabil|réveil|surveill/.test(title))gesture='Marque une pause et observe la poitrine ainsi que les réactions du patient.';
 else if(/immobil|fracture/.test(title))gesture='Prépare le support du membre sans lui imposer de mouvement.';
 else if(/opérer|explor|ligatur|décomprim/.test(title))gesture='Vérifie que le matériel est prêt avant de reprendre le geste décrit dans la scène.';
 if(rpContext.place==='field')gesture+=' Garde le nécessaire sur un linge propre à portée de main.';
 if(rpContext.place==='office')gesture+=' Dispose le nécessaire sur la table de soin.';
 return `<div class="rp-gesture"><b>Geste RP</b><span>${gesture}</span></div>`;
}
function rpDialogue(items){
 const state=rpPatientState();
 const assistant=rpContext.team==='assistant' || rpContext.team==='';
 let audience='Au patient, s’il peut répondre';
 let pool=[...(items || []),casePhrase()].filter(Boolean);
 const title=activeStepTitle.toLowerCase();
 const stepAction=/nettoy|antisept/.test(title)?'préparer le nettoyage de cette zone':/sutur|fermer/.test(title)?'vérifier la plaie avant sa fermeture':/panser|protéger/.test(title)?'préparer la protection de la zone blessée':/douleur|soulager/.test(title)?'évaluer la douleur avant de choisir un produit':/saign|ligatur/.test(title)?'contrôler le saignement':/respir/.test(title)?'vérifier la respiration':/immobil|fracture/.test(title)?'préparer le soutien du membre':/blessure|zone|localis/.test(title)?'repérer la zone blessée':/explor|projectile|extrai/.test(title)?'évaluer ce qui est accessible dans la plaie':/anesth/.test(title)?'préparer l’anesthésie et sa surveillance':/réveil|surveill/.test(title)?'surveiller la respiration et les réactions':/état|conscien|stabil/.test(title)?'vérifier la conscience, la respiration et le saignement':`faire le point sur l’étape ${title}`;
 const alternative=/nettoy|antisept/.test(title)?'« Je prépare le nettoyage de cette zone. Prévenez-moi si le contact vous gêne. »':/sutur|fermer/.test(title)?'« Je vérifie les bords de la plaie avant de décider de sa fermeture. »':/panser|protéger/.test(title)?'« Je prépare la protection de cette zone. Dites-moi si elle vous gêne une fois posée. »':/douleur|soulager/.test(title)?'« Avant de poursuivre, décrivez-moi la douleur avec vos mots. »':/respir|surveill/.test(title)?'« Je reste près de vous pour observer votre respiration et vos réactions. »':`« Je vais ${stepAction}. Dites-moi si quelque chose vous gêne à cet instant. »`;
 if(!items?.length || /^« Très bien, je (continue|passe)/.test(items[0]))pool=[alternative,casePhrase()];
 pool.push(alternative);
 if(state==='asleep' || state==='unresponsive'){
   audience=assistant?'À l’assistant':'Annonce RP / demande de renfort';
   const action=activeStepTitle.toLowerCase();
   const instruction=/saign|ligatur/.test(action)?'Gardez la pression sur la zone pendant que je contrôle le saignement.':/panser|fermer|sutur/.test(action)?'Gardez les compresses prêtes pendant que je protège la plaie.':'Surveillez sa respiration et prévenez-moi si son état change.';
   pool=assistant?[`« Je vais ${stepAction}. ${instruction} »`,`« Avant de ${stepAction}, je vérifie ses réactions. Gardez sa respiration sous surveillance. »`]:[`« Pour ${stepAction}, j’ai besoin de renfort afin de garder ce patient sous surveillance. »`,`« Je vérifie sa respiration et ses réactions avant de ${stepAction}. J’ai besoin d’aide pour poursuivre. »`];
 }else if(state==='confused'){
   audience='Au patient, phrases courtes';
   pool=[`« Je suis le médecin. Je vais ${stepAction}. Pouvez-vous me regarder ? »`,`« Nous faisons une chose à la fois : je vais ${stepAction}. Dites-moi si vous pouvez me répondre. »`,alternative];
 }else if(state==='panic'){
   audience='Au patient paniqué';
   pool=[`« Je vais ${stepAction}. Je vous explique le geste avant de commencer ; dites-moi ce qui vous inquiète. »`,`« Nous prenons les choses une à une. Pour le moment, je vais ${stepAction} et je reste auprès de vous. »`,alternative];
 }else if(state==='recovery'){
   audience='Réveil joué, sans résultat automatique';
   pool=assistant?['À l’assistant : « Restez auprès de lui et surveillez sa respiration pendant qu’il reprend ses esprits. »','Au patient, seulement s’il se réveille : « Ne vous relevez pas. Nous allons encore vous surveiller. »']:['« Je reste auprès du patient et demande du renfort pour poursuivre la surveillance. »','Au patient, seulement s’il se réveille : « Vous êtes toujours auprès de nous. Ne vous relevez pas. »'];
 }else if(state==='awake')audience='Au patient conscient';
 pool=[...new Set(pool.filter(Boolean))];
 const firstBlock=rpPhraseBlocks.length===0;
 const stepKey=rpDialogueStepKey();
 const index=rpPhraseBlocks.push({pool,position:0,stepKey})-1;
 const ended=activeRouteKind==='surgery'?surgeryEnded:interventionEnded;
 return `${ended || !firstBlock?'':rpGesture()}<div class="rp-lines rp-dialogue"><div class="rp-dialogue-heading"><span>${audience}</span><button type="button" class="secondary" onclick="alternateRpPhrase(${index},this)">Autre formulation</button></div><div class="rp-line"><span class="rp-arrow" aria-hidden="true">→</span><span class="rp-current-phrase" aria-live="polite">${pool[0]}</span></div></div>`;
}
function alternateRpPhrase(index,button){
 const block=rpPhraseBlocks[index];
 const root=document.getElementById(activeRouteKind==='surgery'?'surgeryFlow':'flow');
 if(!block || block.stepKey!==rpDialogueStepKey() || !button.isConnected || !root?.contains(button))return;
 block.position=(block.position+1)%block.pool.length;
 button.closest('.rp-dialogue').querySelector('.rp-current-phrase').textContent=block.pool[block.position];
}
function rpDialogueStepKey(){
 return activeRouteKind==='surgery'?`surgery:${currentSurgery}:${surgeryStepIndex}:${surgeryEnded}`:`flow:${currentFlow}:${stepIndex}:${interventionEnded}`;
}
