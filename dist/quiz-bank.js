// Questions documentaires issues des fiches de l'Atlas, pas un examen médical.
// Ajouter une situation : [question, bonne réponse, trois distracteurs, explication].
const quizSituations = [
 ['Un inconscient est découvert au bord du chemin. La cause est inconnue. Que regarder en premier ?', 'Respiration et saignement majeur', ['Son métier et son adresse','Le médicament à prescrire','La couleur de ses vêtements'], 'Le parcours cause inconnue commence par les signes prioritaires. L’histoire vient ensuite.'],
 ['Le patient inconscient ne peut pas raconter sa chute. Comment continuer le jeu ?', 'Observer et choisir les informations encore inconnues', ['Inventer ses réponses','Exiger son récit avant de poursuivre','Choisir conscient pour débloquer le parcours'], 'Le médecin peut avancer avec des observations et des choix « impossible à déterminer ».'],
 ['Une personne ne peut pas avaler. Quel repère appliquer au laudanum ?', 'Ne pas proposer la voie orale dans cet état', ['Le faire boire malgré tout','Le présenter comme un pansement','Le confondre avec une attelle'], 'La fiche réserve la voie orale à un patient conscient capable d’avaler.'],
 ['Après un opiacé, la respiration devient difficile. Quelle réaction RP est cohérente ?', 'Réévaluer et chercher du renfort', ['Rassurer en disant que tout est normal','Annoncer une guérison','Ignorer le changement pour finir le dialogue'], 'La dépression respiratoire figure parmi les dangers des opiacés. Un effet inquiétant ne se banalise pas.'],
 ['Une contusion est visible, mais la peau est intacte. Quel produit local correspond à ce repère de l’Atlas ?', 'Arnica', ['Laudanum en pansement','Morphine en friction','Scie chirurgicale'], 'L’arnica est présentée pour un usage externe sur peau intacte, pas dans une plaie.'],
 ['Une plaie est ouverte. Quelle limite retenir pour l’arnica ?', 'Ne pas l’appliquer dans la plaie', ['C’est un fil de suture','Elle remplace l’examen','Elle ferme toute plaie'], 'La fiche distingue le soin d’une contusion et celui d’une plaie ouverte.'],
 ['Le joueur dit que la balle est ressortie. Que retenir ?', 'Noter le fait sans annoncer que la blessure est bénigne', ['Toute surveillance devient inutile','Une extraction reste forcément nécessaire','Il n’y a pas de plaie de sortie possible'], 'Projectile sorti ne signifie pas absence de lésion, de saignement ou de complication.'],
 ['Une balle serait profondément logée et inaccessible. Que suggère l’Atlas ?', 'Un parcours spécialisé, sans extraction aveugle', ['Fouiller sans visibilité','Garantir un retrait immédiat','Déclarer la plaie guérie'], 'Le projectile profond relève d’une scène lourde. L’extraction ne devient pas automatique.'],
 ['La plaie au couteau paraît sale et irrégulière. Quelle décision ne faut-il pas automatiser ?', 'La fermeture par suture', ['La description de la zone','La recherche d’informations visibles','La prise en compte du saignement'], 'Le parcours distingue une plaie propre et nette d’une plaie sale ou trop profonde.'],
 ['Une petite éraflure ne nécessite pas de points. Comment jouer le soin ?', 'Nettoyage, protection et surveillance selon le parcours', ['Chirurgie lourde obligatoire','Anesthésie générale systématique','Trépanation'], 'L’Atlas garde les soins légers courts et proportionnés.'],
 ['Avant une suture simple retenue dans la scène, quel repère vient en amont ?', 'Nettoyage et contrôle du saignement', ['Déclarer immédiatement la cicatrisation','Inventer un nombre de points','Passer directement aux adieux'], 'La suture est conditionnelle. Le nettoyage et le saignement ne sont pas omis.'],
 ['Le parcours envisage une suture. Le nombre de points n’a pas été joué. Que noter ?', 'Nombre de points à préciser', ['Un nombre au hasard','Une suture forcément réalisée','Une cicatrisation parfaite'], 'Une suggestion du parcours n’est pas un acte confirmé. Le joueur précise ce qui a réellement été joué.'],
 ['Après une chute de cheval, le bras bouge mais fait mal. Que faut-il éviter ?', 'Conclure automatiquement à une fracture', ['Décrire la douleur','Préciser le côté','Demander comment le mouvement se passe'], 'Le parcours gère les cas intermédiaires : mouvement douloureux ne signifie pas diagnostic certain.'],
 ['Un membre est déformé. Quelle attitude convient au repère d’immobilisation ?', 'Soutenir sans remise en place forcée', ['Forcer le mouvement pour tester','Garantir que ce n’est pas une fracture','Faire marcher le patient pour prouver la guérison'], 'L’attelle limite les mouvements. Elle ne confirme pas le diagnostic et ne guérit pas le membre.'],
 ['Le bras gauche est blessé. Quelle observation rend le suivi plus clair ?', 'Zone et côté explicitement notés', ['Choisir le côté opposé','Écrire seulement malade','Omettre le membre'], 'Les choix latéralisés aident à conserver une scène cohérente et un rappel lisible.'],
 ['Après un choc à la tête, le patient répond mal. Quelle conclusion est prudente ?', 'Confusion à observer, sans cause certaine', ['Il simule forcément','Il est forcément ivre','Il est automatiquement rétabli'], 'Confusion est une observation, pas un diagnostic imposé au joueur.'],
 ['Après une blessure thoracique, une respiration difficile est signalée. Quelle priorité narrative ?', 'La respiration, avant les détails non urgents', ['Finir d’abord les papiers','Choisir un baume parfumé','Discuter uniquement de l’adresse du patient'], 'L’essoufflement attire l’attention sur la respiration, notamment après une blessure du thorax.'],
 ['Le joueur décrit pâleur et faiblesse. Comment formuler le constat ?', 'Signes observés à réévaluer', ['Preuve certaine d’une anémie','Preuve certaine d’une intoxication','Aucun signe à retenir'], 'Une pâleur peut orienter la scène, mais ne prouve pas à elle seule une cause.'],
 ['Un pansement vient d’être posé. Quelle phrase de suivi est cohérente ?', 'Prévenez-moi si la douleur ou le saignement change.', ['Vous ne pouvez plus saigner.','Toute infection est impossible.','Vous êtes définitivement guéri.'], 'Un pansement protège. Il ne garantit ni arrêt du saignement ni absence d’infection.'],
 ['Après une anesthésie historique, comment gérer le réveil ?', 'Attendre le réveil joué et maintenir la surveillance', ['Garantir exactement deux minutes','Déclarer le réveil sans réponse du joueur','Partir dès que l’opération est terminée'], 'Le réveil n’a pas de délai garanti. Respiration, conscience et saignement restent à observer.'],
 ['Une anesthésie générale est jouée. Quel rôle donner à un assistant ?', 'Surveillance de l’état du patient', ['Décider seul du passé du patient','Garantir la réussite','Écrire des doses improvisées'], 'L’Atlas propose préparation et surveillance, sans dosage ni méthode anesthésique réelle.'],
 ['Une légère éraflure est présentée. Quel recours est disproportionné ?', 'Une anesthésie générale systématique', ['Un soin léger adapté','Une observation de la plaie','Une consigne de surveillance'], 'Les anesthésiques historiques sont dangereux et ne sont pas un soin banal de toute douleur.'],
 ['Une sensation désagréable survient après un produit. Que dire ?', 'Décrire sans promettre que tout effet est normal', ['Tous les effets sont bons signes','Il faut forcément augmenter le produit','La douleur prouve la guérison'], 'Les notes sensorielles servent au RP. Elles n’autorisent pas à banaliser un effet inquiétant.'],
 ['L’odeur d’un pansement à l’iodoforme est forte. Que peut-on conclure ?', 'L’odeur du produit ne juge pas l’état de la plaie', ['Elle prouve une infection','Elle prouve l’absence d’infection','Elle prouve que la plaie est fermée'], 'La fiche de l’iodoforme précise cette limite et rappelle sa toxicité historique.'],
 ['Un patient a de la fièvre. Quelle limite retenir pour la quinine ?', 'Elle ne traite pas toutes les fièvres', ['Elle guérit toute infection','Elle remplace toute observation','Elle immobilise une fracture'], 'La quinine appartient à la pharmacopée historique, sans devenir un remède universel.'],
 ['Le collodion est évoqué. Quelle affirmation serait fausse ?', 'Il remplace le nettoyage et la suture de toute plaie', ['Il forme un film protecteur','Il est inflammable','Il peut donner une sensation de tiraillement'], 'La fiche décrit le film, l’odeur de solvant et les limites du collodion.'],
 ['Une friction camphrée est envisagée. Quel repère correspond à la fiche ?', 'Usage externe sur peau intacte', ['Application dans toute plaie profonde','Boisson pour un inconscient','Fil pour ligature'], 'Le liniment camphré est décrit en friction externe ; le camphre est toxique à l’ingestion.'],
 ['La glycérine est proposée comme ingrédient local. Que ne faut-il pas lui attribuer ?', 'Un pouvoir antiseptique universel', ['Une texture visqueuse','Un rôle d’humectant','Une présence dans certaines préparations'], 'La fiche la présente comme humectant et excipient, pas désinfectant universel.'],
 ['Une préparation de fer est évoquée devant une pâleur. Quelle limite est importante ?', 'La pâleur seule ne prouve pas une anémie', ['Le fer stoppe tout saignement aigu','Le fer remplace un bandage','La pâleur permet un diagnostic certain'], 'Le lexique distingue le contexte de certaines anémies et l’hémorragie aiguë.'],
 ['Un produit du lexique porte « Historique dangereux ». Que signifie cette présence ?', 'Une référence documentaire, pas une proposition systématique de soin', ['Un choix recommandé pour tous','Une garantie de sécurité','Un produit moderne sans risque'], 'Le catalogue contient aussi des pratiques abandonnées, signalées comme dangereuses.'],
 ['La disponibilité d’un produit de 1889 est incertaine dans votre ville RP. Que faire ?', 'Tenir compte de la pharmacie et du contexte de la scène', ['Supposer que tout est toujours disponible','Inventer une livraison instantanée obligatoire','Remplacer les observations par le catalogue'], 'La disponibilité varie selon le pays, le médecin et la pharmacie.'],
 ['Une sensation ou une odeur est inconnue pour un produit. Comment rester crédible ?', 'Ne pas inventer un effet garanti', ['Promettre une chaleur pour chaque produit','Promettre des picotements pour chaque produit','Dire que toute odeur est identique'], 'La note sensorielle n’est utilisée que si la fiche en propose une, sans certitude sur le vécu du patient.'],
 ['Le patient est inconscient. À qui adresser les explications utiles ?', 'À l’assistant ou aux proches présents', ['Exiger une réponse verbale du patient','Inventer son consentement verbal','Ignorer les personnes présentes'], 'Les formulations s’adaptent à la conscience. On ne prête pas une réponse à un personnage inconscient.'],
 ['Le patient est confus. Quel style de phrase aide la scène ?', 'Courte, simple et centrée sur une observation', ['Un long exposé de pharmacologie','Plusieurs questions simultanées obligatoires','Une conclusion sans l’écouter'], 'Les phrases RP sont prévues pour rester naturelles, courtes et adaptées au vocal.'],
 ['Un résultat n’a pas été confirmé par le joueur. Comment le décrire ?', 'Comme une observation ou une possibilité, pas une certitude', ['Imposer la guérison','Imposer une complication','Affirmer un résultat pour terminer vite'], 'L’Atlas soutient la scène : il ne décide pas de l’état du personnage à la place du joueur.'],
 ['Un saignement majeur continue pendant un geste secondaire. Quelle logique suivre ?', 'Suspendre le geste non prioritaire et réévaluer', ['Terminer toutes les étapes sans regarder','Changer seulement la formulation','Déclarer que la progression stabilise le patient'], 'Le passage à l’étape suivante ne signifie pas une stabilisation. Les signes inquiétants gardent la priorité.'],
 ['Une extraction de corps étranger est évoquée. Quelle limite retenir ?', 'Seulement un objet accessible dans la scène, sans recherche aveugle', ['Tous les objets doivent être retirés immédiatement','Il faut sonder toute plaie en profondeur','L’absence de visibilité ne compte pas'], 'La technique d’extraction garde une limite d’accessibilité et ne donne aucune procédure réelle.'],
 ['Une écharpe de soutien est posée. Que décrit-elle ?', 'Un soutien du bras, pas la guérison d’une fracture', ['Une anesthésie','Une preuve que l’os est réparé','Un produit antiseptique'], 'Le soutien sert au confort narratif et au maintien, sans résultat médical garanti.'],
 ['Une trame possible est suggérée pendant un soin. Quelle place laisser au joueur ?', 'La possibilité de rebondir ou de refuser', ['Lui imposer un passé','Inventer sa maladie secrète','Exiger la prochaine scène'], 'Une accroche ouvre une possibilité de jeu sans décider de l’histoire du patient.'],
 ['Après le soin, quelle consigne est la plus utile au jeu ?', 'Surveiller l’évolution et revenir si l’état change', ['Promettre zéro complication','Garantir une guérison immédiate','Interdire toute nouvelle observation'], 'Le suivi reste une ouverture de scène et un repère de surveillance, pas une garantie.']
];

let quizBankCache = null;
function buildQuizBank(){
 if(quizBankCache)return quizBankCache;
 const bank=[];
 const clean=value=>String(value||'').replace(/[\u2013\u2014]/g,'-').trim();
 function addFields(items,group,fields){
  fields.forEach(([field,label])=>{
   const pool=[...new Set(items.map(item=>clean(item[field])).filter(Boolean))];
   if(pool.length<4)return;
   items.forEach((item,index)=>{
    const correct=clean(item[field]);if(!correct)return;
    if(field==='composition'&&correct===clean(item.form))return;
    let answersPool=pool.filter(value=>value!==correct);
    // Several oral/external descriptions can all be true: quiz the route family instead.
    let answer=correct;
    if(group==='Produits'&&field==='admin'){
     const route=/variable/i.test(correct)?'Variable selon la préparation':/hypoderm|inject/i.test(correct)?'Injection hypodermique':/inhal/i.test(correct)?'Voie inhalée':/orale/i.test(correct)?'Voie orale':'Application locale ou externe';
     answer=route;answersPool=['Variable selon la préparation','Injection hypodermique','Voie inhalée','Voie orale','Application locale ou externe'].filter(value=>value!==route);
    }
    const complement=field==='warning'?item.use:field==='use'?item.warning:null;
    bank.push({id:group+':'+index+':'+field,topic:group+':'+index,group,
     prompt:`D’après la fiche « ${clean(item.name)} », ${label}`,
     correct:answer,pool:answersPool,
     explanation:`${clean(item.name)} : ${correct}${/[.!?]$/.test(correct)?'':'.'}${complement?' '+clean(complement):''}`,
     reference:clean(item.name)});
   });
  });
 }
 addFields(lexique.filter(item=>item.category!=='Technique'),'Produits',[
  ['form','quelle forme est décrite ?'],['admin','quelle voie ou application est indiquée ?'],
  ['use','quel usage historique RP est décrit ?'],['warning','quelle précaution est indiquée ?'],
  ['sensory','quel repère sensoriel est décrit ?'],['composition','quelle composition est indiquée ?']
 ]);
 addFields(lexique.filter(item=>item.category==='Technique'),'Techniques',[
  ['form','quel matériel accompagne ce geste RP ?'],['admin','comment évoquer ce geste en scène ?'],
  ['use','dans quel contexte ce geste intervient-il ?'],['warning','quelle limite doit-on respecter ?']
 ]);
 addFields(equipmentLexicon,'Matériel',[
  ['desc','quelle description correspond à cet objet ?'],['use','quel usage RP est indiqué ?']
 ]);
 addFields(symptomLexicon,'Observations',[
  ['desc','quelle observation est décrite ?'],['rp','quel repère de scène est proposé ?']
 ]);
 quizSituations.forEach(([prompt,correct,wrong,explanation],index)=>bank.push({id:'Situation:'+index,topic:'Situation:'+index,group:'Situations',prompt,correct,pool:wrong,explanation,reference:'Parcours et repères RP de l’Atlas'}));
 quizBankCache=bank;return bank;
}
