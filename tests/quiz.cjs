const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:2560,height:1440}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4173/');
 await page.locator('[data-shell-view="quiz"]').click();
 const audit=await page.evaluate(()=>{const bank=buildQuizBank();return {count:bank.length,ids:new Set(bank.map(q=>q.id)).size,prompts:new Set(bank.map(q=>q.prompt)).size,bad:bank.filter(q=>!q.correct||!q.explanation||new Set(q.pool).size<3||q.pool.includes(q.correct)).map(q=>q.id),groups:bank.reduce((a,q)=>(a[q.group]=(a[q.group]||0)+1,a),{})};});
 console.log('Bank audit',audit);assert(audit.count>=400);assert.equal(audit.ids,audit.count);assert.equal(audit.prompts,audit.count);assert.deepEqual(audit.bad,[]);
 const language=await page.evaluate(()=>buildQuizBank().filter(q=>/(?:^|[^\p{L}])(?:RP|joueurs?|scènes?|jouer|joué(?:e|s|es)?|joues|jeu|parcours|personnages?)(?=$|[^\p{L}])/iu.test([q.prompt,q.correct,q.explanation,...q.pool,quizNoteFor(q).text].join(' '))).map(q=>q.id));assert.deepEqual(language,[]);
 const sling=await page.evaluate(()=>buildQuizBank().find(q=>q.reference==='Écharpe de soutien'&&q.id.endsWith(':admin')));assert.match(sling.prompt,/mettre en place une écharpe de soutien/);assert.match(sling.correct,/Soutenir le bras/);
 assert.equal(await page.evaluate(()=>buildQuizBank().filter(q=>/d’après la fiche|repère de scène est proposé|dans le manuel/i.test(q.prompt)).length),0);
 const cough=await page.evaluate(()=>buildQuizBank().find(q=>q.reference==='Toux'&&q.id.endsWith(':rp')));assert.match(cough.prompt,/patient.*toux/i);assert.match(cough.correct,/depuis quand.*respiration/i);
 const notes=await page.evaluate(()=>({count:Object.keys(quizItemNotes).length,missing:buildQuizBank().filter(q=>q.group!=='Situations'&&!quizItemNotes[q.reference]).map(q=>q.reference),bad:buildQuizBank().filter(q=>!quizNoteFor(q).text||/[\u2013\u2014]/.test(quizNoteFor(q).text)).map(q=>q.id)}));assert.deepEqual(notes.missing,[]);assert.deepEqual(notes.bad,[]);console.log('Notes coverage',notes.count);
 await page.getByRole('button',{name:'Commencer une série',exact:true}).click();
 assert(await page.locator('#quizNext').isDisabled());
 const firstIds=await page.evaluate(()=>quizSession.questions.map(q=>q.id));
 assert.equal(new Set(firstIds).size,10);assert.equal(await page.evaluate(()=>new Set(quizSession.questions.map(q=>q.topic)).size),10);
 for(let i=0;i<10;i++){
  assert.equal(await page.locator('.quiz-option').count(),4);
  const index=await page.evaluate(wrong=>{const q=quizSession.questions[quizSession.index];return q.options.findIndex(x=>wrong?x!==q.correct:x===q.correct);},i===3);
  assert.equal(await page.locator('.quiz-anecdote').count(),0);await page.locator('.quiz-option').nth(index).click();assert(await page.locator('.quiz-feedback').isVisible());assert.equal(await page.locator('.quiz-correct').count(),1);assert.equal(await page.locator('.quiz-anecdote').count(),1);
  assert.equal(await page.locator('.quiz-option:disabled').count(),4);
  if(i===2){await page.locator('[data-shell-view="lexique"]').click();assert(await page.locator('#quiz').isHidden());await page.locator('[data-shell-view="quiz"]').click();assert.equal(await page.evaluate(()=>quizSession.index),2);assert(await page.locator('.quiz-feedback').isVisible());}
  await page.locator('#quizNext').click();
 }
 assert.match(await page.locator('.quiz-results').innerText(),/9 \/ 10/);assert.equal(await page.locator('.quiz-review details').count(),10);
 assert.equal(await page.locator('.quiz-review .quiz-anecdote').count(),10);
 await page.getByRole('button',{name:'Nouvelle série de 10 questions',exact:true}).click();assert.equal(await page.evaluate(ids=>quizSession.questions.filter(q=>ids.includes(q.id)).length,firstIds),0);
 const distribution=await page.evaluate(()=>{const positions=new Set();for(let i=0;i<100;i++){startQuiz();if(quizSession.questions.length!==10)throw Error('Wrong length');if(new Set(quizSession.questions.map(q=>q.topic)).size!==10)throw Error('Repeated topic');for(const q of quizSession.questions){if(new Set(q.options).size!==4)throw Error('Duplicate option');positions.add(q.options.indexOf(q.correct));}}return [...positions];});assert.equal(distribution.length,4);
 for(const width of [2560,1920,390,320])for(const theme of ['dark','light']){
  await page.setViewportSize({width,height:width>500?1440:844});
  await page.evaluate(t=>{applyTheme(t);setReadingSize('xlarge',false);showQuiz();const q=buildQuizBank().reduce((a,b)=>b.correct.length>a.correct.length?b:a);quizSession.questions[0]={...q,options:[q.correct,...q.pool.slice(0,3)]};quizSession.index=0;quizSession.answers=[];quizSession.done=false;renderQuiz();},theme);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const nav=await page.locator('[data-shell-view="quiz"]').boundingBox();assert(nav.x>=0&&nav.x+nav.width<=width);if(width<500){assert(nav.height<=56);assert.equal(await page.locator('[data-shell-view="quiz"]').evaluate(el=>getComputedStyle(el).fontSize),'0px');}
 }
 await page.setViewportSize({width:2560,height:1440});await page.evaluate(()=>{setReadingSize('normal',false);applyTheme('dark');startQuiz();});await page.screenshot({path:'tmp/site-qa/quiz-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'tmp/site-qa/quiz-mobile.png',fullPage:true});
 await page.reload();await page.locator('[data-shell-view="quiz"]').click();assert(await page.locator('.quiz-start').isVisible());
 assert.deepEqual(errors,[]);console.log('OK 10-question series, score, corrections, resume, randomized topics/options, bank, responsive themes and no persistence');
 }finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
