import test from 'node:test';
import assert from 'node:assert/strict';
import { BeldexWeb3, detectProvider, toAtomic, fromAtomic } from '@bdxi/web3js';
test('Official Beldex SDK exports documented wallet integration',()=>{
assert.equal(typeof BeldexWeb3,'function');assert.equal(typeof detectProvider,'function');
assert.equal(toAtomic('1.25'),1250000000n);
assert.equal(fromAtomic(1250000000n),'1.25');
});
