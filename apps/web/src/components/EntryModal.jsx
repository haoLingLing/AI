import React,{useEffect,useState} from 'react';
import {X} from 'lucide-react';
import {cents,id,runRecurring,saveEntry,today} from '@qingzhang/core';

export default function EntryModal({data,state,onClose,onSave}){
  const [type,setType]=useState(data.type||'expense');
  const [error,setError]=useState('');
  const isBudget=data.budget;
  const isNewAccount=data.newAccount;

  function submit(event){
    event.preventDefault();
    try{
      const fields=Object.fromEntries(new FormData(event.currentTarget));
      if(isBudget){onSave({...state,budgets:Object.fromEntries(Object.entries(fields).map(([key,value])=>[key,cents(value)]))});return;}
      if(isNewAccount){onSave({...state,accounts:[...state.accounts,{id:id(),name:fields.name,opening:Math.round(Number(fields.opening)*100)}]});return;}
      const entry={...data,...fields,type,amount:cents(fields.amount)};
      if(data.recurring){
        if(type==='transfer')throw Error('周期账单支持收入与支出');
        const rule={...entry,id:id(),nextDate:entry.date,day:Number(entry.date.slice(8)),active:true};
        onSave(runRecurring({...state,recurring:[...state.recurring,rule]}));
      }else onSave(saveEntry(state,entry));
    }catch(submitError){setError(submitError.message);}
  }

  useEffect(()=>{function onKeyDown(event){if(event.key==='Escape')onClose();}document.addEventListener('keydown',onKeyDown);return()=>document.removeEventListener('keydown',onKeyDown);},[onClose]);

  return <div className="overlay" onClick={event=>event.target===event.currentTarget&&onClose()}><section className="modal" role="dialog" aria-modal="true" aria-label="编辑记录"><div className="panel-heading"><div><p className="eyebrow">MAKE IT COUNT</p><h2>{isBudget?'设置月度预算':isNewAccount?'添加账户':data.recurring?'添加周期账单':data.id?'编辑账目':'记录生活的一笔'}</h2></div><button aria-label="关闭" onClick={onClose}><X/></button></div><form onSubmit={submit}>{isBudget?Object.entries(state.budgets).map(([key,value])=><label key={key}>{key==='total'?'总预算':key}<input name={key} type="number" min="0.01" step="0.01" defaultValue={value/100} required/></label>):isNewAccount?<><label>账户名称<input name="name" required maxLength={30}/></label><label>初始余额<input name="opening" type="number" step="0.01" defaultValue="0" required/></label></>:<><div className="tabs">{[['expense','支出'],['income','收入'],...(!data.recurring?[['transfer','转账']]:[])].map(([value,label])=><button key={value} type="button" className={value===type?'selected':''} onClick={()=>setType(value)}>{label}</button>)}</div><label className="amount-input">金额 · CNY<input autoFocus name="amount" type="number" step="0.01" min="0.01" placeholder="0.00" defaultValue={data.amount?data.amount/100:''} required/></label><div className="form-grid"><label>{type==='transfer'?'转出账户':'账户'}<select name="account" defaultValue={data.account||state.accounts[0].id}>{state.accounts.map(account=><option value={account.id} key={account.id}>{account.name}</option>)}</select></label>{type==='transfer'?<label>转入账户<select name="target" defaultValue={data.target||state.accounts[1]?.id}>{state.accounts.map(account=><option value={account.id} key={account.id}>{account.name}</option>)}</select></label>:<label>分类<select name="category" defaultValue={data.category||state.categories[0]}>{state.categories.map(category=><option key={category}>{category}</option>)}</select></label>}</div><label>{data.recurring?'首次日期（此后每月）':'日期'}<input name="date" type="date" defaultValue={data.date||today()} required/></label><label>备注<input name="note" placeholder="记录这笔收支的故事" maxLength={200} defaultValue={data.note}/></label></>}{error&&<p role="alert" className="warning">{error}</p>}<button className="primary full" type="submit">保存记录</button></form></section></div>;
}
