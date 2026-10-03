// Ephemeral session only. No patient data, score storage or network calls.
let quizSession=null;
let quizPreviousIds=new Set();
function quizEscape(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function quizShuffle(list){
 const result=[...list];
 for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 return result;
}
function showQuiz(){renderQuiz();show('quiz');}
function startQuiz(){
 const bank=buildQuizBank(),selected=[],topics=new Set();
 const quotas=[['Produits',4],['Techniques',2],['Situations',2],['Matériel',1],['Observations',1]];
 quotas.forEach(([group,count])=>{
  const candidates=quizShuffle(bank.filter(q=>q.group===group)).sort((a,b)=>Number(quizPreviousIds.has(a.id))-Number(quizPreviousIds.has(b.id)));
  for(const q of candidates){if(topics.has(q.topic))continue;selected.push(q);topics.add(q.topic);if(--count===0)break;}
 });
 const questions=quizShuffle(selected).map(q=>({...q,options:quizShuffle([q.correct,...quizShuffle(q.pool).slice(0,3)])}));
 quizPreviousIds=new Set(questions.map(q=>q.id));
 quizSession={questions,index:0,answers:[],done:false};renderQuiz();focusQuizHeading();
}
function answerQuiz(index){
 if(!quizSession||quizSession.done||quizSession.answers[quizSession.index]!==undefined)return;
 const q=quizSession.questions[quizSession.index];if(!Number.isInteger(index)||index<0||index>=q.options.length)return;
 quizSession.answers[quizSession.index]=q.options[index];renderQuiz();
 document.getElementById('quizNext')?.focus({preventScroll:true});
}
function nextQuiz(){
 if(!quizSession||quizSession.done||quizSession.answers[quizSession.index]===undefined)return;
 if(quizSession.index===9)quizSession.done=true;else quizSession.index++;
 renderQuiz();focusQuizHeading();
}
function focusQuizHeading(){document.querySelector('#quiz .quiz-heading')?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'auto'});}
function renderQuiz(){
 const root=document.getElementById('quiz');
 const header='<div class="topbar"><div><h2>Quiz RP · 1889</h2><p class="muted">Pour retenir les repères de l’Atlas, pas pour apprendre des soins réels.</p></div><button type="button" class="secondary" onclick="goHome()">Accueil</button></div>';
 if(!quizSession){
  root.innerHTML=header+`<div class="quiz-workspace"><div class="section quiz-start"><span class="eyebrow">S’ENTRAÎNER HORS SCÈNE</span><h3 class="quiz-heading" tabindex="-1">10 questions, à ton rythme</h3><p>${buildQuizBank().length} questions disponibles, tirées des fiches et des parcours de l’Atlas.</p><div class="quiz-themes"><span>Produits et applications</span><span>Techniques</span><span>Matériel</span><span>Observations</span><span>Situations RP</span></div><p>Une réponse par question, puis une correction expliquée. Chaque série mélange les thèmes et les propositions.</p><button type="button" class="primary" onclick="startQuiz()">Commencer une série</button><p class="muted quiz-note">Sans chronomètre. Aucun résultat enregistré. Tu peux quitter l’onglet et reprendre ta série tant que la page reste ouverte.</p></div></div>`;return;
 }
 const s=quizSession;
 if(s.done){
  const score=s.questions.filter((q,i)=>s.answers[i]===q.correct).length;
  root.innerHTML=header+`<div class="quiz-workspace"><div class="section quiz-results"><span class="eyebrow">SÉRIE TERMINÉE</span><h3 class="quiz-heading" tabindex="-1">${score} / 10 bonnes réponses</h3><p>${score===10?'Tous les repères de cette série sont retenus.':score>=7?'De bons repères. Relis les corrections à revoir ci-dessous.':'Les corrections sont là pour apprendre. Prends le temps de revoir les repères.'}</p><button type="button" class="primary" onclick="startQuiz()">Nouvelle série de 10 questions</button></div><h3>Revoir les réponses</h3><div class="quiz-review">${s.questions.map((q,i)=>`<details class="section"><summary>${s.answers[i]===q.correct?'✓':'À revoir'} · ${i+1}. ${quizEscape(q.prompt)}</summary><p><b>Ta réponse :</b> ${quizEscape(s.answers[i])}</p><p><b>Bonne réponse :</b> ${quizEscape(q.correct)}</p><p>${quizEscape(q.explanation)}</p><small class="muted">Repère : ${quizEscape(q.reference)}</small></details>`).join('')}</div></div>`;return;
 }
 const q=s.questions[s.index],answered=s.answers[s.index]!==undefined,success=s.answers[s.index]===q.correct;
 root.innerHTML=header+`<div class="quiz-workspace"><div class="quiz-meta"><span>Question ${s.index+1} / 10</span><span class="badge">${quizEscape(q.group)}</span><span>${s.questions.slice(0,s.index).filter((item,i)=>s.answers[i]===item.correct).length} bonne(s) réponse(s) avant cette question</span></div><progress class="quiz-progress" max="10" value="${s.index+(answered?1:0)}" aria-label="Questions répondues"></progress><div class="section quiz-question"><h3 class="quiz-heading" tabindex="-1">${quizEscape(q.prompt)}</h3><p class="muted quiz-note">Choisis une seule réponse.</p><div class="quiz-options">${q.options.map((option,i)=>`<button type="button" class="quiz-option ${answered&&option===q.correct?'quiz-correct':answered&&option===s.answers[s.index]?'quiz-wrong':''}" onclick="answerQuiz(${i})" ${answered?'disabled':''}><span class="quiz-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span>${quizEscape(option)}${answered&&option===q.correct?'<small>✓ Bonne réponse</small>':answered&&option===s.answers[s.index]?'<small>Ta réponse</small>':''}</span></button>`).join('')}</div></div>${answered?`<div class="section quiz-feedback" role="status"><h3>${success?'✓ Bonne réponse':'À retenir'}</h3><p>${quizEscape(q.explanation)}</p><small class="muted">Repère : ${quizEscape(q.reference)}</small></div>`:''}<div class="quiz-actions"><button type="button" id="quizNext" class="primary" onclick="nextQuiz()" ${answered?'':'disabled'}>${s.index===9?'Voir mon résultat':'Question suivante'}</button></div></div>`;
}
