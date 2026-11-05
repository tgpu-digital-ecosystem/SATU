import test from 'node:test';
import assert from 'node:assert/strict';
import {validBackup,validMeeting} from '../src/backup.ts';
import {restoreBackupStorage} from '../src/restore.ts';

const meeting={id:'meeting-1',title:'Client call',when:'2026-12-10T14:00',link:'https://meet.google.com/abc-defg-hij',notes:'Discuss proposal'};
const backup=()=>({version:3,notes:[],invoices:[],meetings:[{...meeting}],lang:'ar'});
const storage=(failKey)=>{const values=new Map([['satu-notes','old-notes'],['satu-invoices','old-invoices'],['satu-meetings-v1','old-meetings']]);return{values,getItem:k=>values.has(k)?values.get(k):null,setItem(k,v){if(k===failKey)throw Error('quota');values.set(k,v)},removeItem:k=>values.delete(k)}};

test('version 3 backup accepts a valid meeting and retains Arabic selection',()=>{const data=JSON.parse(JSON.stringify(backup()));assert.equal(validBackup(data),true);assert.equal(data.lang,'ar');assert.equal(validMeeting(data.meetings[0]),true)});
test('version 2 backups without meetings remain compatible',()=>{assert.equal(validBackup({version:2,notes:[],invoices:[]}),true)});
test('invalid meeting rejects the complete backup',()=>{const data=backup();data.meetings[0].link='javascript:alert(1)';assert.equal(validBackup(data),false)});
test('duplicate meeting IDs reject the complete backup',()=>{const data=backup();data.meetings.push({...meeting});assert.equal(validBackup(data),false)});
test('more than 200 meetings reject backup',()=>{const data=backup();data.meetings=Array.from({length:201},(_,i)=>({...meeting,id:String(i)}));assert.equal(validBackup(data),false)});
test('restore writes meetings alongside notes and invoices',()=>{const store=storage();restoreBackupStorage(store,backup());assert.deepEqual(JSON.parse(store.getItem('satu-meetings-v1')),[meeting]);assert.equal(store.getItem('satu-language'),'ar')});
test('old backup preserves existing meetings',()=>{const store=storage();restoreBackupStorage(store,{version:2,notes:[],invoices:[]});assert.equal(store.getItem('satu-meetings-v1'),'old-meetings')});
test('failed meeting write rolls back existing notes and invoices',()=>{const store=storage('satu-meetings-v1');assert.throws(()=>restoreBackupStorage(store,backup()),/quota/);assert.equal(store.getItem('satu-notes'),'old-notes');assert.equal(store.getItem('satu-invoices'),'old-invoices');assert.equal(store.getItem('satu-meetings-v1'),'old-meetings')});
test('failure after meeting write restores existing meetings',()=>{const store=storage('satu-language');assert.throws(()=>restoreBackupStorage(store,backup()),/quota/);assert.equal(store.getItem('satu-meetings-v1'),'old-meetings');assert.equal(store.getItem('satu-notes'),'old-notes')});
