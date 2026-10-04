// Quick RP reference inspired by Effie's supplied tables, not a prescription engine.
let careMemoOpen=true;
let careMemoOnly=false;
const careMemoRows={
 unknown:['Réactions · respiration · saignement','Vérifier les priorités ; chercher la cause seulement après','Aucun produit systématique ; état vital d’abord','Cause inconnue ; ne pas déduire un diagnostic'],
 gunshot:['Entrée / sortie · sang · sensibilité du membre','Contrôler le saignement ; examiner sans fouiller ; protéger','Laudanum ou morphine si état compatible ; soin local adapté','Hémorragie · infection ; abdomen et thorax à réévaluer'],
 knife:['Profondeur · saignement · objet encore en place','Stabiliser ; inspecter ; traiter et protéger si approprié','Laudanum ou morphine si état compatible ; soin local adapté','Vaisseau / organe ; ne pas retirer un objet à l’aveugle'],
 fight:['Zone douloureuse · plaie · confusion · respiration','Chercher la lésion principale ; soin local ou réorientation','Soin local si pertinent ; antalgique non systématique','Choc crânien ou gêne respiratoire : réévaluer'],
 horse:['Tête / dos · douleur · déformation · sensibilité','Éviter les mouvements forcés ; inspecter ; soutenir le membre','Soulagement seulement après évaluation de l’état','Une chute ne signifie pas une simple contusion'],
 fracture:['Déformation · douleur · circulation · sensibilité','Soutenir et immobiliser ; réévaluer sans forcer','Antalgique facultatif ; anesthésie seulement si scène justifiée','Atteinte d’un nerf / vaisseau ; rechercher une plaie ouverte'],
 minor:['Profondeur · saletés visibles · gêne locale','Nettoyer si approprié ; couvrir ; donner les consignes','Préparation locale adaptée ; aucun opiacé automatique','Plaie profonde ou signe nouveau : changer d’évaluation'],
 drowning:['Respiration · réactions · froid','Priorité respiratoire ; méthode d’époque si nécessaire ; réchauffer','Aucun médicament spécifique : respiration d’abord','Absence de souffle / conscience inquiétante : renfort'],
 head:['Réactions · mémoire · vomissements · somnolence','Repos ; calme ; surveillance des réactions','Éviter de banaliser une sédation ; soin local si plaie','Une fin de geste ne garantit pas un réveil'],
 burn:['Étendue · profondeur · visage / fumée','Éloigner la cause ; refroidir raisonnablement ; protéger','Pansement protecteur ; antalgique seulement si état compatible','Visage / gêne respiratoire ; état général inquiétant'],
 poison:['Produit connu ? · heure · réactions · souffle','Identifier la situation ; surveiller ; soutenir la respiration','Pas de remède universel ni de nouvel opiacé automatique','Somnolence et respiration lente : priorité vitale'],
 checkup:['Demande · évolution · réactions · signes visibles','Écouter ; vérifier les priorités ; convenir de la suite','Seulement ce qui est réellement décidé dans la scène','Aucun diagnostic ni guérison déduits du contrôle'],
 fever:['Évolution · frissons · faiblesse · signes associés','Vérifier l’état ; écouter ; surveiller l’évolution','La fièvre seule ne choisit pas un médicament','Aggravation ou confusion : réévaluer ; cause non supposée'],
 cough:['Évolution · souffle · gêne · signes rapportés','Observer ; écouter ; convenir d’une inspection ou orientation','Pas d’opiacé automatique pour une toux','Respiration difficile ; ne pas conclure à une pneumonie'],
 fatigue:['Évolution · sommeil · faiblesse · contexte décrit','Vérifier les priorités ; rechercher les signes accessibles','Repos / suite selon la scène ; pas de tonique automatique','La fatigue seule ne suffit pas à expliquer la cause'],
 digestive:['Évolution · douleur · vomissements · signes rapportés','Écouter ; examiner selon le RP ; organiser la suite','Pas de remède universel déduit de la douleur','Aggravation / état vital : réévaluer avant de conclure'],
 dental:['Zone · gonflement · saignement · gêne décrite','Inspecter ; limiter le geste aux soins justifiés','Soulagement facultatif après évaluation ; soin local pertinent','Ne pas déduire une extraction ou une infection']
};
function careMemoData(kind){
 const surgery=kind==='surgery';let title=surgery?surgeries[currentSurgery].title:flows[currentFlow].title;
 let row=surgery?['Indication · conscience · souffle · saignement','Préparer assistants et matériel ; jouer l’acte justifié ; surveiller','Anesthésie seulement si justifiée ; surveillance continue','La fin du geste ne vaut ni réveil ni guérison']:careMemoRows[currentFlow];
 row=[...row];
 if(!surgery&&currentFlow==='gunshot'&&answers.gunArea==='abdomen'){title='Balle : abdomen';row=['Ventre · pâleur · réactions · vomissements','Repos ; surveillance ; orientation chirurgicale si justifiée','Anesthésie uniquement pour la chirurgie justifiée','Hémorragie / atteinte interne ; aucun produit ne répare la lésion'];}
 if(!surgery&&currentFlow==='gunshot'&&answers.gunArea==='chest'){title='Balle : thorax';row=['Souffle · sang craché · réactions','Limiter les mouvements ; surveiller ; organiser du renfort','Ne pas banaliser un opiacé si le souffle est inquiétant','Détresse respiratoire ; aucun médicament ne répare le poumon'];}
 if(!surgery&&currentFlow==='burn'&&answers.burnSeverity==='airway'){row[1]='Priorité au souffle ; réévaluer et organiser du renfort';row[2]='Aucun produit ne remplace le soutien respiratoire';}
 if(!surgery&&currentFlow==='animal'){
  if(answers.animalMultiplicity==='multiple')row[1]='Inspecter chaque plaie ; priorités ; nettoyer si adapté ; protéger';
  if(['deep','crush','unknown'].includes(answers.animalDepth))row[1]='Protéger ; demander un avis / renfort ; pas d’exploration ni de fermeture automatique';
  if(answers.animalBleeding==='unknown'&&!answers.latestBleeding)row[2]='Saignement non évalué : compléter les priorités avant un opiacé';
 }
 const opioidCase=!surgery&&['gunshot','knife','horse','fracture','burn','dental','animal'].includes(currentFlow)&&!(currentFlow==='burn'&&answers.burnSeverity==='airway')&&!(currentFlow==='animal'&&animalIsVenom());
 if(opioidCase&&careProductBlocked())row[2]='État à réévaluer avant un opiacé ; pas de produit oral si le patient ne peut pas répondre et avaler';
 else if(opioidCase&&['mild','unsafe'].includes(answers.rpPain))row[2]=answers.rpPain==='mild'?'Repos et soin local adapté ; pas d’opiacé systématique':'État vital d’abord ; suspendre le choix d’un opiacé';
 else if(opioidCase&&answers.rpPain==='moderate')row[2]='Laudanum seulement si le patient peut répondre et avaler ; soin local adapté';
 if(!surgery&&currentFlow==='animal')row=animalMemoRow(row);
 const breathing=answers.latestBreathing||answers.breathing||answers.unknownBreathing;
 if(['no','weak'].includes(breathing)||(answers.latestBleeding||answers.animalBleeding)==='major'||answers.latestState==='unresponsive')row[3]='Suspendre le soin non prioritaire ; réévaluer et organiser du renfort';
 return {title,row};
}
function careMemoMarkup(kind){
 const {title,row}=careMemoData(kind);
 return `<section class="care-memo" aria-label="Pense-bête du soin"><div class="care-memo-heading"><h3>Pense-bête d’Effie <small>${condensedEscape(title)}</small></h3>${compactMode?`<label><input type="checkbox" ${careMemoOnly?'checked':''} onchange="setCareMemoOnly(this.checked)"> Pense-bête seul</label>`:''}</div><div class="care-memo-row">${['Observer','Agir','Produits facultatifs','Danger / vigilance'].map((label,i)=>`<div class="care-memo-cell ${i===3?'care-memo-danger':''}"><h4>${label}</h4><p>${condensedEscape(row[i])}</p></div>`).join('')}</div><small class="care-memo-source">Adaptation des tableaux RP d’Effie et des parcours de l’Atlas. Repères de jeu uniquement, pas une ordonnance.</small></section>`;
}
function setCareMemoOnly(value){careMemoOnly=!!value;renderCondensed(activeRouteKind);}
