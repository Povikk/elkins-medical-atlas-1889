// More precise labels keep established, conservative anatomical branch families.
for(const [id,key] of Object.entries({gunshot:'gunArea',knife:'knifeArea',horse:'horseArea',fracture:'fractureArea',minor:'minorArea',animal:'animalArea',hoof:'hoofArea'})){
 const step=flows[id].steps.find(s=>zoneKeyForStep(s)===key);if(!step)continue;
 step.choices=step.choices.flatMap(choice=>{
  const label=choice.label;
  if(/Bras \/ épaule/.test(label))return ['Bras','Épaule'].map((name,i)=>({...choice,label:label.replace('Bras / épaule',name),set:{...choice.set,[key+'Part']:i?'shoulder':'arm'}}));
  if(/Jambe \/ cheville/.test(label))return ['Jambe','Cheville'].map((name,i)=>({...choice,label:label.replace('Jambe / cheville',name),set:{...choice.set,[key+'Part']:i?'ankle':'leg'}}));
  if(/Dos \/ nuque/.test(label))return ['Dos','Nuque'].map((name,i)=>({...choice,label:name,set:{...choice.set,[key+'Part']:i?'neck':'back'}}));
  if(/Tête \/|Tête\/|Tête \/ visage \/ cou/.test(label))return ['Tête','Visage','Cou'].map((name,i)=>({...choice,label:name,set:{...choice.set,[key+'Part']:['head','face','neck'][i]}}));
  if(/Thorax \/ poitrine|Côtes \/ poitrine|Thorax \/ côtes/.test(label))return ['Thorax','Côtes'].map((name,i)=>({...choice,label:label.replace(/Thorax \/ poitrine|Côtes \/ poitrine|Thorax \/ côtes/,name),set:{...choice.set,[key+'Part']:i?'ribs':'chest'}}));
  return [choice];
 });
 // Routes that only had limb labels also receive separate shoulders and ankles.
 for(const [parent,part,label] of [['arm','shoulder','Épaule'],['leg','ankle','Cheville']]){
  if(step.choices.some(c=>c.set[key+'Part']===part))continue;
  const template=step.choices.find(c=>c.set[key]===parent||c.set[key+'Part']===parent);if(!template)continue;
  for(const side of ['left','right'])step.choices.splice(step.choices.length-1,0,{label:label+' '+(side==='left'?'gauche':'droite'),set:{...template.set,[key+'Part']:part,[key+'Side']:side}});
 }
}
