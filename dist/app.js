let currentSurgery = null;
let surgeryStepIndex = 0;

let currentFlow = null;
let stepIndex = 0;
let answers = {};
let compactMode = false;
let activeStepTitle = "";
let activeRouteKind = "flow";

function storedTheme(){
  try { return localStorage.getItem("elkins-theme"); }
  catch(error) { return null; }
}

function updateThemeButton(){
  const button = document.getElementById("themeToggle");
  if(!button) return;
  const dark = document.documentElement.dataset.theme === "dark";
  button.textContent = dark ? " Mode clair" : "☾ Mode sombre";
  button.setAttribute("aria-label", dark ? "Activer le mode clair" : "Activer le mode sombre");
  button.setAttribute("aria-pressed", String(dark));
}

function applyTheme(theme, persist = false){
  const safeTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = safeTheme;
  if(persist){
    try { localStorage.setItem("elkins-theme", safeTheme); }
    catch(error) {}
  }
  updateThemeButton();
}

function toggleTheme(){
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
}

const themeToggle = document.getElementById("themeToggle");
if(themeToggle) themeToggle.addEventListener("click", toggleTheme);
updateThemeButton();

const anatomyPlates = {
  skeleton:{
    title:"Squelette",
    image:"assets/anatomy/plate-7.webp",
    alt:"Planche anatomique du squelette humain, vue antérieure, issue du manuel médical RP de 1889.",
    intro:"Le squelette soutient le corps et protège plusieurs organes. Sélectionne une zone pour obtenir un repère rapide.",
    hotspots:[
      {label:"Crâne",x:45,y:15,w:11,h:9,role:"Protège le cerveau et forme la structure de la tête.",observe:"Après un choc, observer confusion, vomissements, somnolence ou perte de connaissance.",caution:"Éviter les manipulations inutiles de la tête et du cou."},
      {label:"Épaule et clavicule",x:34,y:25,w:31,h:8,role:"Relient le membre supérieur au thorax et participent aux mouvements du bras.",observe:"Douleur, déformation, gonflement et difficulté à lever le bras.",caution:"Soutenir le membre sans forcer un mouvement douloureux."},
      {label:"Cage thoracique",x:39,y:31,w:22,h:17,role:"Les côtes et le sternum protègent notamment le coeur et les poumons.",observe:"Douleur à l'inspiration, essoufflement ou sang craché rendent la scène sérieuse.",caution:"La respiration passe avant l'examen détaillé de la zone."},
      {label:"Colonne vertébrale",x:46,y:39,w:9,h:18,role:"Soutient le tronc et protège la moelle épinière.",observe:"Douleur du dos ou du cou, faiblesse, fourmillements ou perte de sensibilité.",caution:"Après une grosse chute, éviter de faire tourner ou relever brusquement le patient."},
      {label:"Bassin",x:40,y:49,w:21,h:12,role:"Relie le tronc aux membres inférieurs et transmet le poids du corps.",observe:"Douleur profonde, difficulté à se tenir debout ou à marcher.",caution:"Ne pas forcer l'appui si une blessure importante est suspectée."},
      {label:"Bras et avant-bras",x:24,y:30,w:18,h:34,role:"L'humérus, le radius et l'ulna forment l'armature du membre supérieur.",observe:"Déformation, douleur, mobilité, sensibilité des doigts et circulation.",caution:"Immobiliser dans une position stable si une fracture est possible."},
      {label:"Jambes",x:37,y:58,w:27,h:31,role:"Le fémur, le tibia et le péroné supportent le déplacement et l'appui.",observe:"Déformation, gonflement, douleur, mouvement du pied et sensibilité des orteils.",caution:"Éviter la marche et immobiliser si le mouvement est impossible ou très douloureux."}
    ]
  },
  muscles:{
    title:"Muscles",
    image:"assets/anatomy/plate-8.webp",
    alt:"Planche anatomique des principaux muscles, vue antérieure, issue du manuel médical RP de 1889.",
    intro:"Les muscles produisent le mouvement et stabilisent les articulations. Les informations restent des repères RP simples.",
    hotspots:[
      {label:"Cou",x:44,y:17,w:14,h:11,role:"Les muscles du cou participent aux mouvements de la tête et à sa stabilité.",observe:"Douleur, raideur ou difficulté à tourner la tête après un choc.",caution:"Ne pas tester brutalement l'amplitude après une chute importante."},
      {label:"Épaules",x:31,y:24,w:38,h:10,role:"Les deltoïdes entourent l'épaule et permettent de lever ou déplacer le bras.",observe:"Douleur, gonflement et incapacité à lever le membre.",caution:"Une position anormale peut évoquer une luxation dans la scène."},
      {label:"Poitrine",x:38,y:28,w:25,h:16,role:"Les grands pectoraux participent aux mouvements des bras et de la cage thoracique.",observe:"Douleur provoquée par le mouvement ou la respiration.",caution:"Distinguer une douleur musculaire d'une gêne respiratoire plus inquiétante."},
      {label:"Bras",x:24,y:27,w:17,h:31,role:"Le biceps et les muscles de l'avant-bras commandent une grande partie des mouvements du coude, du poignet et de la main.",observe:"Douleur à la flexion, faiblesse ou mouvement limité.",caution:"Ne pas forcer si une fracture ou une luxation reste possible."},
      {label:"Abdomen",x:41,y:40,w:20,h:19,role:"Les muscles abdominaux soutiennent le tronc et protègent partiellement la région abdominale.",observe:"Douleur, contraction défensive ou ventre anormalement dur.",caution:"Une douleur profonde après une blessure ne doit pas être réduite à une simple douleur musculaire."},
      {label:"Cuisses",x:33,y:57,w:34,h:20,role:"Les quadriceps et les adducteurs participent à la marche et à la stabilité du genou et du bassin.",observe:"Douleur, gonflement, faiblesse ou difficulté à prendre appui.",caution:"Faire reposer la zone et éviter l'appui si la douleur est forte."},
      {label:"Bas des jambes",x:38,y:73,w:25,h:17,role:"Les muscles de la jambe commandent une partie des mouvements de la cheville et du pied.",observe:"Douleur à la marche, gonflement ou difficulté à bouger le pied.",caution:"Vérifier aussi la sensibilité et la chaleur du pied après un traumatisme."}
    ]
  },
  organs:{
    title:"Organes",
    image:"assets/anatomy/plate-9.webp",
    alt:"Planche anatomique des principaux organes, vue antérieure, issue du manuel médical RP de 1889.",
    intro:"Cette planche aide à situer les organes principaux. Elle ne remplace pas l'observation des signes visibles dans la scène.",
    hotspots:[
      {label:"Cerveau",x:45,y:14,w:14,h:9,role:"Centre principal de la conscience, du mouvement, de la mémoire et des perceptions.",observe:"Confusion, perte de connaissance, vomissements, pupilles anormales ou somnolence.",caution:"Surveiller l'évolution après tout traumatisme crânien important."},
      {label:"Trachée",x:48,y:23,w:10,h:10,role:"Conduit l'air du cou vers les poumons.",observe:"Voix modifiée, toux, gêne respiratoire ou bruit inhabituel.",caution:"Toute difficulté à respirer devient prioritaire."},
      {label:"Poumons",x:37,y:30,w:28,h:19,role:"Assurent les échanges respiratoires dans la poitrine.",observe:"Essoufflement, douleur à l'inspiration, respiration asymétrique ou sang craché.",caution:"Une blessure du thorax avec gêne respiratoire est une situation critique."},
      {label:"Coeur",x:48,y:36,w:12,h:11,role:"Fait circuler le sang dans tout le corps.",observe:"Pouls faible, pâleur, froid, faiblesse ou perte de connaissance.",caution:"En scène, traiter d'abord la respiration et les hémorragies visibles."},
      {label:"Foie",x:36,y:46,w:24,h:12,role:"Grand organe situé surtout dans la partie droite de l'abdomen supérieur.",observe:"Douleur profonde après un choc ou une plaie de l'abdomen.",caution:"Une atteinte interne ne peut pas être confirmée uniquement par le survol de la zone."},
      {label:"Estomac et rate",x:52,y:47,w:17,h:12,role:"L'estomac participe à la digestion. La rate se situe dans la partie gauche de l'abdomen supérieur.",observe:"Douleur, vomissements, ventre dur ou faiblesse après un traumatisme.",caution:"Éviter de faire boire si une opération abdominale est envisagée dans la scène."},
      {label:"Reins",x:37,y:52,w:30,h:11,role:"Filtrent le sang et participent à la production de l'urine.",observe:"Douleur du flanc ou du dos après un choc.",caution:"Rester prudent, car la planche montre une position simplifiée vue de face."},
      {label:"Intestins",x:38,y:57,w:27,h:21,role:"Occupent une grande partie de l'abdomen et participent à la digestion.",observe:"Douleur diffuse, ventre dur, vomissements ou aggravation progressive.",caution:"Une plaie abdominale profonde relève de la Chirurgie lourde dans l'application."},
      {label:"Vessie",x:46,y:75,w:15,h:10,role:"Réservoir de l'urine situé dans le bassin.",observe:"Douleur basse dans l'abdomen ou le bassin après un traumatisme.",caution:"Ne pas poser de diagnostic automatique à partir de la seule localisation."}
    ]
  }
};

let currentAnatomyPlate = "skeleton";
Object.entries(atlasLabelRegions).forEach(([key,regions])=>{
  const original = anatomyPlates[key].hotspots;
  anatomyPlates[key].hotspots = regions.map(([label,x,y,w,h,group,role])=>({
    ...original[group],label,role,x:x/1158*100,y:y/1638*100,w:w/1158*100,h:h/1638*100
  }));
});

let anatomyHideTimer;
let anatomyKeyboardTooltip = false;
const anatomyTooltip = document.createElement("div");
anatomyTooltip.id = "anatomyTooltip";
anatomyTooltip.className = "anatomy-tooltip";
anatomyTooltip.setAttribute("role","tooltip");
anatomyTooltip.hidden = true;
document.body.append(anatomyTooltip);
anatomyTooltip.addEventListener("pointerenter",()=>clearTimeout(anatomyHideTimer));
anatomyTooltip.addEventListener("pointerleave",()=>{if(!anatomyPinned)hideAnatomyTooltip();});

function hideAnatomyTooltip(){
  anatomyPinned=false;anatomyTooltip.classList.remove('pinned');
  clearTimeout(anatomyHideTimer);
  anatomyTooltip.hidden = true;
  document.querySelectorAll('[aria-describedby="anatomyTooltip"]').forEach(el=>el.removeAttribute("aria-describedby"));
}
function scheduleAnatomyHide(){
  if(anatomyPinned)return;
  clearTimeout(anatomyHideTimer);
  anatomyHideTimer = setTimeout(hideAnatomyTooltip,180);
}
function positionAnatomyTooltip(event,button){
  if(anatomyPinned && event?.type==='pointermove')return;
  if(anatomyTooltip.hidden) return;
  const rect = button.getBoundingClientRect();
  const x = event && event.type !== "focus" && event.type !== "focusin" ? event.clientX : rect.right;
  const y = event && event.type !== "focus" && event.type !== "focusin" ? event.clientY : rect.bottom;
  const box = anatomyTooltip.getBoundingClientRect();
  let left = x + 14, top = y + 16;
  if(left + box.width > innerWidth - 10) left = x - box.width - 14;
  if(top + box.height > innerHeight - 10) top = y - box.height - 16;
  anatomyTooltip.style.left = `${Math.max(10,Math.min(left,innerWidth-box.width-10))}px`;
  anatomyTooltip.style.top = `${Math.max(10,Math.min(top,innerHeight-box.height-10))}px`;
}
function revealAnatomyTooltip(key,index,event,button){
  if(anatomyPinned && event && event.type!=='focus')return;
  if(event?.pointerType === "touch") return;
  const spot = anatomyPlates[key]?.hotspots[index];
  if(!spot) return;
  clearTimeout(anatomyHideTimer);
  anatomyKeyboardTooltip = event?.type === "focus";
  document.querySelectorAll('[aria-describedby="anatomyTooltip"]').forEach(el=>el.removeAttribute("aria-describedby"));
  const dialog = document.getElementById("anatomyDialog");
  (dialog.open ? dialog : document.body).append(anatomyTooltip);
  anatomyTooltip.innerHTML = anatomyInfoMarkup(anatomyPlates[key],spot);
  anatomyTooltip.hidden = false;
  button.setAttribute("aria-describedby","anatomyTooltip");
  positionAnatomyTooltip(event,button);
}
function anatomyStageMarkup(plate,key,zoom=false){
  return `<img ${zoom ? 'id="anatomyDialogImage"' : ''} src="${plate.image}" alt="${plate.alt}" loading="lazy" decoding="async" draggable="false">
    <div class="anatomy-hotspots">${plate.hotspots.map((spot,index)=>`
      <button type="button" class="anatomy-hotspot anatomy-label" style="left:${spot.x}%;top:${spot.y}%;width:${spot.w}%;height:${spot.h}%"
        aria-label="Afficher la fiche : ${spot.label}"
        onpointerenter="revealAnatomyTooltip('${key}',${index},event,this)"
        onpointermove="positionAnatomyTooltip(event,this)"
        onpointerleave="scheduleAnatomyHide()"
        onfocus="revealAnatomyTooltip('${key}',${index},event,this)"
        onblur="scheduleAnatomyHide()"
        onclick="pinAnatomyTooltip('${key}',${index},this)"></button>`).join("")}</div>`;
}
document.addEventListener("keydown",event=>{if(event.key === "Escape") hideAnatomyTooltip();});
document.addEventListener("pointerdown",event=>{
  if(!event.target.closest(".anatomy-label,.anatomy-tooltip")) hideAnatomyTooltip();
});
window.addEventListener("scroll",event=>{
  if(anatomyPinned)return;
  if(anatomyTooltip.contains(event.target)) return;
  if(anatomyKeyboardTooltip && document.activeElement?.matches(".anatomy-label")){
    positionAnatomyTooltip(null,document.activeElement);
  } else hideAnatomyTooltip();
},true);
window.addEventListener("resize",hideAnatomyTooltip);

function anatomyInfoMarkup(plate, hotspot){
  return `<span class="badge">${plate.title}</span><strong>${hotspot.label}</strong>
    <p><b>Rôle :</b> ${hotspot.role}</p>
    <p><b>À observer en RP :</b> ${hotspot.observe}</p>
    <p class="anatomy-caution"><b>Prudence :</b> ${hotspot.caution}</p>${atlasExtras(hotspot)}`;
}

function selectAnatomyPlate(key){
  if(!Object.prototype.hasOwnProperty.call(anatomyPlates,key)) return;
  hideAnatomyTooltip();
  currentAnatomyPlate = key;
  const plate = anatomyPlates[key];
  document.querySelectorAll("[data-anatomy-tab]").forEach(button=>{
    const active = button.dataset.anatomyTab === key;
    button.classList.toggle("active",active);
    button.setAttribute("aria-selected",String(active));
  });
  const stage = document.getElementById("anatomyStage");
  if(stage){
    stage.innerHTML = anatomyStageMarkup(plate,key);
  }
}

function showAtlas(){
  selectAnatomyPlate(currentAnatomyPlate);
  show("atlas");
}

function openAnatomyDialog(){
  const dialog = document.getElementById("anatomyDialog");
  const stage = document.getElementById("anatomyZoomStage");
  const title = document.getElementById("anatomyDialogTitle");
  const plate = anatomyPlates[currentAnatomyPlate];
  if(!dialog || !stage || !title || !plate) return;
  hideAnatomyTooltip();
  stage.innerHTML = anatomyStageMarkup(plate,currentAnatomyPlate,true);
  title.textContent = `Planche : ${plate.title}`;
  dialog.showModal();
}

function closeAnatomyDialog(){
  hideAnatomyTooltip();
  document.getElementById("anatomyDialog")?.close();
}

function start(id){
  if(!Object.prototype.hasOwnProperty.call(flows, id)) return;
  resetRpScene();
  currentFlow = id;
  stepIndex = 0;
  answers = {};
  flowHistory = [];
  interventionEnded = false;
  materialPanelOpen = false;
  render();
  show("flow");
}

function showSurgery(){
  currentSurgery = null;
  surgeryStepIndex = 0;
  materialPanelOpen = false;
  show("surgery");
}

function openSurgery(id){
  if(!surgeries[id]) return;
  resetRpScene();
  answers = {};
  surgeryEnded = false;
  currentSurgery = id;
  surgeryStepIndex = 0;
  materialPanelOpen = false;
  renderSurgery();
  show("surgeryFlow");
}

function renderSurgery(capture=false){
  if(compactMode&&!capture)return renderCondensed('surgery');
  if(!capture)document.getElementById('surgeryFlow').classList.remove('condensed-workspace');
  if(!capture)rpPhraseBlocks=[];
  activeRouteKind = "surgery";
  const s = surgeries[currentSurgery];
  const step = s.steps[surgeryStepIndex];
  activeStepTitle = step.title;
  const pct = Math.round(((surgeryStepIndex+1)/s.steps.length)*100);

  let html = `
    <div class="topbar">
      <div>
        <span class="badge">Chirurgie lourde</span>
        ${urgencyBadge(careUrgency('critical'))}
        <h2 style="margin:8px 0 0">${s.title}</h2>
        <div class="muted">${s.duration}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        ${compactButton("surgery")}
      </div>
    </div>
    <details class="surgery-indication"><summary>Quand utiliser cette chirurgie</summary><p>${s.intro}</p></details>
    <div class="progress"><div style="width:${pct}%"></div></div>
    ${!capture?careMemoMarkup('surgery'):''}
      ${rpChoicesMarkup()}
    ${materialPanel("surgery")}
    ${sceneToolbar("surgery")}
    ${rpContextMarkup("surgery")}
    <h3>${surgeryStepIndex+1} / ${s.steps.length} - ${step.title}</h3>
  `;

  if(step.do) html += section("À faire", step.do);
  if(step.say) {
    html += sayLines(step.say);
  } else {
    html += sayLines(["« Très bien, je passe à l’étape suivante. Restez tranquille. »"]);
  }
  if(step.meds) html += meds(step.meds);
  html += careStepExtras(step);

  html += `<div class="nav">
    <button class="secondary" onclick="prevSurgery()">Précédent</button>
    <button class="next" onclick="nextSurgery()">${surgeryStepIndex===s.steps.length-1?"Terminer":"Étape suivante"}</button>
  </div>`;

  if(capture)return html;
  document.getElementById("surgeryFlow").innerHTML = html;
  finalizeCareLayout(document.getElementById('surgeryFlow'));
}

function nextSurgery(){
  const s = surgeries[currentSurgery];
  if(surgeryStepIndex < s.steps.length-1){
    surgeryStepIndex++;
    renderSurgery();
  }else{
    surgeryEnded = true;
    document.getElementById("surgeryFlow").innerHTML = endingMarkup("surgery");
  }
}

function prevSurgery(){
  if(surgeryStepIndex > 0){
    surgeryStepIndex--;
    renderSurgery();
  }else{
    showSurgery();
  }
}


function toggleCompact(target){
  compactMode = !compactMode;
  if(target === "surgery" && currentSurgery){
    renderSurgery();
  } else if(currentFlow){
    render();
  }
}

function compactButton(target){
  return `<button class="compact-toggle ${compactMode ? "on" : ""}" aria-pressed="${compactMode}" onclick="toggleCompact('${target}')">
    ${compactMode ? "Vue détaillée" : "Condensé"}
  </button>`;
}

function show(id){
  if(typeof hideLexQuickTooltip==='function')hideLexQuickTooltip();
  placeReadingControls();
  hideAnatomyTooltip();
  const target = document.getElementById(id);
  if(!target) return;
  // Only one care workspace owns form controls and IDs at a time.
  if(id==='flow')document.getElementById('surgeryFlow').innerHTML='';
  if(id==='surgeryFlow')document.getElementById('flow').innerHTML='';
  if(id!=='flow'&&id!=='surgeryFlow'){
    answers={};flowHistory=[];currentFlow=null;currentSurgery=null;materialPanelOpen=false;resetRpScene();
    document.getElementById('flow').innerHTML='';document.getElementById('surgeryFlow').innerHTML='';
  }
  ["home","cases","lexique","surgery","surgeryFlow","atlas","flow","stories","quiz"].forEach(x=>document.getElementById(x)?.classList.add("hidden"));
  target.classList.remove("hidden");
  const shellView = id === "flow" ? "cases" : id === "surgeryFlow" ? "surgery" : id;
  document.querySelectorAll("[data-shell-view]").forEach(button=>{
    const active = button.dataset.shellView === shellView;
    button.classList.toggle("active",active);
    if(active) button.setAttribute("aria-current","page");
    else button.removeAttribute("aria-current");
  });
  const compactSections = ["cases","lexique","surgery","surgeryFlow","atlas","flow","stories","quiz"];
  document.body.classList.toggle("compact-header", compactSections.includes(id));
  window.scrollTo({top:0,behavior:"auto"});
}
function goHome(){
  currentFlow=null;
  currentSurgery=null;
  stepIndex=0;
  surgeryStepIndex=0;
  answers={};
  materialPanelOpen=false;
  compactMode=false;
  show("home");
}
function showCases(){
  currentFlow=null;
  stepIndex=0;
  answers={};
  materialPanelOpen=false;
  show("cases");
}
function showLexique(){
  lexTab = "quick";
  document.getElementById("lexCategory").value = "";
  document.getElementById("lexContext").value = "";
  const input = document.getElementById("lexSearch");
  if(input) input.value = "";
  updateLexTabs();
  filterLexique();
  show("lexique");
}

function setLexTab(tab){
  if(!["quick","meds","equipment","symptoms"].includes(tab)) return;
  lexTab = tab;
  const input = document.getElementById("lexSearch");
  if(input) input.value = "";
  updateLexTabs();
  filterLexique();
}

function updateLexTabs(){
  document.getElementById("lexFilters").classList.toggle("hidden", lexTab !== "meds");
  const categorySelect = document.getElementById("lexCategory");
  if(categorySelect.options.length === 1){
    [...new Set(lexique.map(x=>x.category || "Autre"))].sort((a,b)=>a.localeCompare(b,"fr")).forEach(category=>{
      categorySelect.add(new Option(category,category));
    });
  }
  document.querySelectorAll("[data-lex-tab]").forEach(btn=>{
    btn.classList.toggle("active", btn.dataset.lexTab === lexTab);
  });
  const grid = document.getElementById("lexGrid");
  const helper = document.getElementById("lexHelpful");
  const search = document.getElementById("lexSearch");
  if(grid) grid.classList.remove("hidden");
  if(grid) grid.classList.toggle('lex-quick-grid',lexTab==='quick');
  if(helper) helper.classList.toggle("hidden", lexTab !== "meds");
  if(search){
    search.classList.remove("hidden");
    const placeholders = {
      quick:"Rechercher dans les essentiels : produit, geste, usage...",
      meds:"Rechercher un médicament, un usage ou une administration...",
      equipment:"Rechercher un instrument ou du matériel...",
      symptoms:"Rechercher un symptôme ou un signe..."
    };
    search.placeholder = placeholders[lexTab] || "Rechercher dans le lexique...";
  }
}

function filterLexique(){
  if(typeof hideLexQuickTooltip==='function')hideLexQuickTooltip();
  const input = document.getElementById("lexSearch");
  const normalize = value => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g," ");
  const q = normalize(input ? input.value.trim() : "");
  if(lexTab === "quick"){
    renderLexQuick(q);
  } else if(lexTab === "meds"){
    const category = document.getElementById("lexCategory").value;
    const context = document.getElementById("lexContext").value;
    const list = lexique.filter(x =>
      (!category || x.category === category) && (!context || x.context === context) &&
      normalize([x.name,x.tags,x.category,x.type,x.form,x.admin,x.use,x.context].join(" ")).includes(q)
    );
    document.getElementById("lexCount").textContent = `${list.length} / ${lexique.length} fiches`;
    renderLexique(list);
  } else if(lexTab === "equipment"){
    const list = equipmentLexicon.filter(x =>
      normalize(x.name+" "+x.tags+" "+x.desc+" "+x.use).includes(q)
    );
    renderReferenceCards(list, "equipment");
  } else if(lexTab === "symptoms"){
    const list = symptomLexicon.filter(x =>
      normalize(x.name+" "+x.tags+" "+x.desc+" "+x.rp).includes(q)
    );
    renderReferenceCards(list, "symptoms");
  }
}

function renderLexique(list){
  const grid = document.getElementById("lexGrid");
  const sorted = sortLexReferences(list).sort((a,b)=>a.category.localeCompare(b.category,'fr'));
  grid.innerHTML = sorted.length ? sorted.map((x,index)=>`
    ${index===0 || sorted[index-1].category!==x.category ? `<h3 class="lex-category-heading">${x.category}</h3>` : ''}
    <div class="lex-card ${categoryClass(x.category)}">
      <strong>${emojiIcon(lexEmoji(x))} ${x.name}</strong>
      ${lexPriority(x) ? `<span class="lex-priority">${priorityLabel(x)}</span>` : ''}
      <div class="muted">${x.type}</div>
      <div class="cat-badge">${x.category || "Autre"}</div>
      ${x.context ? `<span class="lex-context">${x.context}</span>` : ""}
      <small><b>Forme :</b> ${x.form}</small>
      <small><b>Administration :</b> ${x.admin}</small>
      <small><b>Usage RP :</b> ${x.use}</small>
      <details class="lex-details"><summary>Détails et précautions</summary>
        ${x.composition ? `<small><b>Composition :</b> ${x.composition}</small>` : ""}
        <small><b>Disponibilité en 1889 :</b> ${x.availability}</small>
        ${x.sensory || sensoryCue(x.name) ? `<small><b>Sensations / odeur :</b> ${x.sensory || sensoryCue(x.name)[1]}</small>` : ""}
        <small><b>Attention :</b> ${x.warning || "Référence historique uniquement. Aucun dosage ni recette ; ne pas transposer aux soins réels."}</small>
        ${x.sources ? `<small><b>Sources :</b> ${x.sources.map(s=>`<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title}</a>`).join(" · ")}</small>` : ""}
      </details>
    </div>
  `).join("") : `<div class="section">Aucun résultat.</div>`;
}

function renderReferenceCards(list,type){
  const grid = document.getElementById("lexGrid");
  const sorted = sortLexReferences(list);
  grid.innerHTML = sorted.length ? sorted.map(x=>`
    <div class="reference-card">
      <strong>${emojiIcon(referenceEmoji(x,type))} ${x.name}</strong>
      ${lexPriority(x) ? '<span class="lex-priority">Repère courant en scène RP</span>' : ''}
      <small><b>Ce que c'est :</b> ${x.desc}</small>
      <small><b>${type === "equipment" ? "Utilisation RP" : "À retenir en RP"} :</b> ${type === "equipment" ? x.use : x.rp}</small>
    </div>
  `).join("") : `<div class="section">Aucun résultat.</div>`;
}















function toggleMaterialPanel(kind){
  materialPanelOpen = !materialPanelOpen;
  if(kind === "surgery") renderSurgery();
  else render();
}

function materialPanel(kind){
  if(!materialPanelOpen) return "";
  return sceneMaterialMarkup(kind);
}

function applyChoice(set){
  const zoneKey=zoneKeyForStep(flows[currentFlow].steps[stepIndex]);
  if(zoneKey&&Object.hasOwn(set,zoneKey)){toggleZoneSelection(stepIndex,set);return;}
  flowHistory.push({index:stepIndex,answers:{...answers}});
  Object.assign(answers,set);
  next(true);
}
function next(fromChoice=false){
  if(!fromChoice&&!zoneComplete(flows[currentFlow].steps[stepIndex]))return;
  if(!fromChoice) flowHistory.push({index:stepIndex,answers:{...answers}});
  const max = flows[currentFlow].steps.length;
  let candidate=stepIndex+1;
  while(candidate<max && shouldSkipStep(flows[currentFlow].steps[candidate])) candidate++;
  if(candidate<max){stepIndex=candidate;render();}else renderEnd();
}
function prev(){
  const previous=flowHistory.pop();
  if(previous){const latest=Object.fromEntries(Object.entries(answers).filter(([key])=>key.startsWith('latest')));stepIndex=previous.index;answers={...previous.answers,...latest};interventionEnded=false;render();}
  else showCases();
}
function section(title,items,cls=""){
  const label=/^Priorité/.test(title)?'Priorité':/surveill|vérification finale|avant de terminer|consignes/i.test(title)?'À surveiller':/optionnel|soin local|douleur/i.test(title)?'Si nécessaire':'';
  const heading=`<h3>${title}${label && label!==title ? ` <small class="step-cue">${label}</small>` : ''}</h3>`;
  const row=x=>`<li>${/\bsi\b|peut |éventuel|selon la scène/i.test(x)?'<span class="action-cue">Si nécessaire</span> ':''}${x}</li>`;
  if(compactMode){
    if(title === "Matériel"){
      return `<div class="section ${cls}">${heading}<div class="compact-inline">${items.join(" · ")}</div></div>`;
    }
    const limited = compactActions(title,items);
    return `<div class="section ${cls}">${heading}<ul>${limited.map(row).join("")}</ul></div>`;
  }
  return `<div class="section ${cls}">${heading}<ul>${items.map(row).join("")}</ul></div>`;
}

function extraPhraseVariants(title){
  const t = (title || "").toLowerCase();
  if(t.includes("saign") || t.includes("hémorrag")){
    return ["« Je maintiens la pression, ne bougez pas. »","« Le saignement ralentit, continuez à respirer calmement. »"];
  }
  if(t.includes("suture") || t.includes("fermer") || t.includes("refermer")){
    return ["« Je vais rapprocher les bords de la plaie. »","« Encore quelques points et ce sera terminé. »"];
  }
  if(t.includes("nettoy") || t.includes("antisept")){
    return ["« Je vais nettoyer maintenant, ça risque de piquer. »","« Je préfère que la zone soit propre avant de continuer. »"];
  }
  if(t.includes("douleur") || t.includes("soulager") || t.includes("anesth")){
    return ["« Je vais vous donner quelque chose pour la douleur. »","« Dites-moi si la douleur devient plus forte. »"];
  }
  if(t.includes("exam") || t.includes("évaluer") || t.includes("vérif")){
    return ["« Je vais vérifier rapidement avant de continuer. »","« Dites-moi immédiatement si quelque chose vous fait très mal. »"];
  }
  if(t.includes("respir") || t.includes("stabil")){
    return ["« Restez avec moi et respirez doucement. »","« Ne vous relevez pas pour le moment. »"];
  }
  if(t.includes("immobil") || t.includes("fracture") || t.includes("luxation")){
    return ["« Je vais immobiliser la zone pour éviter d’aggraver la blessure. »","« Ne forcez pas sur ce membre. »"];
  }
  if(t.includes("pansement") || t.includes("protéger")){
    return ["« Je vais protéger la zone maintenant. »","« Gardez ce pansement propre et sec. »"];
  }
  return ["« Très bien, je continue. Dites-moi si quelque chose change. »"];
}

function sayLines(items){
  if(compactMode)return '';
  return rpDialogue(items);
}
function sensoryCue(name){
  const n = name.toLowerCase();
  if(n.includes("iodoforme")) return ["« Ce pansement a une odeur marquée. Dites-moi s'il vous gêne. »", "Poudre jaune ou gaze préparée, à odeur caractéristique persistante."];
  if(n.includes("oxyde de zinc")) return ["« Je pose une couche protectrice sur la zone irritée. »", "Préparation blanche et épaisse ; odeur liée à la base, sans parfum garanti."];
  if(n.includes("morphine")) return ["« Vous allez sentir une petite piqûre. Prévenez-moi si vous vous sentez mal. »", "Une somnolence peut apparaître ; ne pas présenter une difficulté à respirer comme normale."];
  if(n.includes("laudanum")) return ["« Le goût peut être fort. Vous pourriez vous sentir somnolent. »", "Le goût et l'odeur varient selon la préparation alcoolique."];
  if(n.includes("chloroforme")) return ["« Vous allez sentir l'odeur du produit sur le linge. »", "Odeur légèrement douce ; l'endormissement est joué sous surveillance."];
  if(n.includes("éther") || n.includes("ether")) return ["« L'odeur sera forte. Dites-moi si elle vous gêne. »", "Odeur pénétrante, légèrement douce ; une irritation est possible."];
  if(n.includes("phénol") || n.includes("carbol")) return ["« Prévenez-moi si l'application vous brûle ou vous fait mal. »", "Odeur caractéristique, douce et âcre ; la brûlure ne doit pas être banalisée."];
  if(n.includes("alcool")) return ["« Ça peut piquer pendant le nettoyage. Dites-moi si c'est trop douloureux. »", "Une odeur d'alcool se dégage du linge imbibé."];
  if(n.includes("arnica")) return ["« Vous allez sentir le contact de la préparation pendant que je l'applique. »", "La teinture peut sentir l'alcool ; l'odeur d'une pommade dépend de sa composition."];
  if(n.includes("onguent") || n.includes("baume") || n.includes("carron")) return ["« Vous allez sentir une fine couche grasse sur la peau. »", "L'odeur dépend de la préparation ; ne pas lui attribuer de parfum systématique."];
  if(n.includes("ammoniaque") || n.includes("sels odorants")) return ["« L'odeur est très piquante ; signalez toute gêne. »", "Odeur ammoniacale forte ; une irritation n'est pas un signe de réveil garanti."];
  if(n.includes("quinine")) return ["« Le goût peut être très amer. »", "Pas d'effet immédiat garanti à faire jouer."];
  return null;
}

function sensoryNote(name){
  const cue = sensoryCue(name);
  if(!cue) return "";
  if(['asleep','unresponsive'].includes(rpPatientState())) return `<div class="sensory-note"><span>Observation RP : ${cue[1]}</span></div>`;
  return `<div class="sensory-note"><span>${cue[0]}</span>${compactMode ? "" : `<small>${cue[1]}</small>`}</div>`;
}

function meds(rows){
  const unsafeOral=['asleep','unresponsive','uncertain','confused'].includes(rpPatientState()) || ['no','weak','unknown'].includes(answers.latestBreathing || answers.breathing || answers.unknownBreathing);
  const withheldOral=unsafeOral && rows.some(r=>/orale|à boire|boisson/i.test(r[2]));
  if(withheldOral)rows=rows.filter(r=>!/orale|à boire|boisson/i.test(r[2]));
  const opioids = rows.some(r=>/morphine|laudanum/i.test(r[0]));
  const assessment = opioids ? painAssessment() : "";
  const selected = answers.rpPain;
  const unavailable=opioids && careProductBlocked();
  if(unavailable)rows=rows.filter(r=>!/morphine|laudanum/i.test(r[0]));
  if(opioids && selected === "mild") rows = rows.filter(r=>!/morphine|laudanum/i.test(r[0]));
  if(opioids && selected === "moderate") rows = rows.filter(r=>!/morphine/i.test(r[0]));
  if(opioids && selected === "unsafe") rows = rows.filter(r=>!/morphine|laudanum/i.test(r[0]));
  if(compactMode)return `<div class="condensed-products"><p>Produits facultatifs : ${rows.length?rows.map(r=>r[0]).join(' ou '):'aucun proposé dans cet état'}.</p>${unavailable||withheldOral?'<p class="condensed-alert">Réévaluer conscience et respiration. Pas de produit oral si le patient ne peut pas répondre et avaler.</p>':''}${opioids?`<label>Douleur <select onchange="setRpPain(this.value)"><option value="">À évaluer</option>${[['mild','Légère'],['moderate','Modérée'],['strong','Forte'],['unsafe','État vital inquiétant'],['unknown','Non évaluée']].map(([v,t])=>`<option value="${v}" ${selected===v?'selected':''}>${t}</option>`).join('')}</select></label>`:''}</div>`;
  return `<div class="section">
    <h3>Médicament / produit <small class="step-cue">Si nécessaire</small></h3>
    <p class="muted product-choice-note">Possibilités selon la scène, pas des produits à utiliser tous ensemble.</p>
    ${assessment}
    ${unavailable||withheldOral?'<p class="route-note">Réévaluer conscience et respiration avant un opiacé. Aucune proposition orale tant que le patient ne peut pas répondre et avaler.</p>':''}
    ${rows.map(r=>`
      <div class="med-item ${categoryClass(medCategory(r[0], r[3]))}">
        <strong style="font-size:17px">${emojiIcon(lexEmoji({name:r[0],form:r[1],admin:r[2],category:medCategory(r[0],r[3])}))} ${r[0]}</strong>
        ${medicineReferenceButton(r[0])}
        <div class="cat-badge">${medCategory(r[0], r[3])}</div>
        <div class="med">
          <div><strong>Forme</strong>${r[1]}</div>
          <div><strong>Administration</strong>${r[2]}</div>
          ${medComposition(r[0]) ? `<div><strong>Composition</strong>${medComposition(r[0])}</div>` : ""}
          <div><strong>Utilisation RP</strong>${r[3]}</div>
        </div>
        ${sensoryNote(r[0])}
        ${productContext(r[0])}
      </div>
    `).join("")}
  </div>`;
}

function setRpPain(value){
  answers.rpPain = value;
  if(currentSurgery && !document.getElementById("surgeryFlow").classList.contains("hidden")) renderSurgery();
  else render();
}

function painAssessment(){
  const options = [["mild","Gêne légère"],["moderate","Douleur modérée"],["strong","Douleur forte"],["unsafe","Conscience / respiration inquiétante"],["unknown","Pas encore évalué"]];
  const notes = {
    mild:"Privilégier installation confortable, repos et soin de la blessure. Un opiacé n'est pas systématique.",
    moderate:"Le laudanum reste une possibilité RP uniquement si le patient est conscient et peut avaler. Réévaluer ensuite.",
    strong:"Une douleur forte justifie une évaluation plus attentive ; elle ne suffit pas à elle seule à choisir un produit.",
    unsafe:"Priorité à l'état vital. Suspendre le choix d'un opiacé et reprendre l'évaluation de la conscience et de la respiration.",
    unknown:"Les produits ci-dessous sont des possibilités, pas une prescription automatique. Évaluer l'état du patient d'abord."
  };
  return `<div class="pain-assessment"><div class="assessment-options" aria-label="Évaluation RP de la douleur">${options.map(([v,label])=>`<button type="button" aria-pressed="${answers.rpPain===v}" onclick="setRpPain('${v}')">${label}</button>`).join("")}</div><p>${notes[answers.rpPain] || notes.unknown}</p></div>`;
}

function productContext(name){
  const n = name.toLowerCase();
  let text = "";
  if(n.includes("iodoforme")) return `<details class="product-context"><summary>Choix et précautions RP</summary><p>Pansement chirurgical historique, attesté avant 1889. Produit toxique : aucune quantité ou recette proposée. Une odeur de produit ne permet pas de juger l'état de la plaie.</p></details>`;
  if(n.includes("oxyde de zinc")) return `<details class="product-context"><summary>Choix et précautions RP</summary><p>Choisir pour une irritation superficielle par frottement, plutôt que pour un bleu. Ne pas confondre oxyde de zinc et chlorure de zinc. Ne remplace pas les soins d'une plaie ouverte.</p></details>`;
  if(/morphine|laudanum/.test(n)) text = "Soulagement de la douleur et sédation possible. Surveiller conscience et respiration ; ne pas confondre antidouleur et anesthésie chirurgicale. Le laudanum suppose un patient capable d'avaler.";
  else if(/chloroforme|éther|ether/.test(n)) text = "Anesthésie pour une scène opératoire exceptionnelle, avec surveillance continue. Ce n'est pas le soin d'une douleur légère.";
  else if(/arnica/.test(n)) text = "Soin d'une contusion sur peau intacte. Ne pas appliquer dans une plaie ouverte ; réévaluer si douleur, gonflement ou mobilité s'aggravent.";
  else if(/alcool|phénol|carbol/.test(n)) text = "Antisepsie : distinguer le nettoyage du matériel de celui des tissus. Une brûlure ou une irritation importante appelle une réévaluation.";
  else if(/onguent|baume|carron/.test(n)) text = "Protection locale selon la préparation. L'aspect de la plaie et son évolution comptent davantage qu'un effet apaisant supposé.";
  if(!text) return "";
  return `<details class="product-context"><summary>Choix et précautions RP</summary><p>${text}</p></details>`;
}


function urgencyBadge(level){
  const labels = {
    light:["Léger","urgency-light"],
    serious:["Sérieux","urgency-serious"],
    critical:["Critique","urgency-critical"]
  };
  const item = labels[level] || labels.serious;
  return `<span class="urgency ${item[1]}">${item[0]}</span>`;
}

function medCategory(name, usage){
  const text = (name + " " + (usage || "")).toLowerCase();
  if(text.includes("iodoforme")) return "Antiseptique";
  if(text.includes("oxyde de zinc")) return "Soin local";
  if(text.includes("morphine") || text.includes("laudanum")) return "Antidouleur";
  if(text.includes("chloroforme") || text.includes("éther") || text.includes("ether")) return "Anesthésique";
  if(text.includes("phénol") || text.includes("carbol") || text.includes("alcool") || text.includes("antisept")) return "Antiseptique";
  if(text.includes("arnica") || text.includes("baume") || text.includes("onguent") || text.includes("carron")) return "Soin local";
  if(text.includes("quinine")) return "Fièvre / maladie";
  if(text.includes("ammoniaque") || text.includes("sels odorants") || text.includes("atropine")) return "Stimulant";
  return "Autre";
}


function medComposition(name){
  const n = name.toLowerCase();
  if(n.includes("iodoforme")) return "Iodoforme dans une poudre ou une gaze préparée.";
  if(n.includes("oxyde de zinc")) return "Oxyde de zinc dans une base grasse.";
  if(n.includes("laudanum")) return "Teinture d’opium dans de l’alcool.";
  if(n.includes("morphine")) return "Sel de morphine en solution injectable.";
  if(n.includes("chloroforme")) return "Chloroforme liquide volatil.";
  if(n.includes("éther") || n.includes("ether")) return "Éther éthylique volatil.";
  if(n.includes("phénol") || n.includes("carbol")) return "Acide carbolique dilué.";
  if(n.includes("arnica")) return "Fleurs d’arnica macérées dans l’alcool ; éventuellement incorporées à une base grasse/cireuse.";
  if(n.includes("onguent")) return "Base grasse ou cireuse, parfois additionnée d’un extrait végétal.";
  if(n.includes("carron")) return "Huile de lin + eau de chaux.";
  if(n.includes("ammoniaque") || n.includes("sels odorants")) return "Préparation libérant des vapeurs ammoniacales.";
  if(n.includes("atropine")) return "Alcaloïde végétal préparé sous forme médicinale.";
  if(n.includes("quinine")) return "Alcaloïde du quinquina, sous forme de poudre ou de sel.";
  return "";
}

function categoryClass(category){
  switch(category){
    case "Antidouleur": return "cat-pain";
    case "Anesthésique": return "cat-anesthetic";
    case "Antiseptique": return "cat-antiseptic";
    case "Soin local": return "cat-topical";
    case "Fièvre / maladie": return "cat-fever";
    case "Stimulant": return "cat-stimulant";
    default: return "cat-other";
  }
}

function render(capture=false){
  if(compactMode&&!capture)return renderCondensed('flow');
  if(!capture)document.getElementById('flow').classList.remove('condensed-workspace');
  if(!capture)rpPhraseBlocks=[];
  activeRouteKind = "flow";
  const flow = flows[currentFlow];
  const step = flow.steps[stepIndex];
  activeStepTitle = step.title;
  const route=visibleFlowSteps();
  const position=route.findIndex(item=>item.index===stepIndex)+1;
  const pct = Math.round((position/route.length)*100);
  let html = `
    <div class="topbar">
      <div>
        <span class="badge">${flow.title}</span>
        ${urgencyBadge(careUrgency(flow.urgency))}
        <h2 style="margin:8px 0 0">${position} / ${route.length} - ${step.title}</h2>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        ${compactButton("flow")}
        <button class="danger" onclick="showCases()">Changer de cas</button>
      </div>
    </div>
    <div class="progress"><div style="width:${pct}%"></div></div>
    ${!capture?careMemoMarkup('flow'):''}
    ${rpChoicesMarkup()}
    ${materialPanel("flow")}
    ${sceneToolbar("flow")}
    ${rpContextMarkup("flow")}
    ${flowRouteNote()}
    ${careStepExtras(step)}
  `;

  if(step.dynamicAnimal){
    html += animalStepMarkup(step);
  } else if(step.dynamicUnknownBreathing){
    const breathing=answers.latestBreathing || answers.unknownBreathing;
    if(breathing === "no"){
      html += section("À faire",[
        "Dégager le cou et la poitrine.",
        "Vérifier rapidement qu'aucun objet visible n'obstrue la bouche.",
        "Utiliser la méthode de Silvester comme respiration artificielle d'époque.",
        "Ne chercher la cause qu'une fois la respiration reprise dans la scène."
      ]);
      html += sayLines(["« Il ne respire pas. Aidez-moi à dégager sa poitrine. »","« Je tente de relancer sa respiration. »"]);
    } else if(breathing === "weak"){
      html += section("À faire",[
        "Garder les voies respiratoires dégagées.",
        "Surveiller chaque respiration.",
        "Préparer une respiration artificielle si elle s'arrête."
      ]);
      html += sayLines(["« Restez avec moi. Respirez doucement. »"]);
    } else if(breathing === "unknown"){
      html += section("À faire",[
        "Se concentrer uniquement sur la respiration pendant quelques instants.",
        "Observer poitrine, bouche et souffle avant toute autre étape.",
        "Traiter comme potentiellement grave tant que ce n'est pas clair."
      ]);
      html += sayLines(["« J'ai besoin qu'on me laisse vérifier sa respiration. »"]);
    } else {
      html += section("À faire",[
        "Le patient respire.",
        "Le garder allongé et dégager ce qui gêne la respiration.",
        "Passer immédiatement au contrôle du saignement."
      ]);
      html += sayLines(["« Il respire. Je vérifie maintenant s'il saigne. »"]);
    }

  } else if(step.dynamicUnknownBleeding){
    if(answers.unknownBleeding === "major"){
      html += section("À faire",[
        "Comprimer immédiatement avec linge ou compresses.",
        "Ne pas interrompre la pression pour poser des questions.",
        "Prévoir une prise en charge d'hémorragie majeure si le saignement ne ralentit pas."
      ]);
      html += sayLines(["« Maintenez la pression ici. Ne relâchez pas. »"]);
    } else if(answers.unknownBleeding === "minor"){
      html += section("À faire",[
        "Nettoyer rapidement et couvrir la petite plaie.",
        "Ne pas laisser ce soin retarder la recherche d'une cause plus grave."
      ]);
    } else if(answers.unknownBleeding === "unknown"){
      html += section("À faire",[
        "Inspecter rapidement les vêtements et les zones visibles.",
        "Chercher du sang au sol ou sur les mains.",
        "Continuer si aucun saignement majeur n'apparaît."
      ]);
    } else {
      html += section("À faire",[
        "Pas de saignement majeur visible.",
        "Passer à l'état de conscience et à la recherche de la cause."
      ]);
    }

  } else if(step.dynamicUnknownCause){
    const wake=answers.latestState || answers.unknownWake;
    if(wake === "awake"){
      html += section("À faire",[
        "Poser seulement trois questions rapides : où avez-vous mal, que s'est-il passé, avez-vous reçu un coup à la tête ?",
        "Choisir ensuite l'intervention correspondant au symptôme principal."
      ]);
      html += sayLines(["« Dites-moi simplement où vous avez le plus mal. »","« Qu'est-ce qui s'est passé juste avant ? »"]);
    } else if(wake === "confused"){
      html += section("À faire",[
        "Garder le patient allongé.",
        "Suspecter en priorité chute, traumatisme crânien ou intoxication selon la scène.",
        "Ne pas chercher un récit détaillé."
      ]);
      html += sayLines(["« Ne vous relevez pas. Dites-moi seulement votre nom et où vous avez mal. »"]);
    } else {
      html += section("À faire",[
        "Le patient ne fournit toujours pas d'informations fiables.",
        "Continuer à surveiller respiration, saignement et signes visibles.",
        "Choisir l'intervention correspondant à ce que tu observes, pas à ce que tu supposes."
      ]);
      html += sayLines(["« Il ne peut pas encore me répondre. Je vais travailler avec ce que je vois. »"]);
    }

  } else if(step.dynamicGunArea){
    if(answers.gunArea === "chest"){
      html += section("Priorité",[
        "Vérifier immédiatement la respiration.",
        "Une difficulté à respirer rend la situation critique.",
        "Éviter de perdre du temps à chercher la balle avant stabilisation."
      ]);
      html += sayLines(["« Respirez pour moi. Est-ce que ça vous lance dans la poitrine ? »"]);
    } else if(answers.gunArea === "abdomen"){
      html += section("Priorité",[
        "Considérer la blessure comme sérieuse.",
        "Éviter de faire boire avant d'avoir évalué la gravité.",
        "Contrôler le saignement externe et surveiller faiblesse et pâleur."
      ]);
      html += sayLines(["« Ne buvez rien pour le moment. Je vais regarder la blessure. »"]);
    } else if(answers.gunArea === "head"){
      html += section("Priorité",[
        "Vérifier conscience, respiration et saignement.",
        "Éviter toute manipulation inutile.",
        "Surveiller confusion et aggravation rapide."
      ]);
    } else if(answers.gunArea === "unknown"){
      html += section("À faire",[
        "Ne pas inventer la localisation.",
        "Dégager les vêtements et chercher rapidement l'origine du sang.",
        "Continuer avec les informations visibles."
      ]);
    } else {
      html += section("À faire",[
        "Vérifier sensibilité et mouvement du membre.",
        "Contrôler le saignement avant de chercher le projectile."
      ]);
    }

  } else if(step.dynamicFightCare){
    if(answers.fightIssue === "bruise"){
      html += section("À faire",[
        "Appliquer un linge frais si disponible.",
        "Sur peau intacte, utiliser une préparation à l'arnica.",
        "Repos si la zone reste douloureuse."
      ]);
      html += meds([["Préparation à l’arnica","Teinture alcoolique liquide ou pommade semi-solide","Application locale sur peau intacte","Contusion, bosse ou bleu"]]);
    } else if(answers.fightIssue === "cut"){
      html += section("À faire",[
        "Nettoyer la coupure.",
        "Appliquer du phénol / acide carbolique dilué.",
        "Pansement, ou suture si les bords restent franchement ouverts."
      ]);
    } else if(answers.fightIssue === "ribs"){
      html += section("À faire",[
        "Faire prendre une inspiration lente.",
        "Surveiller douleur importante ou difficulté respiratoire.",
        "Repos et antidouleur si nécessaire."
      ]);
      html += meds([["Laudanum","Liquide opiacé","Voie orale en gouttes si le patient peut avaler","Douleur modérée"]]);
    } else if(answers.fightIssue === "head"){
      html += section("À faire",[
        "Passer en logique traumatisme crânien.",
        "Surveiller confusion, nausée, somnolence et perte de connaissance."
      ]);
    } else if(answers.fightIssue === "general"){
      html += section("À faire",[
        "Repos.",
        "Chercher la zone la plus douloureuse.",
        "Utiliser un antidouleur léger si nécessaire."
      ]);
      html += meds([["Laudanum","Liquide opiacé","Voie orale en gouttes","Douleur modérée"]]);
    } else {
      html += section("À faire",[
        "Traiter uniquement ce qui est visible.",
        "Ne pas inventer une blessure.",
        "Surveiller l'état général quelques instants."
      ]);
    }

  } else if(step.dynamicConscious){
    const observed=answers.latestBreathing==='no'?'not_breathing':answers.latestState?{awake:'awake',confused:'confused',unresponsive:'unconscious_breathing',unknown:'unknown'}[answers.latestState]:answers.conscious;
    if(observed === "not_breathing"){
      html += section("Priorité : respiration artificielle",[
        "Allonger le patient sur le dos et dégager le cou et la poitrine.",
        "Vérifier rapidement la bouche et retirer seulement ce qui obstrue visiblement.",
        "Surélever légèrement les épaules avec un vêtement plié.",
        "Pour un RP historiquement cohérent en 1889 : utiliser la méthode de Silvester.",
        "Lever doucement les bras du patient au-dessus de la tête, puis les ramener contre les côtés du thorax en exerçant une pression douce.",
        "Répéter le mouvement de façon régulière jusqu’à reprise d’une respiration dans la scène."
      ]);
      html += sayLines([
        "« Il ne respire pas. Aidez-moi à lui dégager la poitrine. »",
        "« Je vais tenter de faire reprendre les mouvements respiratoires. »",
        "Après reprise : « Voilà… restez avec moi. Respirez doucement. »"
      ]);
      html += section("Méthode de Silvester - repère RP",[
        "Position : patient sur le dos.",
        "Inspiration simulée : bras tirés doucement vers le haut.",
        "Expiration simulée : bras ramenés contre la poitrine avec une pression douce.",
        "Technique historique de respiration artificielle, pas un massage cardiaque moderne."
      ]);
      html += section("Après reprise de la respiration",[
        "Garder le patient au chaud.",
        "Surveiller sa respiration.",
        "Contrôler immédiatement les grosses hémorragies.",
        "Attendre qu’il reprenne suffisamment connaissance avant de lui demander ce qui s’est passé."
      ]);
    } else if(observed === "unconscious_breathing"){
      html += section("À faire",[
        "Le patient respire : ne pas commencer une respiration artificielle.",
        "Dégager ce qui gêne le cou et la respiration.",
        "Contrôler immédiatement les saignements importants.",
        "Stimuler doucement le patient par la voix et le toucher.",
        "Pour une scène d’époque, des sels odorants / vapeurs d’ammoniaque peuvent être utilisés avec prudence comme stimulant.",
        "Quand il revient à lui, poser seulement des questions simples au début."
      ]);
      html += sayLines([
        "« Vous m’entendez ? Ouvrez les yeux. »",
        "« Restez avec moi. Vous êtes en sécurité. »",
        "Au réveil : « Ne vous relevez pas encore. Dites-moi simplement où vous avez mal. »"
      ]);
      html += meds([
        ["Sels odorants / ammoniaque","Vapeurs / sels","Présentés brièvement sous le nez","Stimulation d’un patient évanoui qui respire"]
      ]);
    } else if(observed === "confused"){
      html += section("À faire",[
        "Garder le patient allongé ou assis.",
        "Vérifier qu’il respire correctement et qu’il ne saigne pas abondamment.",
        "Poser des questions très simples : nom, douleur, ce dont il se souvient.",
        "Ne pas insister sur les détails tant qu’il reste confus.",
        "Surveiller particulièrement la tête après une chute ou des coups."
      ]);
      html += sayLines([
        "« Regardez-moi. Comment vous appelez-vous ? »",
        "« Ne cherchez pas à vous lever. »",
        "« Dites-moi seulement où vous avez mal. »"
      ]);
    } else if(observed === "unknown"){
      html += section("À faire",[
        "Tu n'as pas encore assez d'informations.",
        "Vérifier respiration, réaction à la voix et gros saignement.",
        "Ne poser des questions qu'une fois l'état un peu plus clair."
      ]);
      html += sayLines(["« Vous m'entendez ? Serrez ma main si vous pouvez. »"]);
    } else {
      html += section("À faire",[
        "Le patient est conscient et répond correctement.",
        "Vérifier malgré tout respiration et saignement important.",
        "Passer ensuite à l’examen de la blessure.",
        "Continuer à surveiller son état pendant toute la prise en charge."
      ]);
      html += sayLines([
        "« Très bien. Restez avec moi et dites-moi si quelque chose change. »"
      ]);
    }
  } else if(step.dynamicBreathing){
    const breathing=answers.latestBreathing || answers.breathing;
    if(breathing === "no"){
      html += section("Méthode de Silvester",[
        "Allonger le patient sur le dos.",
        "Dégager le cou et la poitrine.",
        "Surélever légèrement les épaules.",
        "Lever les bras au-dessus de la tête puis les ramener contre la poitrine avec une pression douce.",
        "Répéter régulièrement jusqu’à reprise d’une respiration dans la scène."
      ]);
      html += sayLines(["« Il ne respire pas. Aidez-moi à dégager sa poitrine. »","« Je tente de faire reprendre les mouvements respiratoires. »"]);
    } else if(breathing === 'unknown'){
      html += section('À faire',['La respiration n’a pas été évaluée : observer avant de choisir un geste.','Demander du renfort et utiliser Réévaluer pour indiquer la dernière observation.']);
    } else if(breathing === "weak"){
      html += section("À faire",[
        "Garder les voies respiratoires dégagées.",
        "Stimuler le patient et surveiller chaque respiration.",
        "Préparer la respiration artificielle si la respiration cesse."
      ]);
      html += sayLines(["« Restez avec moi. Respirez lentement. »"]);
    } else {
      html += section("À faire",[
        "Le patient respire : ne pas pratiquer de respiration artificielle.",
        "Le garder allongé, au chaud, et surveiller sa respiration.",
        "Stimuler doucement s’il reste inconscient."
      ]);
    }
  } else if(step.dynamicHead){
    const headState=answers.latestBreathing==='no'?'not_breathing':answers.latestState?{awake:'awake',confused:'confused',unresponsive:'unconscious',unknown:'unknown'}[answers.latestState]:answers.headState;
    if(headState === 'unknown'){
      html += section('À faire',['Vérifier réactions, respiration et saignement avant toute conclusion.','Ne pas assimiler une observation incertaine à un patient cohérent.']);
    } else if(headState === "not_breathing"){
      html += section("Priorité",[
        "La respiration passe avant l’examen de la tête.",
        "Utiliser la méthode de Silvester comme respiration artificielle d’époque.",
        "Après reprise, immobiliser et reprendre l’examen neurologique."
      ]);
    } else if(headState === "unconscious"){
      html += section("À faire",[
        "Le patient respire : le garder immobile.",
        "Contrôler les saignements visibles.",
        "Le stimuler doucement sans le relever.",
        "Surveiller sa respiration jusqu’au réveil."
      ]);
    } else if(headState === "confused"){
      html += section("À faire",[
        "Garder le patient au repos.",
        "Poser seulement des questions simples.",
        "Surveiller vomissements, somnolence et aggravation de la confusion."
      ]);
    } else {
      html += section("À faire",[
        "Le patient est cohérent : poursuivre l’examen.",
        "Ne pas exclure une commotion simplement parce qu’il parle normalement."
      ]);
    }
  } else if(step.dynamicBurn){
    if(answers.burnSeverity === "minor"){
      html += section("À faire",[
        "Refroidir doucement la zone avec de l’eau fraîche si disponible.",
        "Nettoyer délicatement.",
        "Protéger avec un pansement propre."
      ]);
      html += section("Soin local",[
        "Une pommade ou un onguent léger peut servir dans une scène RP pour une petite brûlure.",
        "Les huiles et préparations grasses étaient historiquement utilisées au XIXe siècle."
      ]);
    } else if(answers.burnSeverity === "airway"){
      html += section("Priorité : respiration",[
        "Éloigner immédiatement de la fumée.",
        "Observer voix, toux et difficulté respiratoire.",
        "Garder le patient assis ou dans la position où il respire le mieux.",
        "Surveiller avant de s’occuper des lésions cutanées."
      ]);
      html += sayLines(["« Respirez doucement. Dites-moi si votre gorge vous brûle. »"]);
    } else {
      html += section("À faire",[
        "Refroidir doucement si possible.",
        "Ne pas arracher les vêtements collés à la peau.",
        "Couvrir largement avec du linge propre.",
        "Traiter la douleur si nécessaire (laudanum, liquide oral en gouttes ; ou morphine, solution injectable hypodermique, selon l’intensité) et surveiller l’état général."
      ]);
    }
  } else if(step.dynamicPoison){
    const poisonState=answers.latestBreathing==='no'?'not_breathing':answers.latestState?{awake:'awake',confused:'sleepy',unresponsive:'unconscious',unknown:'unknown'}[answers.latestState]:answers.poisonState;
    if(poisonState === 'unknown'){
      html += section('À faire',['Évaluer conscience et respiration avant de poursuivre.','Chercher le récipient ou un témoin sans supposer le produit ingéré.']);
    } else if(poisonState === "not_breathing"){
      html += section("Priorité : respiration",[
        "Allonger le patient et dégager le cou et la poitrine.",
        "Utiliser la méthode de Silvester si la respiration paraît absente.",
        "Continuer jusqu’à reprise d’une respiration dans la scène."
      ]);
    } else if(poisonState === "unconscious"){
      html += section("À faire",[
        "Le patient respire : le surveiller sans interruption.",
        "Le stimuler doucement.",
        "Des sels odorants peuvent servir de stimulant RP d’époque.",
        "Préparer une respiration artificielle si la respiration s’affaiblit davantage."
      ]);
    } else {
      html += section("À faire",[
        "Empêcher le patient de se rendormir si possible.",
        "Le faire parler et surveiller son rythme respiratoire.",
        "Rechercher rapidement ce qu’il a pris."
      ]);
      html += sayLines(["« Gardez les yeux ouverts. Regardez-moi. »","« Qu’avez-vous pris ? »"]);
    }
  } else if(step.dynamic && currentFlow==="gunshot"){
    if(answers.bullet==="in"){
      html += section("À faire",[
        "Si le projectile est visible et facilement accessible, préparer une extraction simple.",
        "Éviter de fouiller profondément dans la plaie.",
        "Utiliser une pince/forceps seulement si cela reste cohérent avec la scène."
      ]);
      html += sayLines([
        "« La balle semble être encore dedans. Je vais voir si je peux l’atteindre sans aggraver la blessure. »",
        "« Ne bougez surtout pas. »"
      ]);
      html += section("Matériel",["Forceps / pince","Compresses","Phénol / acide carbolique dilué (solution antiseptique liquide, application locale sur plaie, compresses ou matériel)"]);
    } else if(answers.bullet==="out"){
      html += section("À faire",[
        "Ne pas prévoir d’extraction.",
        "Nettoyer la plaie d’entrée et la plaie de sortie.",
        "Passer directement à la fermeture et au pansement si approprié."
      ]);
      html += sayLines(["« La balle est ressortie. Je vais nettoyer et vérifier si la plaie peut être refermée. »"]);
    } else {
      html += section("À faire",[
        "Ne pas inventer une extraction.",
        "Nettoyer et protéger la plaie.",
        "Rester prudent si la trajectoire est inconnue."
      ]);
      html += sayLines(["« Je ne vais pas fouiller à l’aveugle. Je nettoie et je protège la blessure. »"]);
    }
  } else if(step.dynamicSuture){
    if(answers.needsSuture === true){
      html += section("À faire",[
        "Nettoyer une dernière fois la plaie et ses bords, puis préparer aiguille et fil.",
        "Rapprocher doucement les bords et jouer quelques points séparés.",
        "Couper le fil, nettoyer autour puis préparer le pansement."
      ]);
      html += sayLines([
        "« Je vais refermer la plaie maintenant. »",
        "« Essayez de ne pas bouger. »",
        "« Vous allez sentir que ça tire un peu. »"
      ]);
      html += section("Matériel",[
        "Aiguille de suture",
        "Fil de suture",
        "Pince",
        "Ciseaux",
        "Compresses",
        "Phénol / acide carbolique dilué (solution antiseptique liquide, application locale sur plaie, compresses ou matériel)"
      ]);
      html += meds([
        ["Morphine","Sel de morphine dissous en solution injectable","Injection hypodermique avec seringue","Douleur forte ou suture douloureuse"],
        ["Laudanum","Liquide opiacé, teinture d’opium","Voie orale, en gouttes ou petite quantité diluée, uniquement si le patient est conscient et peut avaler","Douleur modérée"]
      ]);
    } else if(answers.needsSuture === "avoid"){
      html += section("Ne pas suturer immédiatement",[
        "La plaie semble trop sale, irrégulière ou trop profonde pour une fermeture simple.",
        "Nettoyer et protéger la zone.",
        "Contrôler le saignement.",
        "Éviter de fermer à l’aveugle une plaie qui pourrait contenir des saletés ou une atteinte plus profonde."
      ]);
      html += sayLines([
        "« Je ne vais pas refermer ça tout de suite. Je veux éviter d’enfermer des saletés dans la plaie. »"
      ]);
    } else {
      html += section("Pas de suture nécessaire",[
        "La plaie est trop petite ou superficielle pour nécessiter des points.",
        "Nettoyer correctement.",
        "Poser une compresse ou un petit pansement."
      ]);
      html += sayLines([
        "« Pas besoin de points ici. Je vais simplement nettoyer et protéger la zone. »"
      ]);
    }
  } else if(step.dynamicMovementQuestion && currentFlow==="horse"){
    const area = answers.horseArea;
    if(area === "none"){
      html += section("À faire",[
        "Le patient ne décrit presque aucune douleur.",
        "Lui demander de se relever lentement seulement s’il est bien conscient.",
        "Vérifier qu’il marche normalement et ne présente pas de vertige."
      ]);
      html += sayLines([
        "« Relevez-vous doucement. Prenez votre temps. »",
        "« Faites quelques pas et dites-moi si quelque chose tire ou vous lance. »"
      ]);
    } else if(area === "back" || area === "head"){
      html += section("À faire",[
        "Éviter les mouvements brusques.",
        "Ne pas chercher à faire bouger fortement la nuque ou le dos.",
        "Vérifier sensibilité, confusion, vertiges et douleur."
      ]);
      html += sayLines([
        "« Ne tournez pas brusquement la tête. »",
        "« Dites-moi si vous avez des fourmillements ou si vous voyez trouble. »"
      ]);
    } else if(area === "ribs"){
      html += section("À faire",[
        "Demander une respiration lente et profonde.",
        "Vérifier si la douleur augmente fortement à l’inspiration.",
        "Palper très doucement la zone sans appuyer brutalement."
      ]);
      html += sayLines([
        "« Prenez une grande inspiration pour moi. »",
        "« Est-ce que ça vous lance davantage quand vous respirez ? »"
      ]);
    } else {
      html += section("Teste doucement le membre",[
        "Demander au patient de bouger doucement doigts, main, pied ou orteils selon la zone.",
        "Vérifier s’il ressent correctement le toucher.",
        "Ne pas forcer un mouvement très douloureux."
      ]);
      html += `<div class="section"><h3>Résultat</h3><div class="choices">
        <button class="choice" onclick='applyChoice({"horseMove":"normal"})'>Il bouge normalement</button>
        <button class="choice" onclick='applyChoice({"horseMove":"painful"})'>Il bouge mais ça fait mal</button>
        <button class="choice" onclick='applyChoice({"horseMove":"limited"})'>Il bouge très peu / difficilement</button>
        <button class="choice" onclick='applyChoice({"horseMove":"none"})'>Impossible de bouger</button>
        <button class="choice" onclick='applyChoice({"horseMove":"unknown"})'>Non testé / impossible à évaluer</button>
      </div></div>`;
    }

  } else if(step.dynamicHorseCare && currentFlow==="horse"){
    const area = answers.horseArea;
    const vis = answers.horseVisible;
    const move = answers.horseMove;
    const pain = answers.horsePain;

    if([vis,move,area].includes('unknown')){
      html += section('À faire',['L’examen reste incomplet : ne pas annoncer une simple contusion.','Ne pas forcer le mouvement ; préciser les signes accessibles dans la scène.','Organiser une nouvelle évaluation et du renfort si nécessaire.']);
    } else if(vis === "deformity" || move === "none"){
      html += section("À faire",[
        "Considérer une fracture ou luxation possible.",
        "Immobiliser dans la position la plus stable.",
        "Poser une attelle rembourrée sans serrer excessivement.",
        "Éviter de faire marcher le patient."
      ]);
      html += sayLines([
        "« Je ne veux pas que vous bougiez ce membre. »",
        "« Je vais l’immobiliser avant de faire quoi que ce soit d’autre. »"
      ]);
      html += section("Matériel",["Attelle","Bandages","Tissu rembourré"]);
    } else if(vis === "wound"){
      html += section("À faire",[
        "Nettoyer l’éraflure ou la petite coupure.",
        "Appliquer un antiseptique adapté.",
        "Poser un petit pansement si nécessaire.",
        "Traiter ensuite la douleur liée au choc si nécessaire (laudanum, liquide oral en gouttes ; ou morphine, solution injectable hypodermique, si douleur forte)."
      ]);
      html += meds([
        ["Phénol / acide carbolique","Solution antiseptique liquide diluée","Application locale sur la plaie / les compresses","Nettoyage de la petite plaie"]
      ]);
    } else if(vis === "bruise" || vis === "swelling"){
      html += section("À faire",[
        "Faire reposer la zone.",
        "Appliquer un linge frais ou une compresse fraîche si disponible.",
        "Sur peau intacte, appliquer une préparation à l’arnica.",
        "Ajouter un bandage de soutien si le mouvement est douloureux."
      ]);
      html += meds([
        ["Préparation à l’arnica","Teinture alcoolique liquide ou pommade semi-solide","Application locale sur peau intacte, en friction légère","Contusion, bosse ou douleur superficielle"]
      ]);
    } else if(area === "back"){
      html += section("À faire",[
        "Repos et mouvements prudents.",
        "Éviter de manipuler fortement le dos.",
        "Surveiller apparition de faiblesse, fourmillements ou douleur qui augmente."
      ]);
    } else if(area === "ribs"){
      html += section("À faire",[
        "Mettre au repos.",
        "Éviter les efforts et mouvements brusques.",
        "Surveiller toute difficulté respiratoire ou douleur qui s’aggrave."
      ]);
    } else if(area === "head"){
      html += section("À faire",[
        "Garder au repos.",
        "Surveiller confusion, nausée, vomissement ou somnolence inhabituelle.",
        "Nettoyer une petite plaie du cuir chevelu si présente."
      ]);
    } else if(area === "none"){
      html += section("À faire",[
        "Pas de soin important nécessaire.",
        "Faire marcher doucement le patient quelques instants.",
        "Conseiller de revenir si une douleur apparaît après coup."
      ]);
    } else {
      html += section("À faire",[
        "Pas de fracture évidente.",
        "Faire reposer le membre.",
        "Mettre un bandage de soutien si cela soulage.",
        "Traiter la douleur ou la contusion si besoin (arnica, teinture/pommade locale ; laudanum, liquide oral en gouttes, selon l’intensité)."
      ]);
    }

  } else if(step.dynamicHorsePain && currentFlow==="horse"){
    const pain = answers.horsePain;
    const conscious = answers.conscious;

    if(pain==='unknown'){
      html += section('À faire',['La douleur n’est pas évaluée : pas de produit choisi par défaut.','Demander une description si le patient peut répondre, sinon surveiller ses réactions.']);
    } else if(answers.horseArea === "none" && pain === "mild"){
      html += section("Optionnel",[
        "Aucun antidouleur n’est forcément nécessaire si la gêne est minime.",
        "Un soin local (préparation à l’arnica, teinture alcoolique ou pommade, application locale) suffit souvent pour une petite contusion."
      ]);
      html += meds([
        ["Préparation à l’arnica","Teinture alcoolique liquide ou pommade semi-solide","Application locale sur peau intacte, en friction légère","Petite douleur ou contusion"]
      ]);
    } else if(pain === "mild"){
      html += section("Douleur légère",[
        "Privilégier repos, soutien du membre et soin local (préparation à l’arnica, teinture alcoolique ou pommade, application locale).",
        "Un antidouleur n’est pas obligatoire, mais du laudanum (liquide, voie orale, en gouttes) peut être envisagé si la gêne devient plus marquée."
      ]);
      html += meds([
        ["Préparation à l’arnica","Teinture alcoolique ou pommade","Application locale sur peau intacte","Contusion ou douleur légère"]
      ]);
    } else if(pain === "moderate"){
      html += section("Douleur modérée",[
        "Un antidouleur oral (laudanum, liquide, voie orale, en gouttes) peut être proposé si le patient est bien conscient et peut avaler.",
        "Continuer le repos et l’immobilisation légère si nécessaire."
      ]);
      if(conscious === "awake" || conscious === "confused"){
        html += meds([
          ["Laudanum","Liquide opiacé (teinture d’opium)","Voie orale, quelques gouttes ou petite quantité diluée","Douleur modérée"]
        ]);
      } else {
        html += section("Attention",[
          "Le patient n’est pas suffisamment conscient pour lui faire boire quoi que ce soit.",
          "Attendre qu’il soit réveillé et capable d’avaler."
        ]);
      }
    } else {
      html += section("Douleur forte",[
        "Rechercher à nouveau fracture, luxation ou lésion importante.",
        "Immobiliser la zone douloureuse.",
        "Un antalgique puissant (morphine, solution injectable, voie hypodermique) peut être envisagé dans le cadre RP."
      ]);
      html += meds([
        ["Morphine","Sel de morphine dissous en solution injectable","Injection hypodermique avec seringue","Douleur forte"],
        ["Laudanum","Liquide opiacé (teinture d’opium)","Voie orale uniquement si le patient est suffisamment conscient et peut avaler","Alternative orale selon la scène"]
      ]);
    }

  } else if(step.dynamicHorseFinish && currentFlow==="horse"){
    html += section("Avant de terminer",[
      "Vérifier que le patient est bien conscient.",
      "Demander si la douleur a changé depuis le début.",
      "Vérifier qu’il peut bouger ou marcher si cela est cohérent avec la blessure.",
      "Conseiller repos et surveillance."
    ]);
    html += sayLines([
      "« Ménagez-vous pour le moment. Je vais refaire le point sur votre état avant la suite. »",
      "« Si la douleur augmente, si vous avez des vertiges ou si vous perdez de la sensibilité, revenez me voir. »"
    ]);

  } else {
    if(step.do) html += section("À faire", step.do);
    if(step.say) html += sayLines(step.say);
    if(step.material) html += section("Matériel", step.material);
    if(step.med) html += meds(step.med);
  }

  if(step.choices){
    html += patientQuestion(step);
    const zoneKey=zoneKeyForStep(step);
    html += `<div class="section"><h3>${zoneKey?'Zones atteintes, plusieurs choix possibles':'Choisis ce qui correspond à la scène'}</h3><div class="choices${step.animalSpeciesPicker?' animal-species-choices':''}${zoneKey?' zone-choices':''}">`;
    (step.dynamicAnimal?animalChoicesForStep(step):step.choices).forEach(c=>{
      html += `<button class="choice" ${zoneKey?`aria-pressed="${zoneIsSelected(zoneKey,c.set)}"`:''} onclick='applyChoice(${JSON.stringify(c.set)})'>${c.label}</button>`;
    });
    html += `</div></div>`;
    if(zoneKey)html+=zoneSelectionControls(step,stepIndex);
  }

  if(!html.includes('class="rp-lines')){
    html += sayLines([]);
  }

  if(!step.choices && !html.includes('class="choices"')){
    html += `<div class="nav">
      <button class="secondary" onclick="prev()">Précédent</button>
      <button class="next" onclick="next()">${stepIndex===flow.steps.length-1?"Terminer":"Étape suivante"}</button>
    </div>`;
  } else {
    html += `<div class="nav"><button class="secondary" onclick="prev()">Précédent</button></div>`;
  }

  html+=multiZoneCareMarkup(step);
  if(capture)return html;
  document.getElementById("flow").innerHTML=html;
  finalizeCareLayout(document.getElementById('flow'));
}
function renderEnd(){
  interventionEnded=true;
  document.getElementById("flow").innerHTML=endingMarkup("flow");
}

(function initLexiqueTabs(){
  document.querySelectorAll("[data-lex-tab]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      setLexTab(btn.dataset.lexTab);
    });
  });
})();
