export type QuickCoach={
 status:'review'|'loss'|'break_even'|'profit';
 breakEvenPerUnit:number;
 extraPerUnit:number;
 afterCostPerUnit:number;
 explanationMs:string;
 explanationEn:string;
 cautionMs:string;
 cautionEn:string;
};
export function quickCoach(cost:number,price:number,quantity:number,extra:number):QuickCoach{
 const nums=[cost,price,quantity,extra];
 if(nums.some(x=>!Number.isFinite(x)||x<0)||quantity<=0){
  return{status:'review',breakEvenPerUnit:0,extraPerUnit:0,afterCostPerUnit:0,
  explanationMs:'Masukkan kos, harga, kuantiti dan kos tambahan yang sah. Kuantiti mesti lebih daripada sifar.',
  explanationEn:'Enter valid non-negative costs and prices, with a quantity above zero.',
  cautionMs:'Kiraan ini panduan kasar. Semak semua kos sebenar dahulu.',
  cautionEn:'These are rough estimates. Confirm all actual costs first.'};
 }
 const extraPerUnit=extra/quantity;
 const breakEvenPerUnit=cost+extraPerUnit;
 const afterCostPerUnit=price-breakEvenPerUnit;
 const total=afterCostPerUnit*quantity;
 const status=Math.abs(total)<0.005?'break_even':total<0?'loss':'profit';
 const explanationMs=status==='loss'
 ?'Anggaran jualan belum menampung modal dan kos tambahan. Semak kos dan harga sebelum keluarkan dokumen.'
 :status==='break_even'?'Anggaran jualan hampir pada titik pulang modal; belum mengambil kira kos yang tidak dimasukkan.'
 :'Anggaran jualan melebihi kos yang diisi. Asingkan juga wang untuk kos yang belum direkodkan.';
 const explanationEn=status==='loss'
 ?'The estimated sale does not cover entered costs. Review pricing and costs before preparing documents.'
 :status==='break_even'?'The estimate is near break-even; unentered expenses are not included.'
 :'The estimated sale covers the entered costs. Allow for other expenses not recorded.';
 return{status,breakEvenPerUnit,extraPerUnit,afterCostPerUnit,explanationMs,explanationEn,
 cautionMs:'Panduan automatik berdasarkan angka di atas sahaja; bukan nasihat kewangan, cukai atau perakaunan. Tiada data pelanggan dihantar.',
 cautionEn:'Automatic guidance based only on the numbers above; not financial, tax or accounting advice. No customer details are transmitted.'};
}
