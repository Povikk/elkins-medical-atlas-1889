// Visual RP reference shelf. Content comes from the existing catalogue.
const lexQuickGroups=[
 {title:'Antisepsie / désinfection',cue:'Nettoyer et préparer',icon:'1f9f4',tone:'clean',items:['Phénol / acide carbolique','Alcool','Iodoforme']},
 {title:'Douleur',cue:'Soulagement, avec précautions',icon:'1f489',tone:'pain',items:['Laudanum','Morphine']},
 {title:'Anesthésie',cue:'Actes spécialisés',icon:'1f32b',tone:'sleep',items:['Éther','Chloroforme','Cocaïne médicinale']},
 {title:'Baumes / soins de peau',cue:'Protéger la zone adaptée',icon:'1fad9',tone:'skin',items:['Préparation à l’arnica',"Onguent à l'oxyde de zinc",'Onguent protecteur','Carron oil / huile pour brûlures']},
 {title:'Pansements / soutien',cue:'Protéger et maintenir',icon:'1fa79',tone:'material',items:['Compresses / linge propre','Bandage','Attelle','Aiguille et fil de suture','Seringue hypodermique']},
 {title:'Gestes courants',cue:'Les repères du soin',icon:'1fa7a',tone:'gesture',items:['Compression d’un saignement','Nettoyage et antisepsie','Pansement et bandage','Suture','Immobilisation par attelle']}
];
function lexQuickEscape(text){return String(text||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function lexQuickNormalize(text){return String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,' ');}
function lexQuickEntry(name){return lexique.find(x=>x.name===name)||equipmentLexicon.find(x=>x.name===name);}
function renderLexQuick(query){
 const grid=document.getElementById('lexGrid');let count=0;
 const cells=lexQuickGroups.map((g,index)=>{
  const names=g.items.filter(name=>{const x=lexQuickEntry(name);return x&&lexQuickNormalize([name,g.title,x.tags,x.form,x.admin,x.use,x.desc].join(' ')).includes(query);});
  count+=names.length;
  return names.length?`<section class="lex-quick-cell lex-tone-${g.tone}"><div class="lex-quick-heading"><span class="lex-quick-icon" aria-hidden="true">${emojiIcon(g.icon)}</span><div><h3>${g.title}</h3><small>${g.cue}</small></div></div><div class="lex-quick-items">${names.map(name=>`<button type="button" class="lex-quick-item" data-quick-name="${lexQuickEscape(name)}" aria-haspopup="dialog" aria-expanded="false"><span>${lexQuickEscape(name)}</span><span class="lex-info-mark" aria-hidden="true">i</span></button>`).join('')}</div></section>`:'';
 }).join('');
 grid.innerHTML=`<p class="lex-quick-hint">Survole un nom pour sa fiche. Clique pour la garder ouverte, ou touche-le sur mobile. Sélection des repères RP, pas une fréquence médicale réelle.</p>${cells||'<p class="section">Aucun essentiel trouvé. Les autres références sont dans Médicaments ou Matériel.</p>'}`;
 grid.querySelectorAll('[data-quick-name]').forEach(button=>{
  button.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'&&!lexQuickPinned&&lexQuickDismissed!==button)openLexQuickTooltip(button,e);});
  button.addEventListener('pointermove',e=>{if(!lexQuickPinned&&lexQuickAnchor===button)positionLexQuickTooltip(e.clientX,e.clientY);});
  button.addEventListener('pointerleave',()=>{if(lexQuickDismissed===button)lexQuickDismissed=null;scheduleLexQuickHide();});
  button.addEventListener('focus',()=>{if(!lexQuickPinned&&lexQuickDismissed!==button)openLexQuickTooltip(button);});
  button.addEventListener('blur',scheduleLexQuickHide);
  button.addEventListener('click',e=>{if(lexQuickPinned&&lexQuickAnchor===button){hideLexQuickTooltip(true);return;}lexQuickDismissed=null;openLexQuickTooltip(button,e.detail?e:null);lexQuickPinned=true;lexQuickTooltip().classList.add('is-pinned');});
 });
 grid.dataset.resultCount=String(count);
}
let lexQuickAnchor=null,lexQuickPinned=false,lexQuickHideTimer,lexQuickDismissed=null,lexQuickOpenedAt=0;
function lexQuickTooltip(){
 let tip=document.getElementById('lexQuickTooltip');if(tip)return tip;
 tip=document.createElement('aside');tip.id='lexQuickTooltip';tip.className='lex-quick-tooltip';tip.hidden=true;tip.setAttribute('role','dialog');tip.setAttribute('aria-modal','false');tip.setAttribute('aria-label','Fiche de référence RP');document.body.append(tip);
 tip.addEventListener('pointerenter',()=>clearTimeout(lexQuickHideTimer));
 tip.addEventListener('pointerleave',scheduleLexQuickHide);
 tip.addEventListener('focusin',()=>clearTimeout(lexQuickHideTimer));
 tip.addEventListener('focusout',scheduleLexQuickHide);
 return tip;
}
function openLexQuickTooltip(button,event){
 lexQuickOpenedAt=performance.now();
 clearTimeout(lexQuickHideTimer);
 if(lexQuickAnchor&&lexQuickAnchor!==button)lexQuickAnchor.setAttribute('aria-expanded','false');
 lexQuickAnchor=button;button.setAttribute('aria-expanded','true');button.setAttribute('aria-controls','lexQuickTooltip');
 const x=lexQuickEntry(button.dataset.quickName),tip=lexQuickTooltip();if(!x)return;
 const field=(label,text)=>text?`<div class="lex-quick-field"><b>${label}</b><p>${lexQuickEscape(text)}</p></div>`:'';
 tip.innerHTML=`<div class="lex-quick-tip-heading"><h3>${lexQuickEscape(x.name)}</h3><button type="button" class="secondary" aria-label="Fermer la fiche" onclick="hideLexQuickTooltip(true)">×</button></div>${field('C’est quoi ?',x.type||x.desc)}${field('Forme / préparation',x.form)}${field('Composition',x.composition)}${field('Application / geste RP',x.admin||x.use)}${x.admin?field('Pour quoi ?',x.use):''}${field('Sensations / odeur',x.sensory||sensoryCue(x.name)?.[1])}${field('Précautions',x.warning||'Repère de jeu historique, pas une consigne de soin réelle. Aucun dosage ni recette.')}<small class="lex-quick-tip-note">1889 · Référence RP uniquement. Préparation descriptive, pas une recette.</small>`;
 tip.hidden=false;
 const rect=button.getBoundingClientRect();positionLexQuickTooltip(event?.clientX??rect.right,event?.clientY??rect.top);
}
function positionLexQuickTooltip(x,y){
 const tip=document.getElementById('lexQuickTooltip');if(!tip||tip.hidden)return;
 const gap=16,edge=10,w=tip.offsetWidth,h=tip.offsetHeight;
 let left=x+gap,top=y+gap;if(left+w>innerWidth-edge)left=x-w-gap;if(top+h>innerHeight-edge)top=innerHeight-h-edge;
 tip.style.left=`${Math.max(edge,Math.min(left,innerWidth-w-edge))}px`;tip.style.top=`${Math.max(edge,top)}px`;
}
function scheduleLexQuickHide(){
 if(lexQuickPinned)return;
 clearTimeout(lexQuickHideTimer);lexQuickHideTimer=setTimeout(()=>{const tip=document.getElementById('lexQuickTooltip');if(tip?.matches(':hover')||tip?.contains(document.activeElement)||lexQuickAnchor===document.activeElement)return;hideLexQuickTooltip();},180);
}
function hideLexQuickTooltip(restoreFocus=false){
 clearTimeout(lexQuickHideTimer);const anchor=lexQuickAnchor;lexQuickPinned=false;lexQuickAnchor=null;
 if(restoreFocus&&anchor)lexQuickDismissed=anchor;
 if(anchor)anchor.setAttribute('aria-expanded','false');const tip=document.getElementById('lexQuickTooltip');if(tip){tip.hidden=true;tip.classList.remove('is-pinned');}
 if(restoreFocus&&anchor?.isConnected){anchor.focus({preventScroll:true});hideLexQuickTooltip();}
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&lexQuickAnchor){hideLexQuickTooltip(true);e.preventDefault();}});
document.addEventListener('pointerdown',e=>{if(lexQuickAnchor&&!e.target.closest('#lexQuickTooltip,[data-quick-name]'))hideLexQuickTooltip();});
document.addEventListener('pointermove',e=>{if(lexQuickDismissed&&e.target.closest('[data-quick-name]')!==lexQuickDismissed)lexQuickDismissed=null;});
window.addEventListener('resize',()=>hideLexQuickTooltip());
window.addEventListener('scroll',e=>{if(performance.now()-lexQuickOpenedAt>180&&!document.getElementById('lexQuickTooltip')?.contains(e.target))hideLexQuickTooltip();},true);
