// Shared validation for device backups and local records. No network or paid services.
export type BackupNote={id:number;name:string;amount:number;phone?:string;detail?:string;status?:string};
export type BackupItem={id:number;description:string;qty:number;unitPrice:number};
export type BackupInvoice={id:number;customer:string;amount:number;status:'Paid'|'Unpaid';items?:BackupItem[]};
export type BackupProfile={business:string;owner:string;phone:string;payment:string};
export type BackupData={notes:BackupNote[];invoices:BackupInvoice[];profile?:BackupProfile;lang?:'ms'|'en'|'ar';version?:number};
const record=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const finite=(v:unknown):v is number=>typeof v==='number'&&Number.isFinite(v);
const validItem=(v:unknown):v is BackupItem=>record(v)&&finite(v.id)&&typeof v.description==='string'&&finite(v.qty)&&v.qty>=1&&finite(v.unitPrice)&&v.unitPrice>=0;
export const validNote=(v:unknown):v is BackupNote=>record(v)&&finite(v.id)&&typeof v.name==='string'&&finite(v.amount);
export const validInvoice=(v:unknown):v is BackupInvoice=>record(v)&&finite(v.id)&&typeof v.customer==='string'&&finite(v.amount)&&(v.status==='Paid'||v.status==='Unpaid')&&(!('items'in v)||Array.isArray(v.items)&&v.items.every(validItem));
export const validProfile=(v:unknown):v is BackupProfile=>record(v)&&['business','owner','phone','payment'].every(k=>typeof v[k]==='string');
export const validBackup=(v:unknown):v is BackupData=>record(v)&&Array.isArray(v.notes)&&v.notes.every(validNote)&&Array.isArray(v.invoices)&&v.invoices.every(validInvoice)&&(!('profile'in v)||validProfile(v.profile))&&(!('lang'in v)||v.lang==='ms'||v.lang==='en'||v.lang==='ar');
