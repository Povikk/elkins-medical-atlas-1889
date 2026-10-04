// Editorial layer for the quiz only. Original care/reference content is preserved.
const quizClinicalRewrites=[
 ['quelle consigne est la plus utile au jeu','quelle consigne donnes-tu au patient'],
 ['la pharmacie joués','la pharmacie locale'],
 ['confort narratif','confort du patient'],
 ['une ouverture de scène et un repère de surveillance','un moyen de surveiller l’évolution'],
 ['Que fais-tu pour garder une scène cohérente ?','Comment organises-tu le soin ?'],
 ['Quelle priorité donnes-tu à la scène ?','Quelle priorité donnes-tu à l’examen ?'],
 ['Quelle suite de scène envisages-tu ?','Quelle prise en charge envisages-tu ?'],
 ['Quel repère correspond à la fiche ?','Quelle utilisation convient à cette préparation ?'],
 ['Que suggère l’Atlas ?','Quelle prise en charge envisages-tu ?'],
 ['quelle réaction RP est cohérente','quelle réaction est appropriée'],
 ['Que fais-tu pour garder une scène cohérente','Comment organises-tu le soin'],
 ['selon le parcours','selon l’état du patient'],
 ['Parcours et repères RP de l’Atlas','Consultations et soins'],
 ['S’ENTRAÎNER HORS SCÈNE','S’ENTRAÎNER'],
 ['Situations RP','Consultations'],
 ['Comment continuer le jeu ?','Que vérifies-tu sans attendre son récit ?'],
 ['Observer et choisir les informations encore inconnues','Observer son état et noter ce qui reste inconnu'],
 ['Quelle priorité narrative ?','Quelle priorité donnes-tu à l’examen ?'],
 ['Décrire sans promettre que tout effet est normal','Évaluer la sensation sans présenter tout effet comme normal'],
 ['Un résultat n’a pas été confirmé par le joueur. Comment le décrire ?','Une amélioration n’a pas encore été constatée. Comment la notes-tu ?'],
 ['la pharmacie jouée','la pharmacie locale'],
 ['Lui imposer un passé','Lui annoncer une complication non constatée'],
 ['Inventer sa maladie secrète','Lui attribuer une maladie sans examen'],
 ['but narratif','objectif'],
 ['de nouvelles scènes opératoires','de nouvelles interventions chirurgicales'],
 ['phase de scène','phase de surveillance'],
 ['installer la scène','préparer l’espace de soin'],
 ['transition de scène','organisation du transport'],
 ['peut être joué','peut être fait'],
 ['a été effectivement joué','a été effectivement réalisé'],
 ['technique d’hypnose jouée','technique d’hypnose'],
 ['jouer une belladone universelle','supposer que toutes les préparations ont la même utilisation'],
 ['jouer la prudence','soutenir le membre avec prudence'],
 ['jouer l’attente et le confort','protéger du froid pendant l’attente'],
 ['Cette distinction laisse chacun jouer son rôle.','Cette distinction sépare les observations du médecin des sensations du patient.'],
 ['Le lieu et la chronologie donnent immédiatement une prise au jeu.','Le lieu et la chronologie aident à orienter l’examen.'],
 ['Une toux peut être jouée en un son, mais la consultation gagne en intérêt quand on demande sa durée et la gêne respiratoire associée.','La toux est un signe, pas un diagnostic. Demander sa durée et la gêne respiratoire associée aide à préciser l’examen.'],
 ['En RP,','Pendant le soin,'],
 ['facile à jouer','facile à reconnaître'],
 ['jouer un échange','demander des précisions'],
 ['Choisir conscient pour débloquer le parcours','Considérer le patient conscient malgré son absence de réponse'],
 ['Le parcours envisage une suture. Le nombre de points n’a pas été joué. Que noter ?','Une suture est envisagée, mais les points n’ont pas encore été réalisés. Que notes-tu ?'],
 ['Une suture forcément réalisée','Une suture déjà réalisée alors qu’elle est seulement envisagée'],
 ['Le réveil joué','La reprise de conscience'],
 ['le réveil joué','la reprise de conscience'],
 ['Une anesthésie générale est jouée. Quel rôle donner à un assistant ?','Une anesthésie générale est nécessaire pendant une opération. Quel rôle confies-tu à ton assistant ?'],
 ['Une trame possible est suggérée pendant un soin. Quelle place laisser au joueur ?','Tu proposes au patient une visite de contrôle après son soin. Comment présentes-tu cette proposition ?'],
 ['La possibilité de rebondir ou de refuser','Lui expliquer l’intérêt du contrôle et lui laisser la possibilité de poser des questions'],
 ['Une accroche ouvre une possibilité de jeu sans décider de l’histoire du patient.','Une visite de contrôle permet de surveiller l’évolution. Expliquer son intérêt ne signifie pas décider à l’avance de l’état du patient.'],
 ['Exiger la prochaine scène','Exiger son retour sans lui expliquer pourquoi'],
 ['Le joueur choisit','Le patient choisit'],
 ['ne décide pas de l’état du personnage à la place du joueur','ne permet pas de conclure à une guérison sans réévaluation'],
 ['Ne pas annoncer que le saignement cesse sans confirmation dans la scène.','Vérifier si le saignement diminue avant de conclure qu’il est contrôlé.'],
 ['sans imposer une incapacité','sans présumer de son incapacité'],
 ['sans imposer un résultat au test','sans présumer du résultat de l’examen'],
 ['sans imposer le résultat d’un test','sans présumer du résultat de l’examen'],
 ['sans imposer le diagnostic','sans conclure sur ce seul signe'],
 ['sans diagnostic imposé au joueur','sans diagnostic prématuré'],
 ['pas de diagnostic imposé au joueur','pas de diagnostic prématuré'],
 ['L’Atlas soutient la scène :','Le suivi repose sur les observations :'],
 ['Les phrases RP sont prévues pour rester naturelles, courtes et adaptées au vocal.','Des questions courtes et simples permettent au patient de répondre plus facilement.'],
 ['Ce signe oriente la scène, sans décider seul du diagnostic.','Ce signe aide à orienter l’examen, mais ne suffit pas à établir un diagnostic.'],
 ['Augmentation de volume d’une zone visible dans le RP.','La cheville du patient est plus grosse qu’avant la chute.'],
 ['Gonflement : Augmentation de volume d’une zone visible dans le RP.','Le gonflement est une augmentation du volume d’une zone.'],
 ['Décrire le soutien du bras contre le corps.','Soutenir le bras contre le corps.'],
 ['Décrire le maintien d’une pression et demander un assistant.','Maintenir une pression et demander l’aide d’un assistant.'],
 ['Décrire le nettoyage de la zone, sans recette ni concentration.','Nettoyer la zone avant de la protéger, avec une préparation identifiée.'],
 ['Décrire la protection de la plaie et le maintien du pansement.','Protéger la plaie et maintenir le pansement.'],
 ['Décrire le soutien du membre et la limitation des mouvements.','Soutenir le membre et limiter ses mouvements.'],
 ['Décrire le contrôle chirurgical d’un vaisseau identifié, sans détail opératoire.','Contrôler le saignement d’un vaisseau identifié dans une intervention spécialisée.'],
 ['Décrire l’évacuation des sécrétions dans une scène encadrée.','Permettre l’évacuation de sécrétions lors d’une prise en charge spécialisée.'],
 ['Évoquer le retrait des tissus manifestement abîmés, sans procédure réelle.','Prendre en charge les tissus abîmés lors d’un soin chirurgical spécialisé.'],
 ['Décrire un retrait seulement si l’objet est accessible dans la scène.','Envisager le retrait seulement si l’objet est accessible.'],
 ['Jouer une préparation et une surveillance confiée à un assistant.','Préparer l’intervention et confier la surveillance à un assistant.'],
 ['Évoquer une remise en place spécialisée sans décrire les manœuvres.','Envisager une remise en place spécialisée après évaluation.'],
 ['Évoquer le geste sans température, recette ou méthode d’application.','Reconnaître un geste spécialisé de cautérisation, distinct du nettoyage ordinaire.'],
 ['Une bonne question laisse au patient une réponse à jouer. Décrire un geste ou demander ce qui change donne souvent plus de rythme que d’annoncer immédiatement un résultat.','Demander au patient ce qui a changé permet de compléter l’observation. Un soin réalisé ne suffit pas, à lui seul, à confirmer une amélioration.'],
 ['Pour retenir les repères de l’Atlas, pas pour apprendre des soins réels.','Entraînement historique en 1889. Ce quiz ne constitue pas une formation aux soins réels.'],
 ['questions disponibles, tirées des fiches et des parcours de l’Atlas.','questions sur les patients, les produits et les soins de 1889.']
];
function quizClinicalText(value){
 let text=String(value||'').replace(/[\u2013\u2014]/g,'-');
 for(const [before,after] of quizClinicalRewrites)text=text.split(before).join(after);
 return text
  .replace(/\bjoueurs?\b/gi,'patient').replace(/\bpersonnages?\b/gi,'patient')
  .replace(/\bRP\b/g,'').replace(/\brôle[- ]play\b/gi,'')
  .replace(/\bdans (?:une|la) scène\b/gi,'pendant le soin').replace(/\ben scène\b/gi,'pendant le soin')
  .replace(/\bde scène\b/gi,'de consultation').replace(/\bscènes?\b/gi,'consultation')
  .replace(/\bparcours\b/gi,'suivi').replace(/\bjouer\b/gi,'réaliser')
  .replace(/\bjouée?s?(?!\p{L})/giu,'réalisé').replace(/\bjoués?(?!\p{L})/giu,'réalisé')
  .replace(/\bjoues\b/gi,'réalises').replace(/\bjeu\b/gi,'consultation')
  .replace(/Astuce de consultation/g,'Détail à retenir')
  .replace(/\s{2,}/g,' ').replace(/ +([,.;])/g,'$1').trim();
}
const quizTechniqueActions={
 'Méthode de Silvester':'Tu étudies la méthode historique de Silvester.',
 'Suture':'Une plaie doit être refermée par suture.',
 'Compression d’un saignement':'Tu dois contrôler un saignement externe.',
 'Nettoyage et antisepsie':'Tu dois nettoyer une plaie et préparer sa protection.',
 'Pansement et bandage':'Tu dois protéger une plaie par un pansement.',
 'Immobilisation par attelle':'Tu dois immobiliser un membre blessé avec une attelle.',
 'Écharpe de soutien':'Tu dois mettre en place une écharpe de soutien pour un bras blessé.',
 'Examen d’une plaie':'Tu dois examiner une plaie.',
 'Ligature d’un vaisseau':'Un vaisseau identifié saigne lors d’une opération spécialisée.',
 'Drainage d’un abcès':'Un abcès nécessite une prise en charge spécialisée.',
 'Débridement d’une plaie':'Une plaie comporte des tissus abîmés et nécessite un soin spécialisé.',
 'Extraction d’un corps étranger':'Un corps étranger est visible dans une plaie.',
 'Anesthésie générale historique':'Une opération nécessite une anesthésie générale historique.',
 'Surveillance après anesthésie':'L’opération est terminée et le patient est encore endormi.',
 'Réduction d’une luxation':'Une luxation est envisagée après l’examen d’un membre blessé.',
 'Cautérisation historique':'Tu étudies la cautérisation dans la chirurgie de 1889.'
};
function normalizeQuizQuestion(question){
 for(const field of ['prompt','correct','explanation','reference'])question[field]=quizClinicalText(question[field]);
 question.pool=[...new Set(question.pool.map(quizClinicalText))].filter(value=>value!==question.correct);
 return question;
}
