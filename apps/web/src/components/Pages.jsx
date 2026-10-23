import React from 'react';
import {CalendarDays,Download,Plus,Upload,Wallet} from 'lucide-react';
import {balance,exportCSV,money,runRecurring} from '@qingzhang/core';

export function RecurringPage({state,onCommit,onAdd,onNotice}){
  return <section className="panel"><div className="panel-heading"><h2>每月固定收支</h2><button onClick={onAdd}><Plus size={15}/>添加周期账单</button></div><p className="muted">每月按指定日期生成，打开账本时补记到期账单。</p>{state.recurring.map(rule=><div className="account-row" key={rule.id}><CalendarDays/><div><b>{rule.note||rule.category}</b><small>开始 {rule.nextDate} · 每月 {rule.day} 日 · {rule.active?'启用':'暂停'}</small></div><b>{money(rule.amount)}</b><button onClick={()=>onCommit({...state,recurring:state.recurring.map(item=>item.id===rule.id?{...item,active:!item.active}:item)})}>{rule.active?'暂停':'启用'}</button><button onClick={()=>confirm('删除此周期规则？已生成账目会保留。')&&onCommit({...state,recurring:state.recurring.filter(item=>item.id!==rule.id)})}>删除</button></div>)}{!state.recurring.length&&<p className="empty">添加房租、工资或订阅，每月自动整理。</p>}<button className="primary" onClick={()=>{onCommit(runRecurring(state));onNotice('已补记到期账单');}}>补记到期账单</button></section>;
}

export function AccountsCategoriesPage({state,onCommit,onAddAccount}){
  function addCategory(){const category=prompt('新分类名称');if(category?.trim()&&!state.categories.includes(category.trim()))onCommit({...state,categories:[...state.categories,category.trim()]});}
  function renameCategory(category){const name=prompt('分类名称',category)?.trim();if(!name||state.categories.includes(name))return;onCommit({...state,categories:state.categories.map(item=>item===category?name:item),entries:state.entries.map(entry=>entry.category===category?{...entry,category:name}:entry),recurring:state.recurring.map(entry=>entry.category===category?{...entry,category:name}:entry),budgets:Object.fromEntries(Object.entries(state.budgets).map(([key,value])=>[key===category?name:key,value]))});}
  function moveCategory(index){if(index===0)return;const categories=[...state.categories];[categories[index-1],categories[index]]=[categories[index],categories[index-1]];onCommit({...state,categories});}
  return <div className="bottom-grid"><section className="panel"><div className="panel-heading"><h2>我的账户</h2><button onClick={onAddAccount}>添加账户</button></div>{state.accounts.map(account=><div className="account-row" key={account.id}><Wallet/><div><b>{account.name}</b><small>当前余额</small></div><strong>{money(balance(state,account.id))}</strong><button onClick={()=>{const name=prompt('账户名称',account.name);if(name?.trim())onCommit({...state,accounts:state.accounts.map(item=>item.id===account.id?{...item,name:name.trim()}:item)});}}>重命名</button></div>)}</section><section className="panel"><div className="panel-heading"><h2>分类管理</h2><button onClick={addCategory}>添加分类</button></div>{state.categories.map((category,index)=><div className="account-row" key={category}><span>{category}</span><button onClick={()=>moveCategory(index)}>↑ 上移</button><button onClick={()=>renameCategory(category)}>编辑</button></div>)}</section></div>;
}

export function SettingsPage({state,onDownload,onUpload}){
  return <section className="panel settings"><h2>数据与隐私</h2><p>数据保存在当前浏览器，不会自动上传或跨设备同步。建议定期下载备份。</p><button onClick={()=>onDownload(JSON.stringify(state,null,2),'青账备份.json','application/json')}><Download size={16}/>下载完整备份</button><label className="button"><Upload size={16}/>恢复备份<input type="file" hidden accept=".json" onChange={event=>onUpload(event,true)}/></label><p>CSV 支持列：date、type、amount、category、account、target、note。金额单位为元，账户填写账户 ID。</p><button onClick={()=>onDownload(exportCSV([]),'青账导入模板.csv')}>下载 CSV 模板</button><div>{state.accounts.map(account=><p key={account.id}>{account.name}：{account.id}</p>)}</div></section>;
}

export function ImportPreview({pending,onCancel,onConfirm}){
  return <div className="overlay"><section className="modal"><h2>{pending.backup?'恢复备份':'导入预览'}</h2><p>{pending.backup?'恢复会替换本机的现有账本，建议先下载备份。':`已通过校验，共 ${pending.entries.length} 笔；导入会新增记录，重复导入会重复记账。`}</p>{pending.entries?.slice(0,5).map(entry=><p key={entry.id}>{entry.date} · {entry.note} · {money(entry.amount)}</p>)}<button onClick={onCancel}>取消</button><button className="primary" onClick={onConfirm}>确认{pending.backup?'恢复':'导入'}</button></section></div>;
}
