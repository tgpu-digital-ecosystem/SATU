import test from 'node:test';
import assert from 'node:assert/strict';
import {validBackup,validInvoice,validNote} from '../src/backup.ts';
const sample=()=>({version:2,lang:'ar',profile:{business:'متجر',owner:'Owner',phone:'',payment:''},notes:[{id:1,name:'Aisyah',phone:'',detail:'',status:'Belum Bayar',amount:25}],invoices:[{id:2,customer:'Ali',date:'2026-10-30',amount:40,status:'Unpaid',items:[{id:1,description:'كتاب',qty:2,unitPrice:20}]}]});
test('backup JSON round trip retains records and Arabic language',()=>{const restored=JSON.parse(JSON.stringify(sample()));assert.equal(validBackup(restored),true);assert.deepEqual(restored,sample())});
test('malformed nested items are rejected',()=>{const v=sample();v.invoices[0].items[0].qty=-1;assert.equal(validBackup(v),false)});
test('invalid profile rejects entire restore',()=>{const v=sample();v.profile.owner=undefined;assert.equal(validBackup(v),false)});
test('unsupported language rejected',()=>{const v=sample();v.lang='xx';assert.equal(validBackup(v),false)});
test('invalid amount and nonfinite numbers rejected',()=>{assert.equal(validNote({id:1,name:'X',amount:Infinity}),false);assert.equal(validInvoice({id:1,customer:'X',amount:NaN,status:'Paid'}),false)});
test('missing required collections rejected',()=>{assert.equal(validBackup({notes:[]}),false)});

test('valid backup without optional profile and language is accepted',()=>{assert.equal(validBackup({notes:[],invoices:[]}),true)});
test('invoice with malformed items array is rejected',()=>{const v=sample();v.invoices[0].items='bad';assert.equal(validBackup(v),false)});
test('invoice with infinite line item price is rejected',()=>{const v=sample();v.invoices[0].items[0].unitPrice=Infinity;assert.equal(validBackup(v),false)});
test('backup with null profile is rejected',()=>{const v=sample();v.profile=null;assert.equal(validBackup(v),false)});
test('backup with nonfinite invoice amount is rejected',()=>{const v=sample();v.invoices[0].amount=Infinity;assert.equal(validBackup(v),false)});
