// Sites dispatch supplies verified identity headers. Only tariffs live in R2.
const RATE_KEY='cabinet/tariffs-v1.json';
const DEFAULT_RATES={kitCents:40,syringeCents:75,revision:'initial'};
export function validRates(data){return data&&['kitCents','syringeCents'].every(k=>Number.isSafeInteger(data[k])&&data[k]>=0&&data[k]<=10000)&&typeof data.revision==='string'&&data.revision.length<=64;}
function isAdmin(request,env){
 const email=request.headers.get('oai-authenticated-user-email')?.trim().toLowerCase();
 return Boolean(request.headers.get('oai-authenticated-user-id')&&env.CABINET_ADMIN_EMAIL&&email===env.CABINET_ADMIN_EMAIL.trim().toLowerCase());
}
function json(data,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
async function readRates(bucket){
 const object=await bucket.get(RATE_KEY);
 if(!object)return {rates:{...DEFAULT_RATES},etag:null};
 const rates=JSON.parse(await object.text());
 if(!validRates(rates))throw Error('Invalid stored tariffs');
 return {rates,etag:object.etag};
}
async function boundedBody(request){
 if(Number(request.headers.get('content-length')||0)>1024)throw Error('Too large');
 const reader=request.body?.getReader();if(!reader)throw Error('Missing body');
 let size=0,text='';const decoder=new TextDecoder();
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>1024)throw Error('Too large');text+=decoder.decode(value,{stream:true});}return JSON.parse(text+decoder.decode());}
 finally{await reader.cancel().catch(()=>{});}
}
export async function handleRates(request,env){
 const method=request.method;
 if(!['GET','PUT'].includes(method))return json({error:'Méthode non autorisée.'},405);
 if(method==='PUT'){
  if(!isAdmin(request,env))return json({error:'Seul le propriétaire peut modifier les tarifs.'},403);
  if(request.headers.get('origin')!==new URL(request.url).origin||!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type')||''))return json({error:'Requête non autorisée.'},403);
 }
 if(!env.BUCKET)return json({error:'Tarifs partagés indisponibles.'},503);
 try{
  const {rates,etag}=await readRates(env.BUCKET);
  if(method==='GET')return json({...rates,canEdit:isAdmin(request,env)});
  let body;try{body=await boundedBody(request);}catch{return json({error:'Formulaire invalide.'},400);}
  if(!validRates(body))return json({error:'Montants invalides : entre 0 et 100 $, au centime.'},400);
  if(body.revision!==rates.revision)return json({error:'Les tarifs ont changé. Recharge les valeurs avant de réessayer.'},409);
  const updated={kitCents:body.kitCents,syringeCents:body.syringeCents,revision:crypto.randomUUID()};
  const written=await env.BUCKET.put(RATE_KEY,JSON.stringify(updated),{onlyIf:etag?{etagMatches:etag}:{etagDoesNotMatch:'*'},httpMetadata:{contentType:'application/json'}});
  if(!written)return json({error:'Une autre modification a été enregistrée. Recharge les tarifs.'},409);
  return json({...updated,canEdit:true});
 }catch{return json({error:'Tarifs partagés indisponibles. Réessaie dans un instant.'},503);}
}
