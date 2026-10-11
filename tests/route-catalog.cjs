const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('dist/index.html','utf8').split('<section id="cases"')[1].split('</section>')[0];
const entries=[...html.matchAll(/<button class="case" onclick="start\('([^']+)'\)">\s*<strong>([^<]+)<\/strong>/g)].map(m=>({id:m[1],title:m[2].trim()}));
assert.equal(entries.length,14);
const flows=Object.fromEntries(entries.map(x=>[x.id,{title:x.title}]));
Object.assign(flows,{fever:{title:'Fièvre / frissons'},cough:{title:'Toux persistante'},dental:{title:'Douleur dentaire'}});
const card=x=>({id:x.id,dataset:{},textContent:'⚠️ '+x.title,matches:()=>true,getAttribute:()=>`start('${x.id}')`});
const grid=items=>({children:items.map(card),append(c){this.children=this.children.filter(x=>x!==c);this.children.push(c);}});
const grids=[grid(entries),grid([{id:'cough',title:flows.cough.title},{id:'fever',title:flows.fever.title},{id:'dental',title:flows.dental.title}])];
const context=vm.createContext({flows,document:{querySelectorAll:()=>grids,addEventListener(){}},followupMenuKeys:[],followupTypes:{}});
vm.runInContext(fs.readFileSync('dist/route-catalog.js','utf8'),context);vm.runInContext('arrangeInterventionCategories()',context);
for(const g of grids){const names=g.children.map(x=>flows[x.id].title);assert.deepEqual(names,[...names].sort((a,b)=>a.localeCompare(b,'fr',{sensitivity:'base',numeric:true})));}
assert.equal(grids[0].children[0].id,'animal');
assert.equal(grids[0].children.find(x=>x.id==='hoof').dataset.routeAccent,'hoof');
assert.equal(grids[0].children.find(x=>x.id==='gunshot').dataset.routeAccent,'gunshot');
assert.equal(grids[0].children.filter(x=>x.dataset.routeAccent).length,3);
vm.runInContext('arrangeInterventionCategories()',context);assert.equal(grids[0].children.length,14);
console.log('French alphabetical order, emoji-independent sorting, consultations, three accents and idempotent DOM reorder passed.');
