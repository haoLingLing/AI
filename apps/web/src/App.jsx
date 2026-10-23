import React,{useEffect,useMemo,useState} from 'react';
import {breakdown,importCSV,readBackup,today,totals} from '@qingzhang/core';
import {Budget,Categories,Summary,Trend} from './components/Dashboard';
import EntryModal from './components/EntryModal';
import {Footer,Header,Sidebar} from './components/Layout';
import {AccountsCategoriesPage,ImportPreview,RecurringPage,SettingsPage} from './components/Pages';
import Transactions from './components/Transactions';
import {downloadFile,getTrend,loadLedger} from './utils';

const initial=loadLedger();
const defaultFilters={search:'',type:'all',account:'all',category:'all'};

export default function App(){
  const [state,setState]=useState(initial.data);
  const [page,setPage]=useState('总览');
  const [month,setMonth]=useState(today().slice(0,7));
  const [modal,setModal]=useState(null);
  const [notice,setNotice]=useState(initial.error);
  const [filters,setFilters]=useState(defaultFilters);
  const [pending,setPending]=useState(null);
  const [storageOK,setStorageOK]=useState(!initial.error);

  useEffect(()=>{if(!storageOK)return;try{localStorage.setItem('qingzhang-v1',JSON.stringify(state));}catch{setNotice('设备空间不足，数据尚未保存，请导出备份。');}},[state,storageOK]);
  useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),6500);return()=>clearTimeout(timer);},[notice]);

  const sum=useMemo(()=>totals(state.entries,month),[state.entries,month]);
  const categories=useMemo(()=>breakdown(state,month),[state,month]);
  const trend=useMemo(()=>getTrend(state.entries,month),[state.entries,month]);
  const rows=useMemo(()=>state.entries.filter(entry=>entry.date.startsWith(month)&&(filters.type==='all'||entry.type===filters.type)&&(filters.account==='all'||entry.account===filters.account||entry.target===filters.account)&&(filters.category==='all'||entry.category===filters.category)&&`${entry.note} ${entry.category}`.toLowerCase().includes(filters.search.toLowerCase())).sort((a,b)=>b.date.localeCompare(a.date)),[state.entries,month,filters]);

  function commit(next){setStorageOK(true);setState(next);}
  function shiftMonth(amount){const [year,monthNumber]=month.split('-').map(Number);const date=new Date(year,monthNumber-1+amount,1);setMonth(`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`);}
  function changeFilter(key,value){setFilters(current=>({...current,[key]:value}));}
  async function upload(event,isBackup=false){try{const file=event.target.files[0];if(!file)return;const text=await file.text();setPending(isBackup?{backup:readBackup(text)}:{entries:importCSV(text,state)});}catch(error){setNotice(error.message);}event.target.value='';}
  function removeEntry(entry){if(confirm('确定删除这笔账目？'))commit({...state,entries:state.entries.filter(item=>item.id!==entry.id)});}
  function confirmImport(){commit(pending.backup||{...state,entries:[...pending.entries,...state.entries]});setPending(null);setNotice('数据已保存');}

  const transactionProps={rows,state,month,filters,onFiltersChange:changeFilter,onUpload:upload,onDownload:downloadFile,onEdit:setModal,onRemove:removeEntry};
  const budget=<Budget state={state} sum={sum} categories={categories} onEdit={()=>setModal({budget:true})}/>;

  return <div className="shell"><Sidebar page={page} onPageChange={setPage}/><main><Header page={page} month={month} onMonthChange={setMonth} onShift={shiftMonth} onAdd={()=>setModal({})}/>{['总览','统计'].includes(page)&&<><Summary sum={sum}/><div className="charts-grid"><Trend trend={trend}/><Categories categories={categories} sum={sum}/></div></>}{page==='总览'&&<div className="bottom-grid"><Transactions {...transactionProps} compact onShowAll={()=>setPage('账目')}/>{budget}</div>}{page==='账目'&&<Transactions {...transactionProps}/>} {page==='预算'&&budget}{page==='周期账单'&&<RecurringPage state={state} onCommit={commit} onAdd={()=>setModal({recurring:true})} onNotice={setNotice}/>} {page==='账户与分类'&&<AccountsCategoriesPage state={state} onCommit={commit} onAddAccount={()=>setModal({newAccount:true})}/>} {page==='设置'&&<SettingsPage state={state} onDownload={downloadFile} onUpload={upload}/>}<Footer month={month}/></main>{notice&&<div className="toast" role="status">{notice}</div>}{pending&&<ImportPreview pending={pending} onCancel={()=>setPending(null)} onConfirm={confirmImport}/>} {modal&&<EntryModal data={modal} state={state} onClose={()=>setModal(null)} onSave={next=>{commit(next);setModal(null);setNotice('已保存');}}/>}</div>;
}
