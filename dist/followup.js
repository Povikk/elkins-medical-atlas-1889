// Short, transient follow-up routes. No appointments or patient records are saved.
const followupCommonSigns=['Douleur diminuée','Douleur persistante','Douleur aggravée'];
const followupWoundSigns=['Plaie propre, cicatrisation en cours','Rougeur autour de la plaie','Gonflement','Écoulement constaté','Saignement repris'];
const followupTypes={
 sutures:{title:'Plaie suturée',intro:'Contrôler la plaie, le pansement et les points.',checks:['Observer les bords de la plaie et l’état des points.','Demander comment la douleur a évolué depuis la suture.','Le retrait dépend de la cicatrisation constatée, pas du seul délai écoulé.'],signs:[...followupCommonSigns,...followupWoundSigns,'Points en place','Point desserré / rompu'],care:['Pansement renouvelé','Points conservés','Points retirés','Retrait partiel des points','Repos de la zone conseillé','Nouveau contrôle convenu']},
 wound:{title:'Plaie / morsure',intro:'Vérifier la cicatrisation et renouveler le soin local.',checks:['Observer la plaie et les traces sur le pansement.','Demander s’il existe une douleur nouvelle ou de la fièvre.','Pour une morsure, reprendre les constatations et l’évolution, sans supposer que l’antiseptique écarte tout risque.'],signs:[...followupCommonSigns,...followupWoundSigns,'Fièvre rapportée'],care:['Pansement renouvelé','Protection de la plaie renouvelée','Repos de la zone conseillé','Nouvel examen approfondi réalisé','Nouveau contrôle convenu']},
 joint:{title:'Fracture / luxation',intro:'Contrôler le membre et son maintien sans forcer les mouvements.',checks:['Vérifier l’état de l’attelle ou de l’écharpe et la gêne qu’elle occasionne.','Observer les extrémités et demander s’il existe un engourdissement.','Ne pas conclure à la guérison parce que la douleur a diminué.'],signs:[...followupCommonSigns,'Gonflement diminué','Gonflement persistant','Engourdissement rapporté','Extrémité froide / pâle','Maintien inconfortable','Mouvement encore limité'],care:['Attelle contrôlée','Écharpe contrôlée','Maintien ajusté','Soutien renouvelé','Sensibilité et extrémités revérifiées','Repos du membre conseillé','Nouveau contrôle convenu']},
 bruise:{title:'Contusion / coup de sabot',intro:'Comparer le bleu, le gonflement et la douleur depuis le choc.',checks:['Comparer l’aspect du bleu et du gonflement.','Reprendre la douleur et la gêne dans les activités.','Après un choc à la tête, au thorax ou à l’abdomen, vérifier aussi les signes nouveaux, pas seulement la peau.'],signs:[...followupCommonSigns,'Bleu en diminution','Gonflement diminué','Gonflement persistant','Peau intacte','Plaie constatée','Malaise rapporté','Gêne respiratoire'],care:['Linge frais appliqué','Baume à l’arnica appliqué sur peau intacte','Repos de la zone conseillé','Nouvel examen approfondi réalisé','Nouveau contrôle convenu']},
 surgery:{title:'Après chirurgie',intro:'Contrôler l’état général, la plaie opératoire et le pansement.',checks:['Demander l’évolution depuis l’opération : douleur, sommeil, appétit et gêne nouvelle.','Observer la plaie opératoire, le pansement et les points présents.','Une aggravation ou une fièvre demande une nouvelle évaluation, pas seulement un changement de pansement.'],signs:[...followupCommonSigns,...followupWoundSigns,'Fièvre rapportée','Fatigue persistante','Points en place'],care:['Pansement renouvelé','Points conservés','Points retirés','Retrait partiel des points','Repos conseillé','Nouvel examen approfondi réalisé','Nouveau contrôle convenu']}
};
// Reuse the actual intervention catalogue, with authored follow-up content per motif.
const followupRouteSpecs={
 strangulation:{intro:'Contrôler les suites de la compression du cou et les signes retardés.',checks:['Comparer voix, gêne pour avaler, douleur et aspect du cou depuis le premier examen.','Observer les réactions et le souffle ; reprendre les malaises et la confusion rapportés.','Un changement de voix, une gêne respiratoire ou un gonflement demande un examen urgent, même sans marque visible.'],signs:['Voix habituelle','Voix changée','Déglutition sans gêne rapportée','Gêne pour avaler','Souffle sans gêne rapportée','Gêne respiratoire','Gonflement du cou','Douleur du cou persistante','Malaise rapporté','Confusion rapportée'],care:['Cou réexaminé','Voix et déglutition réévaluées','Respiration réévaluée','Consignes sur les signes retardés réexpliquées','Nouvel examen urgent organisé','Nouveau contrôle convenu']},
 fluidLoss:{intro:'Revoir la faiblesse, les pertes et le traitement réellement reçu.',checks:['Reprendre le motif : perte de liquides ou anémie ; noter le traitement reçu.','Comparer soif, boissons tolérées, fatigue, réactions et souffle.','Rechercher un saignement ou un malaise nouveau ; ne pas supposer une correction immédiate par le fer.'],signs:['Faiblesse diminuée','Faiblesse aggravée','Soif persistante','Boissons tolérées','Vomissements persistants','Gêne respiratoire','Saignement repris'],care:['État général réévalué','Pertes de liquides revérifiées','Pertes de sang revérifiées','Traitement rapporté revérifié','Repos conseillé','Nouveau contrôle convenu']},
 gunshot:{base:'wound',intro:'Contrôler les zones touchées, les plaies et la fonction du membre.',checks:['Reprendre chaque zone blessée, le type d’impact et le soin initial rapporté.','Vérifier douleur, pansement, sensibilité et gêne du membre ; ne pas supposer qu’un projectile a été extrait.','Observer les points présents et les signes nouveaux.'],signs:['Points en place','Engourdissement rapporté','Mouvement encore limité'],care:['Points conservés','Points retirés','Retrait partiel des points','Sensibilité et extrémités revérifiées']},
 knife:{base:'wound',intro:'Revoir la coupure, les points présents et la gêne locale.',checks:['Reprendre la localisation et les soins de la coupure.','Observer les bords, le pansement et les points présents.','Demander si une gêne profonde ou un saignement a repris.'],signs:['Points en place','Mouvement encore limité'],care:['Points conservés','Points retirés','Retrait partiel des points']},
 animal:{base:'wound',intro:'Reprendre morsures, griffures ou chocs, zone par zone.',checks:['Reprendre l’animal rapporté et le type de blessure, sans demander son comportement.','Observer chaque plaie et la fonction des zones touchées ; comparer douleur et gonflement.','Une morsure reste à surveiller même après le nettoyage ; noter tout signe nouveau.'],signs:['Mouvement encore limité','Engourdissement rapporté'],care:['Soutien renouvelé','Sensibilité et extrémités revérifiées']},
 hoof:{base:'bruise',intro:'Revoir le bleu, les plaies et la gêne après le coup.',care:['Pansement renouvelé','Maintien ajusté']},
 horse:{base:'bruise',intro:'Contrôler les suites de la chute : membre, dos, tête ou plaie.',checks:['Reprendre toutes les zones atteintes lors de la chute et comparer la douleur.','Vérifier la gêne du membre et l’état de son soutien ; ne pas forcer une articulation déformée.','Demander s’il existe depuis la chute un malaise, une confusion ou une gêne respiratoire.'],signs:['Mouvement encore limité','Engourdissement rapporté','Confusion rapportée'],care:['Pansement renouvelé','Maintien ajusté','Sensibilité et extrémités revérifiées']},
 fight:{base:'bruise',intro:'Contrôler les contusions, coupures et douleurs après les coups.',checks:['Reprendre les zones frappées, les coupures et les soins initiaux.','Comparer douleur, gonflement et gêne ; vérifier le soutien d’un membre blessé.','Pour la tête ou les côtes, demander s’il existe une confusion ou une gêne respiratoire nouvelle.'],signs:['Mouvement encore limité','Confusion rapportée'],care:['Pansement renouvelé','Maintien ajusté']},
 fracture:{base:'joint',intro:'Revoir l’attelle, l’écharpe et la fonction du membre.'},
 minor:{base:'bruise',intro:'Contrôler la petite plaie, le bleu ou l’irritation.',checks:['Reprendre la petite blessure et le produit déjà appliqué.','Observer la peau et comparer la douleur ; petite blessure ne signifie pas guérison automatique.','Une plaie ouverte demande un soin de plaie distinct du baume pour un bleu.'],signs:['Plaie propre, cicatrisation en cours','Rougeur autour de la plaie','Écoulement constaté'],care:['Pansement renouvelé','Protection de la peau renouvelée']},
 head:{intro:'Reprendre douleur, réactions et signes nouveaux après le choc.',checks:['Demander comment ont évolué la douleur et les réactions depuis le choc.','Rechercher un malaise, une confusion, une somnolence ou des vomissements rapportés.','La disparition de la bosse ne suffit pas à conclure à la guérison.'],signs:[...followupCommonSigns,'Réactions habituelles','Confusion rapportée','Somnolence inhabituelle','Vomissements rapportés','Malaise rapporté','Plaie constatée'],care:['Réactions et orientation contrôlées','Plaie examinée','Pansement renouvelé','Repos conseillé','Nouvel examen approfondi réalisé','Nouveau contrôle convenu']},
 drowning:{intro:'Contrôler le souffle et la fatigue après l’asphyxie.',checks:['Demander comment ont évolué le souffle, la toux et la fatigue.','Observer les réactions et la respiration ; ne pas déduire la récupération du seul réveil.','Une gêne respiratoire ou une somnolence nouvelle demande une réévaluation prioritaire.'],signs:['Souffle sans gêne rapportée','Gêne respiratoire','Toux persistante','Fatigue persistante','Somnolence inhabituelle','Frissons persistants'],care:['Respiration réévaluée','Réactions contrôlées','Réchauffement effectué','Repos conseillé','Nouvel examen approfondi réalisé','Nouveau contrôle convenu']},
 burn:{intro:'Revoir la peau brûlée, la douleur et la protection.',checks:['Reprendre la localisation et les soins de la brûlure.','Observer la peau et les traces du pansement sans percer les cloques.','Demander s’il existe une douleur aggravée, une fièvre ou une gêne respiratoire.'],signs:[...followupCommonSigns,'Peau en cours de cicatrisation','Cloques présentes','Rougeur étendue','Écoulement constaté','Fièvre rapportée','Gêne respiratoire'],care:['Protection de la brûlure renouvelée','Pansement renouvelé','Repos de la zone conseillé','Nouvel examen approfondi réalisé','Nouveau contrôle convenu']},
 poison:{intro:'Revoir vigilance, souffle et effets persistants du produit.',checks:['Reprendre le produit rapporté et son évolution depuis les premiers soins, sans supposer une nouvelle prise.','Observer vigilance et respiration avant les questions détaillées.','Noter la somnolence et les nausées persistantes ; ne pas ajouter un opiacé de routine.'],signs:['Réactions habituelles','Somnolence inhabituelle','Confusion rapportée','Gêne respiratoire','Nausées persistantes','Fatigue persistante'],care:['Vigilance et respiration réévaluées','Surveillance prolongée effectuée','Produit rapporté revérifié avec le patient','Nouvel examen approfondi réalisé','Nouveau contrôle convenu']},
 checkup:{intro:'Reprendre un soin ou une gêne qui ne rentre pas dans les autres motifs.',checks:['Demander le motif initial, les soins reçus et ce qui a changé.','Noter la zone et les précisions dans le champ libre.','Choisir seulement les contrôles et les soins réellement effectués aujourd’hui.'],signs:['Amélioration rapportée','Gêne persistante','Aggravation rapportée','Nouveau signe rapporté'],care:['Examen local réalisé','Soin initial revérifié avec le patient','Consignes réexpliquées','Nouveau contrôle convenu']},
 fever:{intro:'Comparer la fièvre, les frissons et l’état général.',checks:['Comparer la température constatée et les frissons depuis la consultation.','Demander l’évolution de la fatigue et les symptômes nouveaux.','Reprendre le produit déjà reçu, sans annoncer une cause certaine de la fièvre.'],signs:['Fièvre diminuée','Fièvre persistante','Fièvre aggravée','Frissons persistants','Fatigue persistante','Amélioration rapportée'],care:['Température contrôlée','État général réévalué','Traitement rapporté revérifié','Consignes de repos réexpliquées','Nouveau contrôle convenu']},
 cough:{intro:'Comparer la toux et son retentissement sur le souffle.',checks:['Demander si la toux diminue et si elle gêne le sommeil ou la parole.','Observer la respiration et reprendre la gêne thoracique rapportée.','Noter une fièvre ou du sang rapporté, sans déduire une maladie du seul symptôme.'],signs:['Toux diminuée','Toux persistante','Toux aggravée','Gêne respiratoire','Fièvre rapportée','Sang craché rapporté','Sommeil perturbé'],care:['Respiration réévaluée','Thorax examiné','Traitement rapporté revérifié','Consignes de repos réexpliquées','Nouveau contrôle convenu']},
 fatigue:{intro:'Reprendre faiblesse, sommeil et évolution quotidienne.',checks:['Demander si le sommeil, l’appétit et les efforts habituels ont changé.','Comparer les réactions et la faiblesse décrite.','Reprendre un signe nouveau sans attribuer automatiquement la fatigue à une anémie.'],signs:['Énergie améliorée','Fatigue persistante','Faiblesse aggravée','Sommeil perturbé','Appétit diminué','Malaise rapporté'],care:['État général réévalué','Rythme de repos revu avec le patient','Traitement rapporté revérifié','Nouveau contrôle convenu']},
 digestive:{intro:'Reprendre douleur, appétit et troubles digestifs.',checks:['Comparer la douleur et sa localisation depuis la consultation.','Demander l’évolution des repas, vomissements et selles.','Une douleur aggravée ou du sang rapporté demande un nouvel examen, pas un purgatif automatique.'],signs:[...followupCommonSigns,'Nausées persistantes','Vomissements rapportés','Diarrhée persistante','Constipation persistante','Appétit amélioré','Sang rapporté dans les selles'],care:['Abdomen réexaminé','Traitement rapporté revérifié','Consignes réexpliquées','Nouvel examen approfondi réalisé','Nouveau contrôle convenu']},
 dental:{intro:'Contrôler la dent, la gencive ou les suites d’un soin dentaire.',checks:['Reprendre la dent ou la gencive concernée et le soin reçu.','Demander l’évolution de la douleur et de la gêne pour manger.','Observer saignement, gonflement et écoulement ; aucune extraction répétée par défaut.'],signs:[...followupCommonSigns,'Gonflement diminué','Gonflement persistant','Saignement repris','Écoulement constaté','Gêne pour manger'],care:['Dent et gencive examinées','Zone du soin dentaire contrôlée','Consignes réexpliquées','Nouvel examen approfondi réalisé','Nouveau contrôle convenu']}
};
const followupMenuKeys=[];
for(const [id,spec]of Object.entries(followupRouteSpecs)){
 const base=spec.base?followupTypes[spec.base]:null;
 if(!flows[id])throw new Error('Missing intervention for follow-up: '+id);
 followupTypes[id]={...base,...spec,sourceFlow:id,title:flows[id].title,group:careConsultations.some(([key])=>key===id)?'consult':'trauma',checks:spec.checks||base.checks,signs:[...new Set([...(base?.signs||[]),...(spec.signs||[])])],care:[...new Set([...(base?.care||[]),...(spec.care||[])])]};
 followupMenuKeys.push(id);
}
const followupSurgeryDetails={
 amputation:{checks:['Observer le moignon, la plaie, les points et les traces du pansement.','Demander douleur locale et sensations ressenties dans le membre absent.'],signs:['Douleur du moignon','Sensation dans le membre absent']},
 major_bleeding:{checks:['Rechercher un saignement repris et reprendre les malaises depuis le geste.','Comparer faiblesse et aspect du pansement.'],signs:['Faiblesse persistante','Malaise rapporté']},
 deep_bullet:{checks:['Reprendre la localisation et le devenir du projectile tels qu’ils ont été rapportés.','Vérifier sensibilité et gêne du membre ou de la zone opérée.'],signs:['Engourdissement rapporté','Mouvement encore limité']},
 abdominal:{checks:['Reprendre douleur abdominale, appétit et vomissements depuis l’opération.','Observer la plaie et demander toute gêne nouvelle.'],signs:['Nausées persistantes','Vomissements rapportés','Appétit diminué']},
 trepanation:{checks:['Comparer réactions, orientation et douleur à la tête.','Demander confusion, somnolence ou vomissements depuis le geste.'],signs:['Confusion rapportée','Somnolence inhabituelle','Vomissements rapportés']},
 infected_wound:{checks:['Comparer rougeur, écoulement, douleur et fièvre.','Contrôler la protection et le drainage décrit lors du soin initial.'],signs:['Écoulement persistant'],care:['Protection du drainage renouvelée']},
 open_fracture:{checks:['Observer la plaie et le soutien du membre.','Revérifier la sensibilité et l’aspect des extrémités sans forcer les mouvements.'],signs:['Engourdissement rapporté','Extrémité froide / pâle','Maintien inconfortable'],care:['Maintien ajusté','Sensibilité et extrémités revérifiées']},
 complex_wound:{checks:['Contrôler chaque zone déchirée et son pansement.','Comparer la gêne, la sensibilité et l’état des points présents.'],signs:['Mouvement encore limité']},
 deep_abscess:{checks:['Comparer douleur, fièvre et écoulement après le drainage.','Observer la protection et la zone drainée.'],signs:['Écoulement persistant'],care:['Protection du drainage renouvelée']},
 strangulated_hernia:{checks:['Reprendre douleur et gonflement de la région opérée.','Demander l’évolution des nausées, vomissements et troubles du transit depuis le geste.'],signs:['Nausées persistantes','Vomissements rapportés','Constipation persistante']},
 empyema:{checks:['Comparer le souffle et la douleur thoracique depuis le drainage.','Contrôler la plaie, la protection et l’écoulement rapporté.'],signs:['Gêne respiratoire','Toux persistante','Écoulement persistant'],care:['Respiration réévaluée','Protection du drainage renouvelée']},
 appendicitis:{checks:['Comparer douleur abdominale, appétit et vomissements après l’opération.','Observer la plaie opératoire et reprendre les troubles du transit rapportés.'],signs:['Appétit diminué','Nausées persistantes','Vomissements rapportés','Constipation persistante']}
};
for(const [id,route]of Object.entries(surgeries)){
 const detail=followupSurgeryDetails[id]||{checks:['Reprendre le geste initial rapporté et la zone opérée.','Comparer la fonction de cette zone et les symptômes nouveaux.']};
 const key='operation_'+id,base=followupTypes.surgery;
 followupTypes[key]={...base,title:route.title,group:'surgery',intro:'Contrôle après '+route.title.toLowerCase()+'.',checks:[...detail.checks,base.checks[2]],signs:[...new Set([...base.signs,...(detail.signs||[])])],care:[...new Set([...base.care,...(detail.care||[])])]};
 followupMenuKeys.push(key);
}
for(const [key,type]of Object.entries(followupTypes)){
 flows['followup_'+key]={title:'Suivi : '+type.title,urgency:'light',followup:key,steps:[{title:'Évolution constatée',dynamicFollowup:'findings'},{title:'Soins effectués et consignes',dynamicFollowup:'care'}]};
}
function showFollowup(){
 show('followup');
 document.getElementById('followup').innerHTML=`<div class="topbar"><h2>Suivi du patient</h2></div><p class="muted">Reprendre le motif de l’intervention ou de la consultation. Deux étapes courtes, sans recommencer les soins initiaux.</p><div class="followup-filters" role="group" aria-label="Catégories de suivi">${[['trauma','Blessures / accidents'],['consult','Consultations'],['surgery','Après chirurgie']].map(([key,label])=>`<button type="button" class="secondary" data-followup-group="${key}" aria-pressed="${key==='trauma'}" onclick="filterFollowup('${key}')">${label}</button>`).join('')}</div><div class="followup-categories">${orderedFollowupKeys().map(key=>{const type=followupTypes[key];return `<button type="button" class="card" data-followup-category="${type.group}" ${routeAccent(key)?`data-route-accent="${routeAccent(key)}"`:''} ${type.group==='trauma'?'':'hidden'} onclick="startFollowup('${key}')"><h3>${reportEscape(type.title)}</h3><p>${reportEscape(type.intro)}</p></button>`;}).join('')}</div>`;
}
function filterFollowup(group){
 if(!['trauma','consult','surgery'].includes(group))return;
 document.querySelectorAll('[data-followup-group]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.followupGroup===group)));
 document.querySelectorAll('[data-followup-category]').forEach(button=>{button.hidden=button.dataset.followupCategory!==group;});
}
function followupType(){return followupTypes[flows[currentFlow]?.followup];}
function followupZoneSource(type=followupType()){
 const route=flows[type?.sourceFlow];
 const step=route?.steps.find(s=>zoneKeyForStep(s));
 return step?{key:zoneKeyForStep(step),choices:step.choices}:null;
}
function startFollowup(key){
 if(!followupMenuKeys.includes(key))return;
 if(typeof capturePatientState==='function')capturePatientState();
 const prior=typeof patientSessions!=='undefined'?patientSessions.find(p=>p.number===activePatientNumber)?.state:null;
 const source=followupZoneSource(followupTypes[key]);
 let selected=[];
 if(source&&prior?.currentFlow===followupTypes[key].sourceFlow){
  const previous=prior.answers[source.key+'Selections']||source.choices.filter(c=>Object.entries(c.set).every(([k,v])=>prior.answers[k]===v));
  selected=previous.flatMap(c=>{
   const index=source.choices.findIndex(option=>Object.entries(option.set).every(([k,v])=>c.set[k]===v));
   return index<0?[]:[{index,label:source.choices[index].label,detail:c.detail||''}];
  });
 }
 start('followup_'+key);
 answers.followupZones=selected;
 render();
}
function followupZoneLabels(){return (answers.followupZones||[]).map(c=>c.label+(c.detail?' : '+c.detail:'')).join(' ; ');}
function toggleFollowupZone(index){
 const source=followupZoneSource(),choice=source?.choices[index];if(!choice)return;
 const exclusive=i=>['none','general','unknown'].includes(source.choices[i]?.set[source.key]);
 let selected=answers.followupZones||[];
 if(selected.some(c=>c.index===index))selected=selected.filter(c=>c.index!==index);
 else selected=exclusive(index)?[{index,label:choice.label}]:[...selected.filter(c=>!exclusive(c.index)),{index,label:choice.label}];
 careInvalidateFrom(0);
 answers.followupZones=selected;
 render();
}
function followupZonesMarkup(){
 const source=followupZoneSource(),selected=answers.followupZones||[];
 if(!source)return '';
 return `<details class="section followup-zones" open><summary><strong>Zones du suivi</strong> : ${selected.length?reportEscape(followupZoneLabels()):'sélectionner une ou plusieurs zones'}</summary><div class="followup-choices">${source.choices.map((choice,index)=>`<button type="button" class="secondary" aria-pressed="${selected.some(c=>c.index===index)}" onclick="toggleFollowupZone(${index})">${reportEscape(choice.label)}</button>`).join('')}</div></details>`;
}
function followupOptions(field){const type=followupType();return field==='findings'?type.signs:type.care;}
function toggleFollowupChoice(field,index){
 if(!['findings','care'].includes(field)||!Number.isInteger(index))return;
 const label=followupOptions(field)[index];if(!label)return;
 const key=field==='findings'?'followupFindings':'followupCare',selected=new Set(answers[key]||[]);
 if(selected.has(label))selected.delete(label);else selected.add(label);
 // Do not allow mutually exclusive observations or point decisions together.
 const exclusive=field==='findings'?[followupCommonSigns,['Gonflement diminué','Gonflement persistant'],['Peau intacte','Plaie constatée'],['Réactions habituelles','Confusion rapportée','Somnolence inhabituelle'],['Souffle sans gêne rapportée','Gêne respiratoire'],['Fièvre diminuée','Fièvre persistante','Fièvre aggravée'],['Toux diminuée','Toux persistante','Toux aggravée'],['Énergie améliorée','Fatigue persistante','Faiblesse aggravée'],['Amélioration rapportée','Aggravation rapportée'],['Appétit amélioré','Appétit diminué'],['Diarrhée persistante','Constipation persistante']]:[['Points conservés','Points retirés','Retrait partiel des points']];
 if(field==='findings'&&followupType()?.sourceFlow==='strangulation')exclusive.push(['Voix habituelle','Voix changée'],['Déglutition sans gêne rapportée','Gêne pour avaler']);
 if(selected.has(label))for(const group of exclusive)if(group.includes(label))for(const item of group)if(item!==label)selected.delete(item);
 if(field==='care'&&label.includes('arnica')&&selected.has(label)&&!(answers.followupFindings||[]).includes('Peau intacte'))return;
 const medication=field==='care'?answers.consultMedication:null;
 careInvalidateFrom(stepIndex);
 if(medication){answers.consultMedication=medication;careRegisterScope('consultMedication');}
 answers[key]=[...selected];
 if(field==='care')answers.followupNoCare=false;
 if(field==='findings'&&selected.has('Plaie constatée'))answers.followupCare=(answers.followupCare||[]).filter(x=>!x.includes('arnica'));
 render();
}
function followupSetNote(value){answers.followupNote=String(value).slice(0,240);}
function followupWarning(){return (answers.followupFindings||[]).some(x=>['Douleur aggravée','Saignement repris','Fièvre rapportée','Fièvre aggravée','Extrémité froide / pâle','Gêne respiratoire','Malaise rapporté','Confusion rapportée','Somnolence inhabituelle','Vomissements rapportés','Sang craché rapporté','Sang rapporté dans les selles','Faiblesse aggravée','Aggravation rapportée'].includes(x));}
function followupNext(){
 if(stepIndex===0&&(!(answers.followupFindings||[]).length||followupZoneSource()&&!(answers.followupZones||[]).length))return;
 if(stepIndex===1&&!(answers.followupCare||[]).length&&!answers.followupNoCare&&!answers.consultMedication)return;
 next();
}
function followupNoCare(){careInvalidateFrom(stepIndex);answers.followupNoCare=!answers.followupNoCare;answers.followupCare=[];render();}
function renderFollowup(capture=false){
 activeRouteKind='flow';const type=followupType(),step=flows[currentFlow].steps[stepIndex],field=step.dynamicFollowup;
 activeStepTitle=step.title;
 const chosen=answers[field==='findings'?'followupFindings':'followupCare']||[];
 const ready=field==='findings'?chosen.length&&(!followupZoneSource()||(answers.followupZones||[]).length):chosen.length||answers.followupNoCare||answers.consultMedication;
 let html=`<div class="topbar"><div><span class="badge">Suivi : ${type.title}</span><h2>${stepIndex+1} / 2 - ${step.title}</h2></div><button type="button" class="secondary" onclick="showFollowup()">Autre suivi</button></div><div class="progress"><div style="width:${(stepIndex+1)*50}%"></div></div>`;
 if(field==='findings')html+=followupZonesMarkup()+section('À contrôler',type.checks);
 else html+=`${followupZoneLabels()?`<div class="route-note"><strong>Zones du suivi :</strong> ${reportEscape(followupZoneLabels())}</div>`:''}<div class="route-note"><strong>Constatations :</strong> ${reportEscape((answers.followupFindings||[]).join(' · '))}</div><p class="muted">Cocher uniquement les soins réellement effectués. Plusieurs choix possibles.</p>`;
 if(followupWarning())html+='<div class="route-note">Signe inquiétant signalé : reprendre l’examen et les priorités du patient avant un soin de routine.</div>';
 html+=`<div class="section"><h3>${field==='findings'?'Ce que tu constates, plusieurs choix possibles':'Soins et consignes donnés'}</h3><div class="followup-choices">${followupOptions(field).map((label,index)=>{
 const blocked=label.includes('arnica')&&!(answers.followupFindings||[]).includes('Peau intacte');
 return `<button type="button" class="secondary" aria-pressed="${chosen.includes(label)}" onclick="toggleFollowupChoice('${field}',${index})" ${blocked?'disabled title="Constater une peau intacte avant de choisir ce soin"':''}>${reportEscape(label)}</button>`;
 }).join('')}</div>${field==='findings'?`<label class="followup-note">Zone / précision facultative<input maxlength="240" value="${reportEscape(answers.followupNote||'')}" placeholder="Ex. : épaule droite, contrôle après chute" oninput="followupSetNote(this.value)"></label>`:`<button type="button" class="secondary followup-no-care" aria-pressed="${!!answers.followupNoCare}" onclick="followupNoCare()">Examen seul, sans soin supplémentaire</button>`}</div>`;
 if(field==='care')html+=consultationProductsMarkup();
 html+=`<div class="nav"><button type="button" class="secondary" onclick="${stepIndex?'prev()':'showFollowup()'}">${stepIndex?'Précédent':'Motifs de suivi'}</button><button type="button" class="next" onclick="followupNext()" ${ready?'':'disabled'}>${stepIndex?'Terminer le suivi':'Soins et consignes'}</button></div>`;
 if(capture)return html;
 const root=document.getElementById('flow');root.classList.remove('condensed-workspace');root.innerHTML=html;
}
function followupEndingMarkup(){return `<div class="section scene-ending"><span class="badge">${reportEscape(flows[currentFlow].title)}</span><h2>Suivi terminé</h2>${followupWarning()?'<div class="route-note">Un signe inquiétant a été noté. Le récapitulatif ne confirme pas une guérison.</div>':''}${reportMarkup('flow')}<div class="nav"><button type="button" class="secondary" onclick="interventionEnded=false;render()">Revoir les soins</button><button type="button" class="next" onclick="showFollowup()">Autre suivi</button></div></div>`;}
