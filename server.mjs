import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createKeys, createInvoice, createReceipt, verifyReceipt, secretOK } from './lib.mjs';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const DATA=path.join(ROOT,'data'); fs.mkdirSync(DATA,{recursive:true});
const keyfile=path.join(DATA,'issuer-keys.json');
const keys=fs.existsSync(keyfile)?JSON.parse(fs.readFileSync(keyfile,'utf8')):createKeys();
if(!fs.existsSync(keyfile))fs.writeFileSync(keyfile,JSON.stringify(keys),{mode:0o600});
const storefile=path.join(DATA,'state.json');
let db=fs.existsSync(storefile)?JSON.parse(fs.readFileSync(storefile,'utf8')):{invoices:[],receipts:[]};
const save=()=>{fs.writeFileSync(storefile+'.tmp',JSON.stringify(db,null,2),{mode:0o600});fs.renameSync(storefile+'.tmp',storefile)};
const port=Number(process.env.PORT||8788),host=process.env.HOST||'127.0.0.1';
const secret=process.env.OPERATOR_SECRET||'';
const authorized=req=>secretOK(req.headers['x-operator-secret'],secret);
const send=(r,n,o)=>{r.writeHead(n,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});r.end(JSON.stringify(o))};
async function body(req){let s='';for await(const c of req){s+=c;if(s.length>20000)throw Error('Payload too large')}return JSON.parse(s||'{}')}
const server=http.createServer(async(req,res)=>{try{
const route=new URL(req.url,'http://localhost').pathname;
if(route==='/api/health')return send(res,200,{ok:true,mode:'prototype',network:'Beldex testnet',chainVerification:false});
if(route==='/api/public-key')return send(res,200,{publicKey:keys.publicKey,algorithm:'Ed25519'});
if(route==='/api/verify'&&req.method==='POST'){const r=await body(req);return send(res,200,{valid:verifyReceipt(r,keys.publicKey),meaning:'Signature only; NOT blockchain proof'})}
if(route==='/api/invoices'&&req.method==='GET'){if(!authorized(req))return send(res,403,{error:'Operator key required'});return send(res,200,{invoices:db.invoices.map(i=>({id:i.id,title:i.title,token:i.token,amount:i.amount,status:i.status,destinationMask:i.destination.slice(0,8)+'...'+i.destination.slice(-5),receiptId:i.receiptId}))})}
if(route==='/api/invoices'&&req.method==='POST'){if(!authorized(req))return send(res,403,{error:'Operator key required'});const i=createInvoice(await body(req));db.invoices.unshift(i);save();return send(res,201,{invoice:{id:i.id,status:i.status}})}
const m=route.match(/^\/api\/invoices\/([a-z0-9-]+)(?:\/(review|receipt))?$/);
if(m){
if(!authorized(req))return send(res,403,{error:'Operator key required'});
const i=db.invoices.find(v=>v.id===m[1]);if(!i)return send(res,404,{error:'Invoice not found'});
if(req.method==='POST'&&m[2]==='review'){
if(i.receiptId)return send(res,409,{error:'Already signed'});
const b=await body(req);if(!/^[A-Za-z0-9_-]{8,150}$/.test(String(b.txid||''))||!String(b.basis||'').trim())return send(res,400,{error:'Valid reference and review basis required'});
i.evidence={txid:String(b.txid),basis:String(b.basis).slice(0,250),reviewer:'operator'};
i.status='operator-reviewed';save();return send(res,200,{status:i.status,chainVerified:false})}
if(req.method==='POST'&&m[2]==='receipt'){
if(i.receiptId)return send(res,409,{error:'Already signed'});
const receipt=createReceipt(i,keys);db.receipts.push(receipt);i.receiptId=receipt.id;save();return send(res,201,{receipt})}
}
if(route.startsWith('/api/receipts/')&&req.method==='GET'){if(!authorized(req))return send(res,403,{error:'Operator key required'});const r=db.receipts.find(v=>v.id===route.split('/').pop());return r?send(res,200,{receipt:r,valid:verifyReceipt(r,keys.publicKey)}):send(res,404,{error:'Receipt not found'})}
if(req.method!=='GET')return send(res,405,{error:'Method not allowed'});
const filename=route==='/'?'index.html':route.slice(1);
if(!['index.html','styles.css','app.js'].includes(filename))return send(res,404,{error:'Not found'});
const type=filename.endsWith('.css')?'text/css':filename.endsWith('.js')?'text/javascript':'text/html';
res.writeHead(200,{'Content-Type':type,'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; connect-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'"});
fs.createReadStream(path.join(ROOT,'public',filename)).pipe(res);
}catch(e){send(res,400,{error:e.message})}});
server.listen(port,host,()=>console.log('VEIL//RECEIPT http://'+host+':'+port+'; operator '+(secret?'enabled':'disabled')+'; chain verification DISABLED'));
