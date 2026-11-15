import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSparePart, validateTransaction } from '../src/validation.js';

test('spare part validation requires a code, name, and unit', () => {
  assert.equal(validateSparePart({
    code: 'BRG-01', name: 'Busi', category: '', unit: 'pcs', description: ''
  }), null);
  assert.ok(validateSparePart({ code: '', name: 'Busi', unit: 'pcs' }));
  assert.ok(validateSparePart(null));
});

test('transaction validation accepts only positive integer quantities', () => {
  assert.equal(validateTransaction({ sparePartId: 1, type: 'in', quantity: 3 }), null);
  assert.ok(validateTransaction({ sparePartId: 1, type: 'out', quantity: 0 }));
  assert.ok(validateTransaction({ sparePartId: 1, type: 'out', quantity: -1 }));
  assert.ok(validateTransaction({ sparePartId: 1, type: 'other', quantity: 1 }));
  assert.ok(validateTransaction({ sparePartId: 1, type: 'in', quantity: 1.5 }));
  assert.ok(validateTransaction([]));
});
