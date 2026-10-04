// Local Twemoji drawings avoid missing glyphs. Icons describe topics and routes.
const caseEmoji={unknown:'26a0',gunshot:'1f4a5',animal:'1f43e',knife:'1f52a',fight:'1f44a',horse:'1f40e',fracture:'1f9b4',minor:'1fa79',drowning:'1f30a',head:'1f9e0',burn:'1f525',poison:'2620'};
function emojiIcon(code){return `<img class="topic-emoji" src="assets/emoji/${code}.svg" alt="" aria-hidden="true" width="24" height="24" draggable="false">`;}
function lexEmoji(item){
 const name=item.name.toLowerCase();
 if(item.category==='Technique'){
   if(/suture|ligature/.test(name))return '1faa1';
   if(/attelle|luxation/.test(name))return '1f9b4';
   if(/pansement|bandage|compression/.test(name))return '1fa79';
   if(/examen|surveillance/.test(name))return '1fa7a';
   if(/anesthésie/.test(name))return '1f32b';
   return '1f9f0';
 }
 if(/sels odorants|ammoniaque/.test(name))return '1f443';
 if(/arnica/.test(name))return '1f33c';
 if(/injection|hypodermique|injectable/i.test(item.admin+' '+item.form))return '1f489';
 if(/inhal/i.test(item.admin))return '1f32b';
 if(/pommade|onguent|baume|base grasse/i.test(item.form+' '+name))return '1fad9';
 if(/orale/i.test(item.admin))return '1f944';
 if(/gaze|pansement/i.test(item.form))return '1fa79';
 return '1f9f4';
}
function referenceEmoji(item,type){
 if(type==='symptoms')return '1f50e';
 const name=item.name.toLowerCase();
 if(/seringue/.test(name))return '1f489';
 if(/aiguille|suture/.test(name))return '1faa1';
 if(/attelle/.test(name))return '1f9b4';
 if(/compresse|bandage/.test(name))return '1fa79';
 return '1f9f0';
}
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('#cases .case,#home .priority-case').forEach(button=>{
   const id=button.getAttribute('onclick')?.match(/start\('([^']+)'\)/)?.[1];
   if(caseEmoji[id])button.querySelector('strong').insertAdjacentHTML('afterbegin',emojiIcon(caseEmoji[id])+' ');
 });
 const homeIcons=['2695',null,'1f4d6','1f9f0','1fa7a'];
 document.querySelectorAll('#home .home>button').forEach((button,index)=>{
   if(homeIcons[index])button.querySelector('strong').insertAdjacentHTML('afterbegin',emojiIcon(homeIcons[index])+' ');
 });
 document.querySelectorAll('#surgery .case strong').forEach(title=>title.insertAdjacentHTML('afterbegin',emojiIcon('1f9f0')+' '));
});
