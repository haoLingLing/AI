import {readBackup,runRecurring,seed,totals} from '@qingzhang/core';

export function loadLedger(){
  try{
    const raw=localStorage.getItem('qingzhang-v1');
    return {data:runRecurring(raw?readBackup(raw):seed()),error:''};
  }catch{
    return {data:seed(),error:'保存的数据无法读取，请先导出备份检查。当前显示示例账本，未自动覆盖原数据。'};
  }
}

export function getTrend(entries,month){
  return Array.from({length:6},(_,index)=>{
    const [year,monthNumber]=month.split('-').map(Number);
    const date=new Date(year,monthNumber-6+index,1);
    const key=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
    const result=totals(entries,key);
    return {key,name:`${date.getMonth()+1}月`,income:result.income,expense:result.expense};
  });
}

export function downloadFile(content,name,mime='text/plain'){
  const url=URL.createObjectURL(new Blob([content],{type:mime}));
  const anchor=document.createElement('a');
  anchor.href=url;
  anchor.download=name;
  anchor.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
