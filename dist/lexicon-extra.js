// Editorial RP priorities, not usage analytics or treatment recommendations.
const techniqueSource={title:'Gerster, chirurgie aseptique et antiseptique, 1888',url:'https://books.google.com/books?id=SW4-_H9L_csC'};
const techniqueRows=[
 ['Compression d’un saignement','Compresses ou linge propre','Décrire le maintien d’une pression et demander un assistant.','Saignement externe : garder le contrôle du sang au premier plan.','Ne pas annoncer que le saignement cesse sans confirmation dans la scène.'],
 ['Nettoyage et antisepsie','Linge propre et préparation antiseptique d’époque','Décrire le nettoyage de la zone, sans recette ni concentration.','Préparation d’une plaie avant protection ou fermeture.','Les antiseptiques historiques peuvent être toxiques ou irritants.'],
 ['Pansement et bandage','Compresses et bandes de tissu','Décrire la protection de la plaie et le maintien du pansement.','Conclure un soin et donner des consignes de surveillance.','Un pansement ne garantit ni arrêt du saignement ni absence d’infection.'],
 ['Immobilisation par attelle','Attelle, rembourrage et bandes','Décrire le soutien du membre et la limitation des mouvements.','Traumatisme ou fracture dans la scène.','Pas de remise en place forcée ; vérifier douleur et signes visibles.'],
 ['Écharpe de soutien','Pièce de tissu et bandes','Décrire le soutien du bras contre le corps.','Maintenir un bras blessé en attendant la suite des soins RP.','Ne pas confondre soutien et guérison d’une fracture.'],
 ['Examen d’une plaie','Observation, éclairage et linge propre','Demander où le patient a mal et observer les signes visibles.','Repérer saignement, salissures et aspect de la blessure.','Pas de recherche profonde à l’aveugle ni de diagnostic imposé au joueur.'],
 ['Ligature d’un vaisseau','Pince et fil de ligature','Décrire le contrôle chirurgical d’un vaisseau identifié, sans détail opératoire.','Hémorragie majeure dans une scène chirurgicale.','Geste spécialisé ; pas une solution automatique à tout saignement.'],
 ['Drainage d’un abcès','Matériel chirurgical et pansement','Décrire l’évacuation des sécrétions dans une scène encadrée.','Abcès ou plaie infectée nécessitant une prise en charge chirurgicale RP.','Aucune consigne d’incision réelle ; surveiller état général et évolution.'],
 ['Débridement d’une plaie','Instruments chirurgicaux et compresses','Évoquer le retrait des tissus manifestement abîmés, sans procédure réelle.','Plaie gravement souillée ou infectée dans la scène.','Geste spécialisé, sans promesse de retirer toute l’infection.'],
 ['Extraction d’un corps étranger','Pince et éclairage','Décrire un retrait seulement si l’objet est accessible dans la scène.','Écharde ou projectile accessible selon le parcours.','Ne pas fouiller une plaie ni considérer qu’une balle doit toujours être extraite.'],
 ['Anesthésie générale historique','Éther ou chloroforme et matériel adapté à l’époque','Jouer une préparation et une surveillance confiée à un assistant.','Opération lourde, pas simple soin d’une éraflure.','Anesthésiques dangereux ; aucun dosage, durée garantie ou réveil automatique.'],
 ['Surveillance après anesthésie','Assistant, couverture et observation','Attendre le réveil joué et observer respiration, conscience et saignement.','Phase de récupération après une opération RP.','Ne pas banaliser une respiration difficile ni fixer un délai de réveil.'],
 ['Réduction d’une luxation','Installation du patient et soutien du membre','Évoquer une remise en place spécialisée sans décrire les manœuvres.','Luxation retenue par les participants dans la scène.','Ne pas appliquer automatiquement à une déformation : fracture possible.'],
 ['Cautérisation historique','Instrument ou préparation caustique spécialisée','Évoquer le geste sans température, recette ou méthode d’application.','Référence documentaire de chirurgie d’époque.','Destruction des tissus et brûlures possibles ; jamais un soin banal.']
];
techniqueRows.forEach(([name,form,admin,use,warning])=>lexique.push({name,category:'Technique',type:'Geste et repère de scène',form,admin,use,warning,context:'Spécialisé',tags:name+' '+use,icon:'',sources:[techniqueSource]}));
const lexPriorityNames=[
 'Compression d’un saignement','Nettoyage et antisepsie','Pansement et bandage','Immobilisation par attelle','Suture',
 'Laudanum','Morphine','Éther','Chloroforme','Phénol / acide carbolique','Alcool','Iodoforme',
 'Onguent','Baume','Arnica','Quinine','Huile de ricin','Bicarbonate de sodium','Préparation de réglisse',
 'Valériane','Ammoniaque / sels odorants','Belladone',
 'Compresses / linge propre','Bandage','Attelle','Aiguille et fil de suture',
 'Pâleur','Essoufflement','Confusion','Pouls faible'
];
function lexPriority(item){return lexPriorityNames.some(name=>item.name===name || item.name.startsWith(name+' /') || item.name.startsWith(name+' '));}
function sortLexReferences(list){return [...list].sort((a,b)=>Number(lexPriority(b))-Number(lexPriority(a)) || a.name.localeCompare(b.name,'fr',{sensitivity:'base'}));}
function priorityLabel(item){return ['Spécialisé','Historique dangereux'].includes(item.context) || ['Anesthésique','Sédatif','Stimulant'].includes(item.category) ? 'Repère de catégorie, avec précautions' : 'Repère courant en scène RP';}
function sleepingSurgery(){
 if(activeRouteKind!=='surgery' || !surgeries[currentSurgery])return false;
 const steps=surgeries[currentSurgery].steps;
 const anesthetic=steps.findIndex(step=>step.meds?.some(row=>/chloroforme|éther/i.test(row[0])));
 return anesthetic>=0 && surgeryStepIndex>anesthetic && !steps[surgeryStepIndex].recovery;
}
function casePhrase(){
 const surgery=activeRouteKind==='surgery';
 const id=surgery?currentSurgery:currentFlow;
 const phrases={unknown:'« Je vérifie sa respiration et ses réactions avant de chercher la cause. »',gunshot:'« Je vérifie la blessure par balle et le saignement avant de poursuivre. »',knife:'« Je regarde cette plaie sans vous faire bouger davantage. »',fight:'« Dites-moi ce qui vous gêne le plus depuis les coups. »',horse:'« Depuis la chute, avez-vous mal ailleurs que dans cette zone ? »',fracture:'« Ne forcez pas sur le membre. Je vais le soutenir pendant l’examen. »',minor:'« Je regarde la petite plaie pour choisir le soin le plus simple. »',drowning:'« Je reste auprès de vous pour surveiller la respiration après la noyade. »',head:'« Après ce choc à la tête, je vérifie que vos réponses ne changent pas. »',burn:'« Je vais protéger la brûlure. Signalez-moi toute gêne respiratoire. »',poison:'« Je surveille sa respiration et cherche ce qu’il a pu prendre. »',amputation:'« Gardez les compresses prêtes et surveillez sa respiration pendant l’intervention. »',deep_bullet:'« Je limite l’exploration à ce qui est accessible dans cette plaie. »',abdominal:'« Surveillez sa respiration et préparez les compresses pour cette plaie abdominale. »',trepanation:'« Surveillez sa respiration et ses réactions pendant cette intervention sur le crâne. »',major_bleeding:'« Maintenez la pression pendant que je recherche la source du saignement. »',infected_wound:'« Je vérifie l’état de cette plaie infectée et son évolution. »'};
 const title=activeStepTitle.toLowerCase();
 if(id==='animal'&&/priorité/.test(title))return '« Je surveille sa respiration et le saignement avant de poursuivre les soins des blessures. »';
 if(id==='animal'&&/animal|circonstanc/.test(title))return '« Quel animal était-ce, et comment l’attaque s’est-elle produite ? »';
 if(id==='animal'&&animalIsVenom())return '« Depuis la morsure, dites-moi si votre respiration ou vos sensations changent. Je poursuis la surveillance. »';
 if(id==='animal'&&!animalHasWound())return '« Depuis le choc, dites-moi si la douleur ou le mouvement ont changé, sans forcer sur cette zone. »';
 if(sleepingSurgery())return 'À l’assistant : « Gardez sa respiration sous surveillance pendant que je poursuis cette intervention. »';
 const area={arm:'bras',leg:'jambe',limb:'membre',chest:'thorax',abdomen:'abdomen',head:'tête',back:'dos',ribs:'côtes'}[answers.gunArea || answers.knifeArea || answers.horseArea];
 if(/sutur|fermer|refermer/.test(title))return `« Je vérifie si la ${id==='gunshot'?'blessure par balle':id==='knife'?'plaie au couteau':'plaie'} peut être refermée${area?' au niveau du '+area:''}. »`;
 if(/nettoy|antisept/.test(title))return `« Je vais nettoyer ${id==='burn'?'la zone brûlée':'cette plaie'}${area?' au niveau du '+area:''}. Dites-moi si le contact vous fait mal. »`;
 if(/panser|pansement|protéger/.test(title))return `« Je protège ${id==='burn'?'la brûlure':'la zone blessée'}${area?' au niveau du '+area:''}. Prévenez-moi si le pansement gêne. »`;
 if(/douleur|soulager/.test(title))return `« ${id==='fracture'?'Sans bouger le membre, dites-moi':id==='burn'?'Pour cette brûlure, dites-moi':'Avant de choisir un produit, dites-moi'} si la douleur reste supportable. »`;
 return phrases[id] || '';
}
// A narrative pause, not a medical timer. Opioid analgesia is not general anesthesia.
Object.entries(surgeries).forEach(([id,surgery])=>{
 if(!surgery.steps.some(step=>step.meds?.some(row=>/chloroforme|éther/i.test(row[0]))))return;
 const focus=surgery.recoveryFocus||{amputation:'le pansement du membre opéré',deep_bullet:'la plaie explorée',abdominal:'le pansement abdominal',trepanation:'le pansement du crâne'}[id]||'la zone soignée';
 surgery.steps.push({title:'Surveiller et attendre le réveil joué',recovery:true,do:[
 'Suspendre la suite de la scène et laisser le joueur jouer un réveil progressif, sans délai médical garanti.',
 'Garder un assistant auprès du patient pour observer respiration, réactions et '+focus+'.',
 'Si la respiration ou la conscience restent inquiétantes, utiliser « Son état change » ; ne pas simplement attendre.'
 ],say:['À l’assistant : « L’acte est fini. Restez auprès de lui et surveillez sa respiration pendant qu’il reprend ses esprits. »','Au patient, seulement s’il se réveille : « Vous êtes toujours auprès de nous. Ne vous relevez pas, nous allons encore vous surveiller. »']});
});
