// Short manual RP summary. Memory only, no network call or saved patient record.
let reportDraft=null;
function resetReportDraft(){reportDraft=null;}
function reportEscape(text){return String(text||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function reportDraftFor(kind){
 const id=kind==='surgery'?currentSurgery:currentFlow,key=`${kind}:${id}`;
 if(!reportDraft||reportDraft.key!==key)reportDraft={key,kind,motif:(kind==='surgery'?surgeries[id]:flows[id]).title,details:'',care:'',text:'',edited:false,stale:false,open:false};
 return reportDraft;
}
function reportMarkup(kind){
 const d=reportDraftFor(kind);
 return `<details class="care-report" ${d.open?'open':''} ontoggle="if(this.isConnected&&reportDraft)reportDraft.open=this.open"><summary>Résumé du soin en mots-clés</summary><p class="muted report-hint">Note les faits joués en quelques mots. Rien n’est enregistré.</p><div class="report-fields"><label class="report-field report-wide" for="report-motif">Motif de l’intervention / consultation<input id="report-motif" maxlength="500" value="${reportEscape(d.motif)}" oninput="updateReportField('motif',this.value)"></label>${['details','care'].map((key,i)=>`<label class="report-field" for="report-${key}">${i?'Soins, traitements et prescriptions donnés':'Constatations médicales'}<textarea id="report-${key}" rows="3" maxlength="4000" placeholder="${i?'Ex. : 3 points de suture ; bandage ; repos ; contrôle demain':'Ex. : Douleur au dos ; contusion ; pas de fracture apparente'}" oninput="updateReportField('${key}',this.value)">${reportEscape(d[key])}</textarea></label>`).join('')}</div><small>Nombre de points et produits uniquement s’ils ont été réellement utilisés. Les étapes proposées ne confirment pas les soins effectués.</small><div class="report-actions"><button class="next" type="button" onclick="generateReport()">${d.text?'Actualiser le résumé':'Créer le résumé'}</button><span id="report-status" role="status">${d.stale?'Les renseignements ont changé : actualise le résumé.':''}</span></div><div id="report-result" ${d.text?'':'hidden'}><label class="report-field" for="report-text">Résumé modifiable<textarea id="report-text" rows="4" oninput="updateReportText(this.value)">${reportEscape(d.text)}</textarea></label><div class="report-actions"><button class="secondary" type="button" onclick="copyReport()">Copier le résumé</button></div></div></details>`;
}
function updateReportField(key,value){
 if(!reportDraft||!['motif','details','care'].includes(key))return;
 reportDraft[key]=value;reportDraft.stale=!!reportDraft.text;
 const status=document.getElementById('report-status');if(status)status.textContent=reportDraft.stale?'Les renseignements ont changé : actualise le résumé.':'';
}
function reportKeywords(text){return String(text||'').trim().replace(/[\u2013\u2014]/g,'-').split(/[;\r\n]+/).map(s=>s.trim()).filter(Boolean).join(' ; ');}
function reportCompose(d){
 const findings=[reportKeywords(d.motif),reportKeywords(d.details)].filter(Boolean).join(' ; ');
 return `Constatations médicales : ${findings}\nSoins, traitements et prescriptions : ${reportKeywords(d.care)||'Non renseignés'}`;
}
function generateReport(){
 if(!reportDraft)return;
 const motif=document.getElementById('report-motif');if(!reportDraft.motif.trim()){motif.setCustomValidity('Indique le motif de la visite.');motif.reportValidity();motif.setCustomValidity('');return;}
 if(reportDraft.edited&&!confirm('Actualiser remplacera tes modifications du résumé. Continuer ?'))return;
 reportDraft.text=reportCompose(reportDraft);reportDraft.edited=false;reportDraft.stale=false;
 document.getElementById('report-text').value=reportDraft.text;document.getElementById('report-result').hidden=false;
 document.getElementById('report-status').textContent='Résumé prêt à relire et copier.';
 document.querySelector('.report-actions .next').textContent='Actualiser le résumé';
}
function updateReportText(value){if(reportDraft){reportDraft.text=value;reportDraft.edited=true;}}
async function copyReport(){
 const output=document.getElementById('report-text'),status=document.getElementById('report-status');if(!output?.value.trim())return;
 try{await navigator.clipboard.writeText(output.value);status.textContent='Résumé copié.';}
 catch(error){output.focus();output.select();status.textContent='Copie automatique indisponible : le texte est sélectionné, utilise Ctrl+C ou Copier.';}
}
