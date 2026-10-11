// Local-only preview fixture. Its tariffs are in memory, never production R2.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../dist/server/index.js',import.meta.url),'utf8');
const worker=(await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).default;
let value=null,etag=0;
const env={CABINET_ADMIN_EMAIL:'preview@example.test',BUCKET:{
 async get(){const copy=value,tag=String(etag);return copy?{etag:tag,text:async()=>copy}:null;},
 async put(key,data,{onlyIf}){if(onlyIf.etagMatches&&onlyIf.etagMatches!==String(etag)||onlyIf.etagDoesNotMatch==='*'&&value)return null;value=data;return {etag:String(++etag)};}
}};
http.createServer(async(req,res)=>{
 try{
  const chunks=[];for await(const chunk of req)chunks.push(chunk);
  const request=new Request('http://127.0.0.1:4173'+req.url,{method:req.method,headers:{...req.headers,'oai-authenticated-user-id':'local-preview','oai-authenticated-user-email':'preview@example.test'},...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});
  const response=await worker.fetch(request,env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500);res.end('Preview error');}
}).listen(4173,'127.0.0.1',()=>console.log('Local preview (test tariffs only): http://127.0.0.1:4173/'));
