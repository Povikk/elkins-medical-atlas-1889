import {handleRates} from './rates.mjs';
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==='/api/cabinet-rates')return handleRates(request,env);
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
  let path;try{path=decodeURIComponent(url.pathname);}catch{return new Response('Bad request',{status:400});}
  if(path==='/')path='/index.html';
  const asset=SITE_ASSETS[path];
  if(!asset)return new Response('Not found',{status:404});
  const bytes=Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0));
  return new Response(request.method==='HEAD'?null:bytes,{headers:{'Content-Type':asset.type,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'}});
 }
};
