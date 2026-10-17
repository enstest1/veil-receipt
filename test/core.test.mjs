import test from 'node:test';
import assert from 'node:assert/strict';
import {createInvoice,createKeys,createReceipt,verifyReceipt,secretOK,sha256} from '../lib.mjs';
test('invalid amounts rejected',()=>{assert.throws(()=>createInvoice({title:'A',amount:'-1',destination:'address'}));assert.throws(()=>createInvoice({title:'A',amount:'2',destination:''}))});
test('new invoice begins unverified',()=>{const i=createInvoice({title:'Services',amount:'2.50',destination:'testnet-address'});assert.equal(i.status,'unverified');assert.equal(i.receiptId,null)});
test('cannot sign without reviewed evidence',()=>{assert.throws(()=>createReceipt(createInvoice({title:'a',amount:'2',destination:'b'}),createKeys()))});
test('signature verifies; tampering invalidates; txid hidden',()=>{const k=createKeys();const i=createInvoice({title:'a',amount:'2',destination:'b'});i.status='operator-reviewed';i.evidence={txid:'test-tx-123456',basis:'Manual review'};const r=createReceipt(i,k);assert.equal(verifyReceipt(r,k.publicKey),true);assert.equal(verifyReceipt({...r,payload:r.payload+'X'},k.publicKey),false);assert.equal(JSON.stringify(r).includes(i.evidence.txid),false);assert.equal(JSON.parse(Buffer.from(r.payload,'base64url')).transactionReferenceHash,sha256(i.evidence.txid))});
test('operator keys checked in constant time',()=>{assert.equal(secretOK('correct','correct'),true);assert.equal(secretOK('wrong','correct'),false);assert.equal(secretOK('','correct'),false)});
