import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {handleRates} from '../worker/rates.mjs';
let stored=null,etag=0;
const env={CABINET_ADMIN_EMAIL:'owner@example.test',BUCKET:{
 async get(){const value=stored,tag=String(etag);return value?{etag:tag,text:async()=>value}:null;},
 async put(key,value,{onlyIf}){if(onlyIf.etagMatches&&onlyIf.etagMatches!==String(etag)||onlyIf.etagDoesNotMatch==='*'&&stored)return null;stored=value;etag++;return {etag:String(etag)};}
}};
const origin='https://atlas.example.test';
function req(method='GET',body,owner=true,extra={}){return new Request(origin+'/api/cabinet-rates',{method,headers:{...(owner?{'oai-authenticated-user-id':'site-owner','oai-authenticated-user-email':'owner@example.test'}:{}),...(body?{'content-type':'application/json',origin}:{}),...extra},...(body?{body:JSON.stringify(body)}:{})});}
let r=await handleRates(req(),env),initial=await r.json();assert.deepEqual(initial,{kitCents:40,syringeCents:75,revision:'initial',canEdit:true});
assert.equal((await (await handleRates(req('GET',undefined,false),env)).json()).canEdit,false);
assert.equal((await handleRates(req('PUT',initial,false),env)).status,403);
assert.equal((await handleRates(req('PUT',initial,true,{origin:'https://evil.example'}),env)).status,403);
assert.equal((await handleRates(req('PUT',{...initial,kitCents:1.4}),env)).status,400);
assert.equal((await handleRates(req('PUT',{...initial,syringeCents:-1}),env)).status,400);
const updated=await (await handleRates(req('PUT',{...initial,kitCents:55,syringeCents:90}),env)).json();assert.equal(updated.kitCents,55);
assert.equal((await handleRates(req('PUT',initial),env)).status,409);
assert.equal((await (await handleRates(req('GET',undefined,false),env)).json()).syringeCents,90);
const concurrent=await Promise.all([handleRates(req('PUT',{...updated,kitCents:60}),env),handleRates(req('PUT',{...updated,kitCents:65}),env)]);assert.deepEqual(concurrent.map(x=>x.status).sort(),[200,409]);
assert.equal((await handleRates(req(),{})).status,503);
assert.equal((await handleRates(req('PUT',{...updated,kitCents:10001}),env)).status,400);
assert.deepEqual(Object.keys(JSON.parse(stored)).sort(),['kitCents','revision','syringeCents']);
const ratesSource=await readFile('dist/cabinet-rates.js','utf8'),counterSource=await readFile('dist/cabinet.js','utf8');
function client(owner){
 const elements=new Map(),storage=new Map([['elkins-cabinet-counter-v1',JSON.stringify({kits:2,syringes:1,dueCents:155})]]);
 const element=id=>{if(!elements.has(id))elements.set(id,{textContent:'',hidden:false,value:'',setAttribute(){}});return elements.get(id);};
 const buttons=[{getAttribute:()=>"addCabinetItem('kits')"},{getAttribute:()=>"addCabinetItem('syringes')"}];
 const context=vm.createContext({Date,AbortController,setTimeout,clearTimeout,setInterval(){},console,localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)},document:{visibilityState:'visible',getElementById:element,querySelectorAll:()=>buttons,querySelector:()=>element('legend'),addEventListener(){}},window:{addEventListener(){}},confirm:()=>true,fetch:async(path,options)=>handleRates(req(options.method,options.body?JSON.parse(options.body):undefined,owner),env)});
 vm.runInContext(ratesSource,context);vm.runInContext(counterSource,context);
 return {run:code=>vm.runInContext(code,context),storage,elements,buttons};
}
const a=client(true),b=client(false);
await a.run('refreshCabinetRates(true)');await b.run('refreshCabinetRates(true)');
assert.equal(a.elements.get('cabinetSettings').hidden,false);assert.equal(b.elements.get('cabinetSettings').hidden,true);
assert.equal(a.run("parseCabinetRate('0,40')"),40);assert.equal(a.run("parseCabinetRate('0.755')"),null);
const before=await (await handleRates(req(),env)).json();await handleRates(req('PUT',{...before,kitCents:80,syringeCents:120}),env);
await b.run('refreshCabinetRates(true)');await b.run("addCabinetItem('kits')");
assert.deepEqual(JSON.parse(b.storage.get('elkins-cabinet-counter-v1')),{kits:3,syringes:1,dueCents:235});
await b.run("addCabinetItem('syringes')");assert.equal(JSON.parse(b.storage.get('elkins-cabinet-counter-v1')).dueCents,355);
assert.equal(JSON.parse(a.storage.get('elkins-cabinet-counter-v1')).dueCents,155);
b.run("fetch=async()=>{throw Error('offline')}");await b.run('refreshCabinetRates(true)');await b.run("addCabinetItem('kits')");assert.equal(JSON.parse(b.storage.get('elkins-cabinet-counter-v1')).dueCents,435);assert.equal(b.elements.get('cabinetRatesStatus').hidden,false);
const artifact=await readFile('dist/server/index.js','utf8');const worker=(await import('data:text/javascript;base64,'+Buffer.from(artifact).toString('base64'))).default;
assert.equal((await worker.fetch(new Request(origin+'/'),env)).status,200);
assert.equal(await (await worker.fetch(new Request(origin+'/cabinet-rates.js'),env)).text(),ratesSource);
assert.equal((await worker.fetch(new Request(origin+'/assets/emoji/1f4a7.svg'),env)).headers.get('content-type'),'image/svg+xml');
assert.equal((await worker.fetch(new Request(origin+'/missing'),env)).status,404);
console.log('Owner authorization, CSRF, validation, concurrent updates, two clients, preserved debt, offline cache and embedded assets passed.');
