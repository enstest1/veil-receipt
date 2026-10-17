import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import os from 'node:os';import path from 'node:path';import net from 'node:net';
const freePort=()=>new Promise((yes,no)=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>yes(p))});s.on('error',no)});
test('HTTP flow: authorization, invoice, review, signed operator statement and validation',async()=>{
const data=mkdtempSync(path.join(os.tmpdir(),'veil-ci-'));const port=await freePort();
const secret='integration-test-only-secret',base='http://127.0.0.1:'+port;
const child=spawn(process.execPath,['server.mjs'],{cwd:process.cwd(),env:{...process.env,PORT:String(port),HOST:'127.0.0.1',DATA_DIR:data,OPERATOR_SECRET:secret},stdio:'ignore'});
const req=async(route,method='GET',body,authorized=true)=>fetch(base+route,{method,headers:{'Content-Type':'application/json',...(authorized?{'x-operator-secret':secret}:{})},body:body?JSON.stringify(body):undefined});
try{
let ready=false;for(let i=0;i<30;i++){try{const r=await req('/api/health');if(r.ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,80))}assert.equal(ready,true);
assert.equal((await req('/api/invoices','GET',undefined,false)).status,403);
const a=await req('/api/invoices','POST',{title:'TEST ONLY',amount:'4.50',destination:'not-a-real-wallet',token:'VEIL'});assert.equal(a.status,201);const j=await a.json();assert.equal(j.invoice.status,'unverified');
const id=j.invoice.id;assert.equal((await req('/api/invoices/'+id+'/receipt','POST',{})).status,400);
const rev=await req('/api/invoices/'+id+'/review','POST',{txid:'synthetic-reference-123',basis:'Synthetic integration test; no real payment'});assert.equal(rev.status,200);
const signed=await req('/api/invoices/'+id+'/receipt','POST',{});assert.equal(signed.status,201);const receipt=(await signed.json()).receipt;
const valid=await req('/api/verify','POST',receipt,false);assert.equal((await valid.json()).valid,true);
const invalid=await req('/api/verify','POST',{...receipt,signature:'invalid'},false);assert.equal((await invalid.json()).valid,false);
assert.equal(JSON.stringify(receipt).includes('synthetic-reference-123'),false);
}finally{child.kill();rmSync(data,{recursive:true,force:true})}
});
