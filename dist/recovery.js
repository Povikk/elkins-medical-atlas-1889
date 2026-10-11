// Explicit observation, never an automatic outcome of smelling salts.
for(const [id,flow] of Object.entries(flows)){
 const index=flow.steps.findIndex(s=>s.dynamicConscious||s.dynamicHead||s.dynamicBreathing||s.dynamicPoison||id==='animal'&&s.dynamicAnimal==='priority');
 if(index<0)continue;
 flow.steps.splice(index+1,0,{
  title:'État après les premiers gestes',recoveryCheck:true,
  do:['Indiquer les réactions et la respiration réellement constatées après les premiers gestes.',id==='strangulation'?'Un réveil ne suffit pas à écarter une lésion du cou ; continuer la surveillance.':'Les sels odorants ne garantissent pas un réveil ; continuer la surveillance.'],
  say:['« Vous m’entendez maintenant ? Pouvez-vous me répondre ? »'],
  choices:[
   {label:'Reprend connaissance, répond et respire',set:{latestState:'awake',latestBreathing:'yes'}},
   {label:'Reste confus, mais respire',set:{latestState:'confused',latestBreathing:'yes'}},
   {label:'Reste inconscient, mais respire',set:{latestState:'unresponsive',latestBreathing:'yes'}},
   {label:'Respiration faible / absente, ne répond pas',set:{latestState:'unresponsive',latestBreathing:'weak'}},
   {label:'État encore impossible à déterminer',set:{latestState:'unknown',latestBreathing:'unknown'}}
  ]
 });
}
