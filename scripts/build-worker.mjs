// Keep the existing buildless app intact; embed its assets in one Worker ESM.
import {readdir,readFile,mkdir,writeFile,copyFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.pdf':'application/pdf','.txt':'text/plain; charset=utf-8'};
const assets={};
async function walk(dir,rel=''){
 for(const entry of await readdir(dir,{withFileTypes:true})){
  if(!rel&&['server','.openai'].includes(entry.name))continue;
  const key=rel+'/'+entry.name,file=path.join(dir,entry.name);
  if(entry.isDirectory())await walk(file,key);
  else if(entry.isFile())assets[key]={type:mime[path.extname(file)]||'application/octet-stream',body:(await readFile(file)).toString('base64')};
 }
}
await walk(path.join(root,'dist'));
let source=await readFile(path.join(root,'worker/index.mjs'),'utf8');
source=source.replace("import {handleRates} from './rates.mjs';",(await readFile(path.join(root,'worker/rates.mjs'),'utf8')).replace(/export /g,''));
source='const SITE_ASSETS='+JSON.stringify(assets)+';\n'+source;
await mkdir(path.join(root,'dist/server'),{recursive:true});await mkdir(path.join(root,'dist/.openai'),{recursive:true});
await writeFile(path.join(root,'dist/server/index.js'),source);
await copyFile(path.join(root,'.openai/hosting.json'),path.join(root,'dist/.openai/hosting.json'));
const built=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
if(typeof built.default?.fetch!=='function')throw Error('Invalid Worker');
console.log('Worker built: '+Object.keys(assets).length+' existing assets embedded, '+Buffer.byteLength(source)+' bytes.');
