// Manual RP writing aid. Memory only, no patient record, storage or network request.
let reportDraft=null;
function resetReportDraft(){reportDraft=null;}
function reportEscape(text){return String(text||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function reportDraftFor(kind){
 const surgery=kind==='surgery',id=surgery?currentSurgery:currentFlow,key=`${kind}:${id}`;
 const motifs={minor:'Examen d’une lésion légère ou d’une contusion',fight:'Examen à la suite de coups',checkup:'Consultation de contrôle',fatigue:'Consultation pour fatigue',digestive:'Consultation pour troubles digestifs',cough:'Consultation pour toux',fever:'Consultation pour fièvre',dental:'Consultation pour douleur dentaire'};
 if(!reportDraft||reportDraft.key!==key)reportDraft={key,kind,motif:(!surgery&&motifs[id])||(surgery?surgeries[id]:flows[id]).title,details:'',care:'',prescription:'',notes:'',suture:'',count:'',text:'',edited:false,stale:false,open:false};
 return reportDraft;
}
function reportMarkup(kind){
 const draft=reportDraftFor(kind),sutures=kind==='flow'&&['gunshot','knife'].includes(currentFlow);
 const textarea=(key,label,placeholder)=>`<label class="report-field" for="report-${key}">${label}<textarea id="report-${key}" rows="3" maxlength="4000" placeholder="${placeholder}" oninput="updateReportField('${key}',this.value)">${reportEscape(draft[key])}</textarea></label>`;
 return `<details class="care-report" ${draft.open?'open':''} ontoggle="if(this.isConnected&&reportDraft)reportDraft.open=this.open"><summary>Rédiger un compte rendu</summary><p class="muted report-hint">Note RP au ton de 1889. Renseigne uniquement les observations, gestes et prescriptions réellement joués. Rien n’est enregistré.</p><div class="report-fields"><label class="report-field report-wide" for="report-motif">Motif de l’intervention / consultation<input id="report-motif" maxlength="500" value="${reportEscape(draft.motif)}" oninput="updateReportField('motif',this.value)"></label>${textarea('details','Détails de la blessure / constatations','Ex. : Plaie à l’épaule droite, avec saignement modéré constaté.')}${textarea('care','Soins réellement pratiqués','Ex. : Nettoyage de la plaie et pose d’un pansement. Ne renseigner que les gestes joués.')}${sutures?`<fieldset class="report-sutures report-wide"><legend>Points de suture</legend><label for="report-suture">Suture réellement effectuée<select id="report-suture" onchange="updateReportSuture(this.value)"><option value="" ${!draft.suture?'selected':''}>Non renseignée</option><option value="yes" ${draft.suture==='yes'?'selected':''}>Oui</option><option value="no" ${draft.suture==='no'?'selected':''}>Non</option></select></label><label id="report-count-field" for="report-count" ${draft.suture==='yes'?'':'hidden'}>Nombre de points posés<input id="report-count" type="number" min="1" max="999" step="1" placeholder="Si connu" value="${reportEscape(draft.count)}" oninput="updateReportField('count',this.value)"></label><small>Un choix « suture possible » dans le parcours ne confirme pas sa réalisation.</small></fieldset>`:''}${textarea('prescription','Prescriptions et recommandations','Ex. : Repos convenu dans la scène et renouvellement du pansement selon les consignes données.')}${textarea('notes','Notes libres du praticien','Tes précisions, réserves, observations ou rendez-vous convenus.')}</div><div class="report-actions"><button class="next" type="button" onclick="generateReport()">${draft.text?'Actualiser le texte':'Générer le texte'}</button><span id="report-status" role="status">${draft.stale?'Les renseignements ont changé : actualise le texte.':''}</span></div><div id="report-result" ${draft.text?'':'hidden'}><label class="report-field" for="report-text">Compte rendu modifiable<textarea id="report-text" rows="10" oninput="updateReportText(this.value)">${reportEscape(draft.text)}</textarea></label><div class="report-actions"><button class="secondary" type="button" onclick="copyReport()">Copier le compte rendu</button><small>Relis avant de le transmettre. Aucun traitement, nombre de points ou résultat n’est déduit automatiquement.</small></div></div></details>`;
}
function updateReportField(key,value){
 if(!reportDraft||!['motif','details','care','prescription','notes','count'].includes(key))return;
 reportDraft[key]=value;reportDraft.stale=!!reportDraft.text;
 const status=document.getElementById('report-status');if(status)status.textContent=reportDraft.stale?'Les renseignements ont changé : actualise le texte.':'';
}
function updateReportSuture(value){
 if(!reportDraft||!['','yes','no'].includes(value))return;
 reportDraft.suture=value;if(value!=='yes')reportDraft.count='';
 document.getElementById('report-count-field').hidden=value!=='yes';document.getElementById('report-count').value=reportDraft.count;
 updateReportField('count',reportDraft.count);
}
function reportSentence(text){const value=String(text||'').trim().replace(/[\u2013\u2014]/g,'-');return value?value+(/[.!?…]$/.test(value)?'':'.'):'';}
function reportCompose(draft){
 const lines=['Elkins & Elkins',draft.kind==='surgery'?'Rapport d’intervention chirurgicale':'Note de consultation et de soins',''];
 lines.push(`Motif de la visite : ${reportSentence(draft.motif)}`);
 lines.push(draft.details.trim()?`Examen et constatations : ${reportSentence(draft.details)}`:'Les constatations particulières de l’examen n’ont pas été renseignées.');
 lines.push(draft.care.trim()?`Soins pratiqués : ${reportSentence(draft.care)}`:'Les gestes effectivement pratiqués ne sont pas précisés dans la présente note.');
 if(draft.kind==='flow'&&['flow:gunshot','flow:knife'].includes(draft.key)){
  if(draft.suture==='yes')lines.push(draft.count?`La plaie a été réunie par ${draft.count} point${Number(draft.count)>1?'s':''} de suture.`:'Une suture de la plaie est rapportée ; le nombre de points n’est pas précisé.');
  else if(draft.suture==='no')lines.push('Aucun point de suture n’a été posé.');
  else lines.push('La réalisation éventuelle d’une suture n’est pas renseignée.');
 }
 lines.push(draft.prescription.trim()?`Prescriptions et recommandations : ${reportSentence(draft.prescription)}`:'Aucune prescription ni recommandation particulière n’est consignée dans cette note.');
 if(draft.notes.trim())lines.push(`Observations du praticien : ${reportSentence(draft.notes)}`);
 return lines.slice(0,2).join('\n')+'\n\n'+lines.slice(3).join('\n\n');
}
function generateReport(){
 if(!reportDraft)return;
 const motif=document.getElementById('report-motif');if(!reportDraft.motif.trim()){motif.setCustomValidity('Indique le motif de la visite.');motif.reportValidity();motif.setCustomValidity('');return;}
 const count=document.getElementById('report-count');if(reportDraft.suture==='yes'&&count&&!count.checkValidity()){count.reportValidity();return;}
 if(reportDraft.edited&&!confirm('Actualiser remplacera tes modifications du compte rendu. Continuer ?'))return;
 reportDraft.text=reportCompose(reportDraft);reportDraft.edited=false;reportDraft.stale=false;
 document.getElementById('report-text').value=reportDraft.text;document.getElementById('report-result').hidden=false;
 document.getElementById('report-status').textContent='Texte prêt à relire et à modifier.';
 document.querySelector('.report-actions .next').textContent='Actualiser le texte';
}
function updateReportText(value){if(reportDraft){reportDraft.text=value;reportDraft.edited=true;}}
async function copyReport(){
 const output=document.getElementById('report-text'),status=document.getElementById('report-status');if(!output?.value.trim())return;
 try{await navigator.clipboard.writeText(output.value);status.textContent='Compte rendu copié.';}
 catch(error){output.focus();output.select();status.textContent='Copie automatique indisponible : le texte est sélectionné, utilise Ctrl+C ou Copier.';}
}
