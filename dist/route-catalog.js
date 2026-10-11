// Presentation only: sort by the authored French title, never by the emoji.
function routeTitleCompare(a,b){return a.localeCompare(b,'fr',{sensitivity:'base',numeric:true});}
function routeAccent(id){return ['gunshot','hoof','animal'].includes(id)?id:'';}
function orderedFollowupKeys(){return [...followupMenuKeys].sort((a,b)=>routeTitleCompare(followupTypes[a].title,followupTypes[b].title));}
function arrangeInterventionCategories(){
 document.querySelectorAll('#cases .case-grid').forEach(grid=>{
  const cards=[...grid.children].filter(card=>card.matches('button.case'));
  const id=card=>card.getAttribute('onclick')?.match(/start\('([^']+)'\)/)?.[1];
  cards.sort((a,b)=>routeTitleCompare(flows[id(a)]?.title||a.textContent.trim(),flows[id(b)]?.title||b.textContent.trim()));
  for(const card of cards){const accent=routeAccent(id(card));if(accent)card.dataset.routeAccent=accent;grid.append(card);}
 });
}
document.addEventListener('DOMContentLoaded',arrangeInterventionCategories);
