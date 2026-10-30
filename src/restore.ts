import {MAX_BACKUP_BYTES,validBackup,type BackupData} from './backup';

export const restoreBackupStorage=(storage:Pick<Storage,'getItem'|'setItem'|'removeItem'>,data:BackupData):void=>{
 if(!validBackup(data))throw new Error('Invalid backup data');
 const entries:[string,string][]=[['satu-notes',JSON.stringify(data.notes)],['satu-invoices',JSON.stringify(data.invoices)]];
 if(data.profile)entries.push(['satu-profile',JSON.stringify(data.profile)]);
 if(data.lang)entries.push(['satu-language',data.lang]);
 const size=new TextEncoder().encode(JSON.stringify(data)).byteLength;
 if(size>MAX_BACKUP_BYTES)throw new Error('Backup exceeds size limit');
 const previous=entries.map(([key])=>[key,storage.getItem(key)] as const);
 try{for(const [key,value] of entries)storage.setItem(key,value)}
 catch(error){
  for(const [key,value] of previous.reverse()){try{if(value===null)storage.removeItem(key);else storage.setItem(key,value)}catch{}}
  throw error;
 }
};
