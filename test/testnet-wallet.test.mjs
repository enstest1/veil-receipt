import test from 'node:test';
import assert from 'node:assert/strict';
import {isProtoTestnet,parseTestBdxAmount,validateTestSend} from '../public/testnet-wallet.js';
test('testnet-only network gate',()=>{
 assert.equal(isProtoTestnet('testnet'),true);
 assert.equal(isProtoTestnet('mainnet'),false);
 assert.equal(isProtoTestnet(undefined),false);
});
test('precise atomic-unit conversion, no float rounding',()=>{
 assert.equal(parseTestBdxAmount('0.000000001'),1n);
 assert.equal(parseTestBdxAmount('1.25'),1250000000n);
});
test('reject negative, zero, unsafe and excess amounts',()=>{
 for(const a of ['0','-1','0.0000000001','1e3','10.000000001','10000000000']) {
  assert.throws(()=>parseTestBdxAmount(a),undefined,a);
 }
});
test('must be testnet and SDK-valid recipient',()=>{
 assert.throws(()=>validateTestSend({network:'mainnet',recipient:'wallet',amount:'1',checkAddress:()=>({valid:true})}));
 assert.throws(()=>validateTestSend({network:'testnet',recipient:'0x123',amount:'1',checkAddress:()=>({valid:false})}));
 assert.equal(validateTestSend({network:'testnet',recipient:'wallet',amount:'0.1',checkAddress:()=>({valid:true})}).amount,100000000n);
});
