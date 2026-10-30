import test from 'node:test';
import assert from 'node:assert/strict';
import {restoreBackupStorage} from '../src/restore.ts';
const backup={notes:[],invoices:[],profile:{business:'Shop',owner:'Owner',phone:'',payment:''},lang:'ar'};
const mock=(failKey)=>{const values=new Map([['satu-notes','old-notes'],['satu-invoices','old-invoices'],['satu-language','ms']]);return{values,getItem:k=>values.has(k)?values.get(k):null,setItem(k,v){if(k===failKey)throw Error('quota');values.set(k,v)},removeItem:k=>values.delete(k)}};
test('restore writes all validated collections and language',()=>{const store=mock();restoreBackupStorage(store,backup);assert.equal(store.getItem('satu-language'),'ar');assert.equal(store.getItem('satu-notes'),'[]');assert.equal(JSON.parse(store.getItem('satu-profile')).business,'Shop')});
test('failed restore rolls back previous records where storage permits',()=>{const store=mock('satu-profile');assert.throws(()=>restoreBackupStorage(store,backup));assert.equal(store.getItem('satu-notes'),'old-notes');assert.equal(store.getItem('satu-invoices'),'old-invoices');assert.equal(store.getItem('satu-language'),'ms')});
test('optional backup fields do not overwrite existing profile or language',()=>{const store=mock();restoreBackupStorage(store,{notes:[],invoices:[]});assert.equal(store.getItem('satu-language'),'ms');assert.equal(store.getItem('satu-profile'),null)});

test('restore boundary rejects invalid data before touching storage',()=>{const store=mock();assert.throws(()=>restoreBackupStorage(store,{notes:[{id:1}],invoices:[]}));assert.equal(store.getItem('satu-notes'),'old-notes');assert.equal(store.getItem('satu-invoices'),'old-invoices')});

test('restoration rejects oversized in-memory backup before writing',()=>{const store=mock();const large={notes:[{id:1,name:'X',phone:'',detail:'x'.repeat(5*1024*1024),status:'Unpaid',amount:1}],invoices:[]};assert.throws(()=>restoreBackupStorage(store,large),/size limit/);assert.equal(store.getItem('satu-notes'),'old-notes')});
