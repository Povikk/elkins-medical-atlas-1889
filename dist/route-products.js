// Authored supply plans for fictional 1889 care. No automatic administration or records.
const woundSupplyRows=[
 ['Eau propre disponible','Nettoyage superficiel accessible, avec un linge propre ; pas de sondage.'],
 ['Phénol / acide carbolique','Antisepsie avec une préparation historique adaptée à l’usage externe ; jamais pur ni dans un trajet profond. Reprise dans le récapitulatif avec le nettoyage.'],
 ['Compresses et pansement','Protection propre après le soin ; renouveler selon les constatations.']
];
const bruiseSupplyRows=[['Préparation à l’arnica','Appliquer le baume sur le bleu, sur peau intacte uniquement, jamais dans une plaie.'],['Linge frais','Soin de confort du bleu ; repos et réévaluation restent nécessaires.']];
const jointSupportSupply={rows:[['Attelle ou écharpe','Soutenir le membre dans la position trouvée, sans forcer l’articulation.']],material:['Tissu rembourré','Bandage de maintien'],note:'Luxation possible : examiner l’articulation et les extrémités avant toute décision de réduction. Aucun baume ne remet une articulation en place.'};
function reviewedCareStep(step,kind){
 if(kind==='surgery')return step;
 if(currentFlow==='fluidLoss')return lossCareStep(step);
 if(currentFlow==='strangulation')return strangulationCareStep(step);
 if(currentFlow==='minor'&&step.dynamicMinorCare){
  const issue=answers.minorIssue;
  const wound=issue==='wound',bruise=issue==='bruise',irritation=issue==='irritation';
  return {...step,do:wound?['Nettoyer la petite plaie accessible et la protéger avec une compresse propre.','Pas de baume dans la plaie ; vérifier les bords avant de décider d’une fermeture.']:bruise?['Proposer un linge frais et du repos.','Appliquer le baume à l’arnica sur le bleu, sur peau intacte uniquement.']:irritation?['Protéger la peau intacte irritée ; limiter les frottements.','Choisir un seul onguent adapté, sans l’appliquer dans une ouverture de la peau.']:['Préciser l’aspect et la profondeur avant de choisir un produit.','Ne pas conclure à un petit bobo si l’examen reste incertain.'],med:bruise?[['Préparation à l’arnica','Baume / pommade','Application externe sur peau intacte','Contusion simple sur peau intacte']]:irritation?[['Onguent à l’oxyde de zinc','Pommade protectrice','Application externe sur peau intacte irritée','Frottements, option protectrice']]:[],say:wound?['« Je vais nettoyer cette petite plaie puis la protéger. Pas de baume à l’intérieur. »']:bruise?['« Je vais poser un linge frais ; j’applique le baume sur ce bleu, sur peau intacte. »']:irritation?['« Je vais protéger cette peau irritée et vous demander d’éviter les frottements. »']:['« Je vérifie d’abord ce qui nécessite un soin. »']};
 }
 return step;
}
function routeSupplyPlan(step,kind){
 if(kind==='flow'&&currentFlow==='strangulation')return {rows:step.dynamicStrangCare&&answers.strangNeck==='abrasion'&&!strangulationDanger()?woundSupplyRows:[],material:strangulationCareStep(step).care?.material||[],note:'Aucun opiacé, anesthésique ou baume systématique après une compression du cou. Ne pas faire boire pour tester la déglutition.'};
 if(kind==='flow'&&currentFlow==='fluidLoss')return {rows:[],material:lossCareStep(step).care?.material||[],note:step.dynamicLossCare?'Pas de morphine, laudanum, purgatif ou perfusion automatique pour ce motif.':'Observer les réactions et le souffle avant tout produit.'};
 if(kind==='surgery'){
  const title=step.title.toLowerCase();
  if(/anesth/.test(title))return {rows:[],note:'Éther OU chloroforme selon décision spécialisée ; jamais les deux automatiquement. Surveillance dédiée ; pas de réveil garanti.'};
  if(/nettoy|prépar|accéder|opérer|explor|acte |tissus|drainage si|drainage spécialisé|traiter la lésion|ligatur/.test(title))return {rows:[['Phénol / acide carbolique','Antisepsie historique préparée de la peau / du matériel ; aucun produit pur ni application profonde.']],material:step.care?.material||['Instruments adaptés au geste retenu','Compresses'],note:'Préparation locale distincte de l’anesthésie ; pas de mélange ni recette. L’antiseptique ne traite pas une lésion interne.'};
  if(/fermer|refermer|protéger|protection|panser|écoulement/.test(title))return {rows:[['Compresses et pansement','Protection adaptée à la fermeture ou au drainage réellement réalisé.']],material:step.care?.material||['Bandage','Aiguille et fil uniquement si fermeture retenue']};
  return {rows:[],note:'Examen / surveillance : aucun produit supplémentaire systématique.',material:step.care?.material||[]};
 }
 const id=currentFlow,index=stepIndex;
 if(step.dynamicHorseCare&&answers.horseVisible==='dislocation'||step.dynamicFightCare&&answers.fightIssue==='dislocation'||step.dynamicHoof&&answers.hoofSigns==='dislocation')return jointSupportSupply;
 if(step.dynamicConscious||step.dynamicUnknownBreathing||step.dynamicBreathing||step.dynamicHead||step.dynamicPoison)return {rows:[],note:'Priorités vitales : aucun produit ne remplace la surveillance, le renfort ou le soutien respiratoire.',material:['Couverture / linge propre selon besoin']};
 if(id==='hoof'&&step.dynamicHoof){
  if(answers.hoofSigns==='bruise')return {rows:careProductBlocked()||zoneHas('hoofArea','unknown')?[['Préparation à l’arnica','Option pour le bleu sur peau intacte, différée jusqu’à évaluation rassurante ; pas dans une plaie.']]:[],note:'Le soin du bleu ne traite pas une éventuelle lésion interne ; réévaluer chaque zone frappée.'};
  if(answers.hoofSigns==='wound'&&!careProductBlocked())return {rows:woundSupplyRows,material:['Compresses','Pansement'],note:'Plaie profonde ou souillée : avis avant fermeture ; pas d’arnica dans la plaie.'};
  if(answers.hoofSigns==='function')return {rows:[['Attelle ou écharpe','Soutien adapté sans forcer la position ; bandage rembourré.']],note:'Aucun baume ne répare une fracture ; soulagement seulement après évaluation.'};
  return {rows:[],note:'Soin local seulement après examen rassurant ; pas de produit automatique sur une zone inconnue ou inquiétante.'};
 }
 if(step.dynamicAnimal==='clean'){
  if(animalIsVenom()||animalUnsafe())return {rows:[['Linge propre / protection simple','Protéger pendant l’organisation du renfort et du transport.']],note:animalIsVenom()?'Aucun antivenin courant en 1889 ; pas d’incision, aspiration ou cautérisation.':'Nettoyage et produits locaux différés pendant la prise en charge prioritaire.'};
  if(animalHasWound())return {rows:woundSupplyRows,note:'Aucun antiseptique ne prévient à lui seul la rage. Pas de fermeture ni de baume automatiques pour une morsure.'};
  if(['crush','dislocation'].includes(answers.animalDepth))return jointSupportSupply;
  return {rows:bruiseSupplyRows,note:'Pas d’antiseptique sans plaie ; déformation / perte de fonction : examen et soutien d’abord.'};
 }
 if(step.dynamicUnknownBleeding)return {rows:['major','minor'].includes(answers.unknownBleeding)?[['Compresses / linge propre','Contrôle du saignement visible et protection temporaire.']]:[],note:'L’examen du saignement ne justifie pas un médicament systématique.'};
 if(step.dynamicAnimal==='protect'&&answers.animalDepth==='dislocation')return jointSupportSupply;
 if(step.dynamicSuture)return {rows:answers.needsSuture===true?woundSupplyRows:woundSupplyRows.filter(r=>r[0]!=='Phénol / acide carbolique'),material:answers.needsSuture===true?['Aiguille et fil','Pince','Ciseaux']:[],note:answers.needsSuture===true?'Points uniquement si fermeture retenue ; nombre à préciser.':'Pas de points dans cette branche ; protéger et organiser l’avis si nécessaire.'};
 if(id==='gunshot'&&step.dynamic)return {rows:woundSupplyRows,note:answers.bullet==='graze'?'Éraflure constatée : soin superficiel, pas d’extraction ni de points.':'Pas de recherche de projectile ou de plomb à l’aveugle.'};
 if(id==='knife'&&step.title==='Nettoyer')return {rows:woundSupplyRows,note:'Nettoyer ce qui est accessible ; profondeur incertaine : protéger et demander un avis.'};
 if(step.dynamicFightCare&&answers.fightIssue==='bruise')return {rows:bruiseSupplyRows};
 if(step.dynamicHorseCare&&answers.horseVisible==='bruise')return {rows:bruiseSupplyRows};
 if(step.dynamicFightCare&&answers.fightIssue==='cut')return {rows:woundSupplyRows};
 if(step.dynamicHorseCare&&answers.horseVisible==='wound')return {rows:woundSupplyRows};
 if(id==='minor'&&step.dynamicMinorCare)return {rows:answers.minorIssue==='wound'?woundSupplyRows:[],note:answers.minorIssue==='unknown'?'Aucun produit choisi avant clarification.':undefined};
 if(id==='head'&&step.title==='Petit soin local')return {rows:[...woundSupplyRows.map(r=>[r[0],r[1]+' Seulement si une coupure superficielle est constatée.']),['Préparation à l’arnica','Application sur une bosse constatée sur peau intacte, loin des yeux ; aucun effet sur une commotion.']],note:'Choisir selon la peau observée, pas tous les produits ensemble ; surveillance neurologique prioritaire.'};
 if(id==='burn'&&step.dynamicBurn)return {rows:answers.burnSeverity==='airway'||answers.burnSeverity==='unknown'?[]:[['Eau fraîche disponible','Refroidissement de la zone, pas de préparation chimique.'],['Linge / pansement propre','Protection sans percer les cloques.']],note:'Pas de baume imposé ; atteinte étendue ou du souffle : prise en charge prioritaire.'};
 if(id==='fracture'&&step.title==='Immobiliser')return {rows:[['Attelle, tissu rembourré et bandages','Immobilisation adaptée ; vérifier les extrémités après pose.']],note:'Aucun produit ne remet un os en place. Si plaie associée, examen et protection distincts.'};
 if(careConsultations.some(([key])=>key===id))return {rows:[],note:'Consultation : choisir le soin après les constatations ; aucun médicament déduit de ce seul motif.',material:id==='fever'?['Thermomètre clinique']:id==='cough'?['Stéthoscope']:id==='checkup'?['Compresses et pansement si renouvellement décidé']:id==='dental'?['Éclairage et matériel d’examen']:[]};
 const material=step.care?.material||step.material||[];
 return {rows:[],material,note:(step.med?.length||step.meds?.length)?undefined:'Examen, protection ou surveillance : pas de médicament supplémentaire systématique.'};
}
function routeSuppliesMarkup(step,kind,rendered){
 const plan=routeSupplyPlan(step,kind);
 // Existing product cards remain authoritative; only missing named supplies are added.
 const raw=document.createElement('div');raw.innerHTML=rendered;
 const cards=[...raw.querySelectorAll('.med-item strong')].map(x=>x.textContent);
 const rows=plan.rows.filter(([name])=>!cards.some(text=>text.includes(name)));
 const details=rows.map(([name,use])=>`<li><b>${condensedEscape(name)}</b> : ${condensedEscape(use)}</li>`);
 if(plan.material?.length&&!rows.some(([name])=>/Compresses|Attelle/i.test(name)))details.push(`<li><b>Matériel</b> : ${plan.material.map(condensedEscape).join(' · ')}.</li>`);
 if(plan.note)details.push(`<li>${condensedEscape(plan.note)}</li>`);
 if(!details.length)return '';
 return `<div class="route-supplies condensed-products" aria-label="Produits et matériel de cette étape"><h3>Produits et matériel</h3><ul>${details.join('')}</ul></div>`;
}
flows.minor.steps[0].say=['« Je regarde d’abord si la peau est ouverte et ce qui vous gêne. »'];
flows.minor.steps[1].dynamicMinorCare=true;
flows.minor.steps.splice(1,0,{title:'Aspect de la peau',do:['Distinguer peau intacte, irritation et plaie ouverte avant de choisir le soin.'],choices:[{label:'Bleu / bosse sur peau intacte',set:{minorIssue:'bruise'}},{label:'Petite plaie / éraflure ouverte',set:{minorIssue:'wound'}},{label:'Frottement / irritation sur peau intacte',set:{minorIssue:'irritation'}},{label:'Aspect ou profondeur non déterminés',set:{minorIssue:'unknown'}}]});
flows.head.steps[4].med=[];
// Keep historical oils as a lexicon reference, not a universal burn treatment.
flows.burn.steps[3].med=flows.burn.steps[3].med.filter(r=>!r[0].includes('Carron'));
flows.poison.steps[3].med=[];
flows.poison.steps[3].care.products=[];
flows.poison.steps[3].do=['Surveiller constamment respiration et réactions.','Organiser du renfort et poursuivre le soutien respiratoire si nécessaire.','Aucun antidote spécifique proposé en 1889 ; sels odorants et nouveaux opiacés ne traitent pas cette intoxication.'];
careMemoRows.gunshot[2]='Plaie : eau propre · antisepsie au phénol préparé · compresses ; antalgique facultatif';
careMemoRows.knife[2]='Plaie : eau propre · antisepsie au phénol préparé · compresses ; antalgique facultatif';
careMemoRows.minor[2]='Bleu : arnica sur peau intacte ; plaie : eau / antisepsie adaptée / pansement ; irritation : zinc';
careMemoRows.hoof[2]='Bleu simple : arnica / linge frais ; plaie : eau, antisepsie adaptée, compresses ; déformation : soutien';
careMemoRows.head[2]='Coupure : nettoyage / pansement ; bosse : soin de peau intacte ; aucun produit ne traite la commotion';
for(const surgery of Object.values(surgeries))if(surgery.memo)surgery.memo[2]='Éther ou chloroforme si anesthésie retenue ; antisepsie préparée ; compresses / pansement selon le geste';
