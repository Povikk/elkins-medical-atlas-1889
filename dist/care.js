// Editorial care metadata and transient observations. Never persisted.
let anatomyPinned=false;
let careObservationDirty=false;
const careStateLabels={awake:'Conscient',confused:'Confus',unresponsive:'Ne répond pas',unknown:'Non évalué'};
function careProductBlocked(){
 const breathing=answers.latestBreathing || answers.breathing || answers.unknownBreathing;
 const bleeding=answers.latestBleeding || answers.unknownBleeding || answers.animalBleeding;
 const animalBleeding=answers.latestBleeding||answers.animalBleeding;
 const animalIncomplete=currentFlow==='animal'&&(!answers.conscious||!animalBleeding||animalBleeding==='unknown'||animalIsVenom());
 return ['asleep','unresponsive','uncertain','confused'].includes(rpPatientState()) || ['weak','no','unknown'].includes(breathing) || bleeding==='major' || animalIncomplete;
}
function careUrgency(base){
 if(currentFlow==='animal'&&animalIsVenom()&&answers.animalVenomSigns==='danger')return 'critical';
 const state=answers.latestState || answers.conscious || answers.headState || answers.poisonState || (currentFlow==='unknown'?answers.unknownWake:'');
 const breathing=answers.latestBreathing || answers.breathing || answers.unknownBreathing;
 const bleeding=answers.latestBleeding || answers.unknownBleeding || answers.animalBleeding;
 if(['no','weak'].includes(breathing) || state==='unresponsive' || /not_breathing|unconscious/.test(state || '') || bleeding==='major' || answers.burnSeverity==='airway')return 'critical';
 if(state==='confused' || state==='sleepy')return base==='critical'?base:'serious';
 if(answers.latestState==='awake' && breathing==='yes' && bleeding==='none')return base==='light'?'light':'serious';
 if(answers.horseVisible==='deformity' || answers.horseMove==='none' || answers.knifeSeverity==='deep' || ['chest','abdomen','head'].includes(answers.gunArea))return 'serious';
 return base;
}
function compactActions(title,items){
 // Preserve every action in order, rather than silently dropping the fourth onward.
 if(items.length<=3)return items;
 if(/^Priorité : respiration artificielle/.test(title))return ['Vérifier bouche, poitrine et respiration ; dégager seulement une obstruction visible.','Pour la scène 1889, jouer la méthode de Silvester décrite dans le repère ci-dessous.','Surveiller la reprise effectivement jouée et les saignements ; demander du renfort.'];
 const per=Math.ceil(items.length/3);
 return Array.from({length:3},(_,i)=>items.slice(i*per,(i+1)*per).join(' ')).filter(Boolean);
}
function careStepExtras(step){
 const links=[];
 if(currentFlow==='animal'&&step.dynamicAnimal){
  if(zoneHas('animalArea','head'))links.push(['head','Réévaluer le traumatisme crânien, si présent']);
  if((answers.latestBleeding||answers.animalBleeding)==='major')links.push(['surgery:major_bleeding','Saignement majeur : avis chirurgical si justifié']);
  if(answers.animalDepth==='crush'&&['arm','hand','leg','foot'].includes(answers.animalArea))links.push(['fracture','Atteinte du membre : évaluation et soutien']);
  if(zoneHas('animalArea','abdomen')&&answers.animalDepth==='deep')links.push(['surgery:abdominal','Plaie abdominale profonde : avis chirurgical']);
  if(answers.conscious==='not_breathing'||answers.latestBreathing==='no')links.push(['unknown','Priorité respiratoire et réévaluation']);
 }
 if(currentFlow==='fight' && answers.fightIssue==='head' || currentFlow==='horse' && zoneHas('horseArea','head') || currentFlow==='gunshot'&&zoneHas('gunArea','head') || currentFlow==='knife'&&zoneHas('knifeArea','head'))links.push(['head','Atteinte à la tête : réévaluation']);
 if(currentFlow==='gunshot' && answers.bullet==='in' && step.dynamic)links.push(['surgery:deep_bullet','Projectile profond, si exploration justifiée']);
 if(currentFlow==='knife' && answers.knifeSeverity==='deep' && zoneHas('knifeArea','abdomen'))links.push(['surgery:abdominal','Plaie abdominale grave, si la scène le justifie']);
 if(answers.latestBreathing==='no' || answers.conscious==='not_breathing')links.push(['unknown','Réévaluation prioritaire']);
 let html=links.length?`<details class="route-links"><summary>Réorienter si la scène le justifie</summary>${links.map(([id,label])=>`<button class="secondary" onclick="redirectCare('${id}')">${label}</button>`).join('')}</details>`:'';
 if(answers.consultEvolution==='worse')html+='<div class="route-note">Un signe s’aggrave : réévaluer conscience, respiration et saignement avant une simple conclusion de consultation.</div>';
 if(rpContext.resources==='limited')html+='<div class="route-note">Moyens limités : identifier ce qui manque, demander du renfort et organiser le transport. Ne pas inventer une substitution de produit ou rendre une opération réalisable avec du matériel absent.</div>';
 const current=step.care || {};
 if(current.assistant && rpContext.team==='assistant')html+=`<div class="assistant-note"><b>À l’assistant :</b> ${current.assistant}</div>`;
 return html;
}
function redirectCare(id){if(!confirm('Changer de parcours efface ses réponses temporaires. Continuer ?'))return;id.startsWith('surgery:')?openSurgery(id.slice(8)):start(id);}
function reassessCare(){
 const dialog=document.getElementById('incidentDialog');
 document.getElementById('incidentContent').innerHTML=`<p>Indique uniquement la dernière observation jouée. Le choix initial reste consultable dans le rappel.</p>${[['latestState','Conscience',Object.entries(careStateLabels)],['latestBreathing','Respiration',[['yes','Respire sans gêne décrite'],['weak','Faible / difficile'],['no','Ne semble pas respirer'],['unknown','Non évaluée']]],['latestBleeding','Saignement',[['none','Pas de saignement important observé'],['major','Important'],['unknown','Non évalué']]]].map(([key,title,rows])=>`<fieldset class="reassessment"><legend>${title}</legend>${rows.map(([value,label])=>`<button class="secondary" aria-pressed="${answers[key]===value}" onclick="updateCareObservation('${key}','${value}')">${label}</button>`).join('')}</fieldset>`).join('')}<button class="next" onclick="finishReassessment()">Revenir au soin</button>`;
 if(!dialog.open)dialog.showModal();
}
function updateCareObservation(key,value){
 const allowed={latestState:Object.keys(careStateLabels),latestBreathing:['yes','weak','no','unknown'],latestBleeding:['none','major','unknown']};
 if(!allowed[key]?.includes(value))return;
 answers[key]=value;careObservationDirty=true;reassessCare();
}
function finishReassessment(){closeIncident();}
function refreshCare(){
 if(!document.getElementById('surgeryFlow').classList.contains('hidden'))surgeryEnded?document.getElementById('surgeryFlow').innerHTML=endingMarkup('surgery'):renderSurgery();
 else if(!document.getElementById('flow').classList.contains('hidden'))interventionEnded?renderEnd():render();
}
function conciseCareRecap(chips){
 const latest=[answers.latestState?`État actuel : ${careStateLabels[answers.latestState]}`:'',answers.latestBreathing?`Respiration actuelle : ${{yes:'sans gêne décrite',weak:'difficile',no:'non apparente',unknown:'non évaluée'}[answers.latestBreathing]}`:'',answers.latestBleeding?`Saignement actuel : ${{none:'pas d’important observé',major:'important',unknown:'non évalué'}[answers.latestBleeding]}`:''].filter(Boolean);
 if(!chips.length&&!latest.length)return '';
 const primary=chips.filter(x=>/État|Zone|Signe principal|Dernière réaction/.test(x));
 const secondary=chips.filter(x=>!primary.includes(x));
 return `<div class="rp-choice-recap" aria-label="Rappel des choix observés"><small>${latest.length?'Dernière observation':'Choix du parcours'}</small>${latest.length?latest.map(x=>`<span>${x}</span>`).join(''):primary.join('')}${secondary.length || latest.length?`<details><summary>Choix précédents et détails</summary>${chips.join('')}</details>`:''}</div>`;
}
function pinAnatomyTooltip(key,index,button){anatomyPinned=false;revealAnatomyTooltip(key,index,null,button);anatomyPinned=true;anatomyTooltip.classList.add('pinned');}
function closePinnedAnatomy(){anatomyPinned=false;hideAnatomyTooltip();}
function atlasExtras(spot){
 const text=spot.label.toLowerCase();
 const id=/crân|cerve|tête|cou/.test(text)?'head':/bras|jambe|membre|doigt|orteil|humérus|radius|ulna|fémur|tibia|fibula|carpe|tarse|phalange|rotule|omoplate|clavicule/.test(text)?'fracture':/poumon|thorax|trach/.test(text)?'drowning':/abdomen|estomac|intestin/.test(text)?'digestive':'unknown';
 const question=id==='head'?'« Depuis le choc, qu’est-ce qui vous paraît différent ? »':id==='fracture'?'« Où ressentez-vous la gêne, sans forcer le mouvement ? »':id==='drowning'?'« Qu’est-ce qui vous gêne quand vous respirez ? »':'« Où ressentez-vous la gêne ? »';
 return `<details><summary>Question et références RP</summary><p>${question} Seulement si le patient peut répondre.</p><div class="scene-tools"><button class="secondary" onclick="atlasReference('symptoms')">Signes à observer</button><button class="secondary" onclick="atlasReference('technique')">Techniques</button><button class="secondary" onclick="closePinnedAnatomy();redirectCare('${id}')">Parcours associé, si pertinent</button></div><small>Raccourcis thématiques, pas un diagnostic de cette zone.</small></details><button class="reference-link" onclick="closePinnedAnatomy()">Fermer la fiche</button>`;
}
function atlasReference(type){closePinnedAnatomy();openSceneReferences();if(type==='symptoms'){setSceneReferenceTab('symptoms');}else{document.getElementById('sceneReferenceSearch').value='technique';renderSceneReferences();}}
function searchAtlas(query){
 const normalize=s=>s.toLowerCase().replace(/œ/g,'oe').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const q=normalize(query.trim());
 const aliases={cubitus:'ulna',perone:'fibula',coeur:'coeur',omoplate:'scapula'};
 const term=aliases[q] || q;
 const matches=Object.entries(anatomyPlates).flatMap(([key,p])=>p.hotspots.map((s,index)=>({key,index,label:s.label,role:s.role}))).filter(s=>normalize(s.label+' '+s.role).includes(term) || normalize(s.label).includes(q));
 document.getElementById('atlasSearchResults').innerHTML=!q?'':matches.length?matches.map(s=>`<button class="secondary" onclick="findAtlasSpot('${s.key}',${s.index})">${s.label}</button>`).join(''):'<p>Aucun nom trouvé.</p>';
}
function findAtlasSpot(key,index){selectAnatomyPlate(key);const button=document.querySelectorAll('#anatomyStage .anatomy-label')[index];button.scrollIntoView({block:'center'});button.focus();pinAnatomyTooltip(key,index,button);}
const careConsultations=[
 ['checkup','Visite de contrôle','Ancienne plaie, pansement ou immobilisation','« Depuis les derniers soins, qu’est-ce qui a changé ? »',['Demander quels gestes ont été joués lors de la première visite.','Observer l’évolution décrite, sans annoncer une cicatrisation automatique.','Vérifier douleur, pansement et signes nouveaux.'],'« Je vais reprendre seulement ce qui mérite un contrôle aujourd’hui. »'],
 ['fever','Fièvre / frissons','Température ressentie, fatigue et évolution','« Depuis quand vous sentez-vous fiévreux ? »',['Observer frissons, sueurs et état général.','Demander depuis quand et ce qui accompagne la fièvre.','Ne pas attribuer une cause sur le seul signe de fièvre.'],'« Décrivez-moi ce qui accompagne ces frissons. »'],
 ['cough','Toux persistante','Toux, souffle et récit du patient','« Depuis quand cette toux vous gêne-t-elle ? »',['Observer la respiration sans imposer de résultat.','Demander durée, gêne et contexte du travail ou du logement.','Si le souffle devient inquiétant, réévaluer avant de poursuivre.'],'« Est-ce que la toux vous empêche de parler ou de vous reposer ? »'],
 ['fatigue','Fatigue / faiblesse','Sommeil, travail, alimentation et signes visibles','« Qu’est-ce que cette fatigue vous empêche de faire ? »',['Demander sommeil, travail et évolution dans le RP.','Observer pâleur, réactions et signes décrits.','Ne pas conclure à une anémie sur la seule pâleur.'],'« Nous allons distinguer ce que vous ressentez de ce que je peux observer. »'],
 ['digestive','Troubles digestifs','Douleur décrite, repas et évolution','« Montrez-moi où vous ressentez la gêne. »',['Demander où, depuis quand et ce qui a changé.','Rechercher un contexte commun sans choisir automatiquement une intoxication.','Ne pas proposer un purgatif par défaut pour une douleur inexpliquée.'],'« D’autres personnes ont-elles ressenti la même chose ? »'],
 ['dental','Douleur dentaire','Consultation courte, sans extraction automatique','« Quelle dent ou quelle zone vous gêne ? »',['Demander durée, gêne pour manger et antécédents joués.','Observer seulement ce qui est accessible dans la scène.','Présenter l’examen comme une évaluation, pas une décision automatique d’extraction.'],'« Avant de parler d’un geste, je veux comprendre ce qui vous gêne. »']
];
careConsultations.forEach(([id,title,desc,question,observe,phrase])=>{
 flows[id]={title,urgency:'serious',steps:[
  {title:'État du patient',do:['Vérifier réactions, respiration et signes visibles avant les questions.'],say:['« Vous pouvez me dire ce qui vous amène aujourd’hui ? »'],choices:flows.gunshot.steps[0].choices.map(x=>({label:x.label,set:{...x.set}}))},
  {title:'Comprendre la demande',do:observe,say:[question,phrase,'« Que souhaitez-vous que nous vérifiions en priorité ? »'],care:{material:['Linge propre si examen local'],assistant:'Écoutez le récit et préparez le matériel demandé, sans parler à la place du patient.'}},
  {title:'Évolution observée',do:['Choisir ce que le joueur décrit, pas un résultat déduit du soin.'],say:['« Par rapport au début de cette gêne, qu’est-ce qui a changé ? »','« Y a-t-il un signe nouveau que nous n’avons pas encore évoqué ? »','« Si vous ne savez pas encore, nous pouvons garder ce point en observation. »'],choices:[{label:'Stable / pas de signe nouveau décrit',set:{consultEvolution:'stable'}},{label:'Un signe s’aggrave ou apparaît',set:{consultEvolution:'worse'}},{label:'Pas encore assez d’informations',set:{consultEvolution:'unknown'}}]},
  {title:'Suite et consignes',do:['Reprendre les observations et expliquer ce qui reste incertain.','Convenir d’une nouvelle inspection ou d’une orientation selon la scène.','Si l’état change, utiliser la réévaluation ; ne pas annoncer une guérison.'],say:[phrase,'« Quel point souhaitez-vous que je réexplique avant la suite ? »','« Prévenez-moi si de nouveaux signes apparaissent dans la scène. »']}
 ]};
 sceneEndings[id]=['Bilan des observations réellement jouées.',phrase,'Convenir d’un suivi RP adapté aux signes, sans ordonnance ni guérison automatique.','Signe nouveau, aggravation ou difficulté à répondre / respirer.'];
});
// Add uncertain observations, without turning unknown into a mild result.
for(const index of [2,3,4])flows.horse.steps[index].choices.push({label:'Non évalué / impossible à déterminer',set:{[{2:'horseArea',3:'horsePain',4:'horseVisible'}[index]]:'unknown'}});
flows.drowning.steps[0].choices.push({label:'Impossible à évaluer',set:{breathing:'unknown'}});
flows.head.steps[0].choices.push({label:'Impossible à évaluer',set:{headState:'unknown'}});
flows.poison.steps[0].choices.push({label:'Impossible à évaluer',set:{poisonState:'unknown'}});
flows.minor.steps[2].choices.push({label:'Plaie trop sale / doute sur la profondeur',set:{needsSuture:'avoid'}});
const careMaterials={
 gunshot:{4:['Compresses','Linge propre','Bandage'],5:['Linge propre pour examen'],9:['Aiguille et fil si fermeture retenue','Compresses','Pince','Ciseaux'],10:['Compresses','Bandage']},
 knife:{4:['Compresses','Linge propre'],5:['Compresses','Antiseptique prévu'],8:['Aiguille et fil si fermeture retenue','Compresses'],9:['Compresses','Bandage']},
 minor:{0:['Linge propre'],1:['Compresses selon le soin local'],3:['Aiguille et fil si fermeture retenue','Compresses'],4:['Petit bandage si nécessaire']},
 drowning:{0:['Linge sec / couverture'],1:['Espace dégagé pour le geste RP si justifié'],2:['Couverture','Linge sec']},
 head:{2:['Linge propre'],4:['Compresses et pansement si petite plaie']},
 burn:{0:['Eau fraîche si disponible dans la scène'],1:['Linge propre'],2:['Pansement protecteur']},
 fracture:{3:['Linge propre'],4:['Attelle','Bandages','Tissu rembourré']}
};
Object.entries(careMaterials).forEach(([id,steps])=>Object.entries(steps).forEach(([index,material])=>{flows[id].steps[index].care={...flows[id].steps[index].care,material};}));
Object.values(flows).forEach(flow=>flow.steps.forEach(step=>{
 step.care={...step.care};
 if(step.material)step.care.material=step.material;
 if(step.med)step.care.products=step.med;
 if(!step.care.assistant)step.care.assistant='Restez auprès du patient et annoncez tout changement de ses réactions pendant cette étape.';
}));
Object.values(surgeries).forEach(s=>s.steps.forEach(step=>{step.care={...step.care,products:step.meds || [],assistant:step.recovery?'Restez auprès de lui ; le réveil se joue, il n’est pas déclenché par l’étape.':'Préparez seulement les instruments demandés et gardez les réactions sous observation.'};}));

function careMaterialForStep(step,kind){
 let items=[...(step.care?.material || [])];
 if(currentFlow==='animal'&&step.dynamicAnimal==='clean')items=animalIsVenom()?['Linge propre','Protection simple']:animalHasWound()?items:[];
 if(currentFlow==='animal'&&step.dynamicAnimal==='protect'&&answers.animalDepth==='crush'&&['arm','hand','leg','foot'].includes(answers.animalArea))items.push('Attelle ou écharpe adaptée','Tissu rembourré');
 if(step.dynamicSuture)items=answers.needsSuture===true?['Aiguille et fil','Pince','Ciseaux','Compresses']:[];
 if(step.dynamicUnknownBleeding)items=['major','minor'].includes(answers.unknownBleeding)?['Compresses','Linge propre','Bandage']:[];
 if(step.dynamic&&currentFlow==='gunshot'&&answers.bullet==='in')items=['Forceps uniquement si projectile accessible','Compresses'];
 if(step.dynamicHorseCare){
  items=answers.horseVisible==='deformity'||answers.horseMove==='none'?['Attelle','Bandage','Tissu rembourré']:answers.horseVisible==='wound'?['Compresses','Antiseptique prévu','Petit pansement']:['bruise','swelling'].includes(answers.horseVisible)?['Linge frais','Bandage de soutien si utile']:[];
 }
 if(step.dynamicFightCare)items=answers.fightIssue==='cut'?['Compresses','Antiseptique prévu','Pansement']:answers.fightIssue==='bruise'?['Linge frais']:[];
 if(step.dynamicBurn)items=answers.burnSeverity==='airway'?[]:['Eau fraîche disponible','Linge propre','Pansement protecteur'];
 const products=step.care?.products || [];
 if(products.some(p=>/morphine/i.test(p[0]))&&!careProductBlocked()&&answers.rpPain==='strong')items.push('Seringue uniquement si morphine retenue');
 return [...new Set(items)];
}
const surgicalEquipment={
 amputation:{1:['Linge et dispositif prévu pour anesthésie','Compresses'],2:['Scalpel','Scie chirurgicale','Pinces','Compresses'],3:['Fils de ligature','Pinces','Compresses'],4:['Aiguille et fil si fermeture adaptée','Pansement']},
 major_bleeding:{0:['Compresses','Linge propre'],2:['Compresses','Pinces'],3:['Fils de ligature','Pinces','Compresses'],4:['Pansement','Fil si fermeture adaptée']},
 deep_bullet:{1:['Dispositif prévu pour anesthésie'],2:['Scalpel','Pinces','Compresses'],3:['Forceps uniquement si accessible','Compresses'],4:['Compresses','Antiseptique prévu','Fil si fermeture adaptée','Pansement']},
 abdominal:{0:['Compresses'],1:['Dispositif prévu pour anesthésie'],2:['Scalpel','Pinces','Compresses'],3:['Instruments spécialisés selon l’acte RP retenu','Compresses','Fils de ligature'],4:['Fil si fermeture adaptée','Pansement']},
 trepanation:{1:['Dispositif prévu pour anesthésie'],2:['Scalpel','Compresses'],3:['Trépan dans une scène spécialisée exceptionnelle','Compresses'],4:['Fil si fermeture adaptée','Pansement']},
 infected_wound:{0:['Linge propre'],2:['Scalpel','Pinces','Compresses','Antiseptique prévu'],3:['Compresses','Pansement adapté au drainage'],4:['Matériel d’inspection et de renouvellement du pansement']}
};
Object.entries(surgicalEquipment).forEach(([id,steps])=>Object.entries(steps).forEach(([index,material])=>surgeries[id].steps[index].care.material=material));
careConsultations.forEach(([id])=>flows[id].steps.splice(1,0,{title:'Priorités avant la consultation',dynamicConscious:true,care:{assistant:'Observez ses réactions et sa respiration, sans attendre un récit complet.'}}));

const extraEquipment=[
 ['Thermomètre clinique','Instrument de mesure de température, sans lecture inventée.','Présenter l’instrument et demander quel résultat le joueur souhaite jouer.'],
 ['Stéthoscope','Instrument d’écoute du thorax.','Annoncer l’écoute, puis demander les éléments joués plutôt que déclarer une maladie.'],
 ['Ciseaux à pansement','Ciseaux pour couper le tissu des soins.','Préparer la bande à la bonne longueur et annoncer le retrait d’un pansement.'],
 ['Bassin / cuvette','Récipient de préparation et de nettoyage.','Poser le bassin près du linge, sans mélanger des produits au hasard.'],
 ['Écharpe de soutien','Tissu soutenant un bras dans la scène.','Préparer le tissu sans forcer le membre douloureux.'],
 ['Brancard','Support de transport manipulé par plusieurs personnes.','Répartir les rôles et annoncer le départ, sans faire marcher un blessé par défaut.'],
 ['Couverture','Protection contre le froid pendant l’attente.','Déplier la couverture et garder les réactions visibles.'],
 ['Flacon étiqueté','Récipient dont le contenu doit être identifié.','Lire l’étiquette avec le pharmacien ; ne pas reconnaître le contenu à la seule odeur.'],
 ['Sac de terrain','Sac contenant le nécessaire choisi avant le départ.','Nommer ce qui est réellement disponible, puis demander un renfort pour le reste.'],
 ['Linge de transport','Tissu propre protégeant matériel et objets.','Envelopper séparément ce qui doit rester propre.'],
 ['Lampe de cabinet','Éclairage pour un examen visible.','Déplacer la lumière sans rapprocher une flamme d’un produit volatil.'],
 ['Boîte à instruments','Boîte de rangement, pas une garantie de stérilité.','Ouvrir et vérifier les pièces disponibles avant le geste.']
];
extraEquipment.forEach(([name,desc,use])=>equipmentLexicon.push({name,desc,use,tags:name+' préparation geste transport consultation'}));
const extraSigns=[
 ['Frissons','Tremblements décrits ou visibles.','Observer leur présence et demander depuis quand ; la fièvre n’a pas une cause unique.'],
 ['Sueurs inhabituelles','Vêtements humides ou transpiration décrite.','Distinguer ce qui est visible de la sensation rapportée ; demander le contexte.'],
 ['Raideur','Gêne ou limitation décrite lors d’un mouvement.','Ne pas forcer un mouvement pour obtenir un signe ; demander la zone et l’évolution.'],
 ['Gonflement','Augmentation de volume d’une zone visible dans le RP.','Décrire la zone, son évolution et les autres signes, sans diagnostic automatique.'],
 ['Faiblesse','Difficulté rapportée à effectuer une action habituelle.','Préciser ce que le joueur peut faire, sans imposer une incapacité.'],
 ['Vision modifiée','Trouble visuel décrit par le joueur, non lisible sur son visage.','Demander ce qui paraît différent et le contexte du choc ou de la gêne.'],
 ['Toux','Toux jouée ou rapportée.','Demander durée et gêne respiratoire ; aucun germe n’est identifié par ce seul signe.'],
 ['Soif inhabituelle','Sensation rapportée par le joueur.','Demander évolution et contexte, sans proposer une boisson à un patient qui ne peut avaler.'],
 ['Douleur dentaire','Douleur décrite près d’une dent ou de la mâchoire.','Faire préciser la zone ; l’extraction n’est pas une conclusion automatique.'],
 ['Engourdissement','Sensation décrite de toucher diminué ou de fourmillements.','Demander la zone et les changements sans imposer un résultat au test.']
];
extraSigns.forEach(([name,desc,rp])=>symptomLexicon.push({name,desc,rp,tags:name+' observation décrit évolution'}));
lexique.forEach(item=>{item.availability='Mention historique ne signifie pas disponibilité locale. Faire confirmer le produit, la préparation et l’approvisionnement dans le RP.';});
const authoredCarePhrases={
 gunshot:{4:['« Gardez ce linge en place pendant que je vérifie le saignement. »','« Est-ce que vous vous sentez plus faible depuis la blessure ? »','« Je m’occupe d’abord du sang, nous parlerons du projectile ensuite. »'],5:['« Je regarde ce qui est visible, sans fouiller dans la plaie. »','« Savez-vous si la balle est ressortie, ou personne n’a pu le vérifier ? »','« Je vais vous expliquer ce que je peux réellement observer. »'],10:['« Je protège la plaie. Dites-moi si ce bandage tire quelque part. »','« Le pansement est posé ; je revérifie votre état avant la suite. »','« Nous garderons cette zone sous observation, même après ces soins. »']},
 knife:{5:['« Le contact du linge peut vous gêner ; dites-moi où cela tire. »','« Je nettoie autour de la plaie avant de décider de la fermeture. »','« Je prépare le linge propre ; nous ne fermerons pas sans avoir examiné la plaie. »']},
 fracture:{4:['« Je soutiens le membre avant de mettre le support. »','« Dites-moi si les doigts deviennent engourdis pendant que je le protège. »','« Nous allons éviter les mouvements forcés, pas tester votre courage. »']},
 head:{2:['« Depuis le choc, avez-vous remarqué quelque chose de différent ? »','« Répondez simplement : je veux comprendre ce qui a changé. »','« Nous n’allons pas vous relever pour vérifier que tout va bien. »']},
 burn:{2:['« Je protège la zone sans tirer sur ce qui adhère à la peau. »','« Dites-moi si le contact vous gêne davantage à un endroit. »','« Nous regarderons aussi votre état général, pas seulement la peau. »']}
};
Object.entries(authoredCarePhrases).forEach(([id,steps])=>Object.entries(steps).forEach(([index,say])=>flows[id].steps[index].say=say));
const careAssistantTasks={
 unknown:{1:'Observez la poitrine et annoncez tout changement de respiration.',3:'Gardez les compresses en place si un saignement a été observé.',5:'Demandez à un témoin ce qu’il a vu sans interrompre la surveillance.'},
 gunshot:{4:'Gardez le linge en place et annoncez si le saignement change.',5:'Approchez l’éclairage sans toucher ni explorer la plaie.',9:'Préparez fil, aiguille et compresses seulement si la fermeture a été retenue.',10:'Préparez la bande et demandez au patient si elle le gêne.'},
 knife:{4:'Gardez les compresses disponibles et annoncez tout changement.',5:'Préparez un linge propre et le produit confirmé pour le nettoyage.',8:'Préparez fil et compresses si des points ont été retenus.',9:'Présentez le pansement et restez attentif aux réactions.'},
 horse:{5:'Demandez les sensations décrites sans forcer le membre.',6:'Préparez le soutien demandé ; n’annoncez pas une fracture à la place du médecin.'},
 fracture:{3:'Écoutez ce que le patient décrit au niveau des doigts ou des orteils.',4:'Préparez l’attelle et le tissu rembourré sans forcer la position.'},
 drowning:{0:'Préparez un linge sec et une couverture pendant l’observation.',2:'Gardez la couverture prête et annoncez toute modification de la respiration.'},
 burn:{0:'Écartez le matériel du feu ou des produits volatils.',2:'Préparez le linge protecteur sans arracher ce qui adhère.'}
};
Object.entries(careAssistantTasks).forEach(([id,steps])=>Object.entries(steps).forEach(([index,assistant])=>flows[id].steps[index].care.assistant=assistant));
document.addEventListener('DOMContentLoaded',()=>{
 const grid=document.querySelector('#cases .case-grid');
 const title=document.createElement('h3');title.className='consultations-heading';title.textContent='Consultations et suivi';grid.after(title);
 const cards=document.createElement('div');cards.className='case-grid';cards.innerHTML=careConsultations.map(([id,title,desc])=>`<button class="case" onclick="start('${id}')"><strong>${title}</strong><span class="muted">${desc}</span></button>`).join('');title.after(cards);
 document.addEventListener('click',event=>{
  const button=event.target.closest('[onclick]');if(!button)return;
  const code=button.getAttribute('onclick');
  const leaving=/^(goHome|showCases|showSurgery|showStories|showAtlas|showLexique|start|openSurgery)\(/.test(code) || code==='prev()'&&!flowHistory.length || code==='prevSurgery()'&&surgeryStepIndex===0;
  const running=(!document.getElementById('flow').classList.contains('hidden')&&!interventionEnded)||(!document.getElementById('surgeryFlow').classList.contains('hidden')&&!surgeryEnded);
  if(leaving&&running&&!confirm('Quitter ce parcours ? Ses réponses temporaires seront effacées.')){event.preventDefault();event.stopImmediatePropagation();}
 },true);
});

function finalizeCareLayout(root){
 // Keep the first actions, gestures and speech together before choices and optional detail.
 const gesture=root.querySelector(':scope > .rp-gesture'),dialogue=root.querySelector(':scope > .rp-dialogue');
 const action=[...root.querySelectorAll(':scope > .section')].find(s=>s.querySelector('ul')&&!s.querySelector('.med-item,.compact-med')&&!s.querySelector('.choices')&&!/Matériel/.test(s.querySelector('h3')?.textContent || ''));
 if(action&&gesture&&dialogue){action.after(gesture);gesture.after(dialogue);}
 if(answers.latestBreathing==='no'||answers.latestBreathing==='weak'||answers.latestBleeding==='major'||answers.latestState==='unresponsive'){
  const warning=document.createElement('div');warning.className='route-note current-warning';warning.textContent='Dernière observation inquiétante : suspendre le soin non prioritaire, réévaluer et organiser du renfort. Le passage à l’étape suivante ne signifie pas une stabilisation.';
  const toolbar=root.querySelector(':scope > .scene-tools');if(toolbar)toolbar.after(warning);
 }
 const fields=root.querySelector('.rp-context-fields');
 if(fields){
  const label=document.createElement('label');label.textContent='Moyens';
  const select=document.createElement('select');select.dataset.rpContext='resources';
  [['','Non précisés'],['ready','Matériel disponible'],['limited','Moyens limités']].forEach(([value,text])=>{const option=new Option(text,value,value===rpContext.resources,value===rpContext.resources);select.append(option);});
  select.addEventListener('change',()=>setRpContext('resources',select.value,activeRouteKind==='surgery'?'surgery':'flow'));label.append(select);fields.querySelector('button').before(label);
 }
 root.querySelectorAll('.med-item').forEach(card=>{
  const grid=card.querySelector('.med'),composition=[...grid?.children || []].find(c=>c.querySelector('strong')?.textContent==='Composition'),context=card.querySelector('.product-context');
  if(composition||context){const details=document.createElement('details');details.className='product-details';const summary=document.createElement('summary');summary.textContent='Composition et repère du produit';details.append(summary);if(composition)details.append(composition);if(context)details.append(context);card.append(details);}
 });
 root.querySelectorAll(':scope > .route-links,:scope > .assistant-note').forEach(note=>{const nav=root.querySelector(':scope > .nav');if(nav)nav.before(note);});
 root.querySelectorAll(':scope > .section').forEach(panel=>{if(panel.querySelector('h3')?.textContent==='Matériel'){const details=document.createElement('details');details.className='inline-material';const summary=document.createElement('summary');summary.textContent='Matériel de cette étape';details.append(summary,...panel.querySelectorAll('ul'));panel.replaceWith(details);}});
 // Keep all authored information; change its placement rather than hide it.
 if(action&&dialogue){
  const layout=document.createElement('div');layout.className='care-step-layout';
  const speech=document.createElement('div');speech.className='care-step-speech';
  action.before(layout);layout.append(action,speech);if(gesture)speech.append(gesture);speech.append(dialogue);
 }
 const tools=root.querySelector(':scope > .scene-tools'),context=root.querySelector(':scope > .rp-context');
 if(tools&&context){const strip=document.createElement('div');strip.className='care-control-strip';tools.before(strip);strip.append(tools,context);}
}

// Keep anatomical branch values stable; the side is a separate observation.
for(const [id,key] of [['gunshot','gunArea'],['knife','knifeArea'],['horse','horseArea']]){
 const step=flows[id].steps.find(s=>s.choices?.some(c=>Object.hasOwn(c.set,key)));
 step.choices=step.choices.flatMap(choice=>{
  const area=choice.set[key];
  const names={arm:'Bras / épaule',leg:id==='horse'?'Jambe / cheville':'Jambe',limb:'Membre',ribs:'Côtes / poitrine'};
  if(!names[area])return [{...choice,set:{...choice.set,[`${key}Side`]:null}}];
  const zones=area==='limb'?[['arm','Bras'],['leg','Jambe']]:[[area,names[area]]];
  return zones.flatMap(([zone,label])=>[
   {label:`${label} : gauche`,set:{...choice.set,[`${key}Side`]:'left',[`${key}Part`]:zone}},
   {label:`${label} : droite`,set:{...choice.set,[`${key}Side`]:'right',[`${key}Part`]:zone}},
   {label:`${label} : côté non précisé`,set:{...choice.set,[`${key}Side`]:null,[`${key}Part`]:zone}}
  ]);
 });
}
for(const [id,index,key] of [['fracture',3,'fractureArea'],['minor',0,'minorArea']]){
 flows[id].steps[index].choices=['Bras','Jambe','Main','Pied'].flatMap((label,i)=>['left','right'].map(side=>({label:`${label} : ${side==='left'?'gauche':'droite'}`,set:{[key]:['arm','leg','hand','foot'][i],[`${key}Side`]:side}})));
 flows[id].steps[index].choices.push({label:'Autre zone / non précisée',set:{[key]:'unknown',[`${key}Side`]:null}});
}
