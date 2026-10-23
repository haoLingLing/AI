import React from 'react';
import {ChevronLeft,ChevronRight,Leaf,Plus} from 'lucide-react';
import {NAV_ITEMS} from '../config';

export function Sidebar({page,onPageChange}){
  return <aside><a className="brand" href="#" onClick={()=>onPageChange('总览')}><Leaf size={39}/><div>青账<small>轻松看清每一笔</small></div></a><nav>{NAV_ITEMS.map(([name,Icon])=><button className={page===name?'active':''} key={name} onClick={()=>onPageChange(name)}><Icon size={20}/><span>{name}</span></button>)}</nav><div className="sidebar-note"><Leaf size={100} strokeWidth={.5}/><p>让好习惯<br/>成就更好的生活。</p><small>LOCAL FIRST · 私人账本</small></div></aside>;
}

export function Header({page,month,onMonthChange,onShift,onAdd}){
  return <header><div><p className="eyebrow">YOUR EVERYDAY, WELL ACCOUNTED.</p><h1>{page==='总览'?'每一笔，都心中有数。':page}</h1><p className="subtitle">记录日常，规划未来，让生活更从容。</p></div><div className="header-actions"><div className="month-picker"><button aria-label="上个月" onClick={()=>onShift(-1)}><ChevronLeft size={17}/></button><input type="month" value={month} onChange={event=>event.target.value&&onMonthChange(event.target.value)}/><button aria-label="下个月" onClick={()=>onShift(1)}><ChevronRight size={17}/></button></div><button className="primary" onClick={onAdd}><Plus size={18}/>记一笔</button></div></header>;
}

export function Footer({month}){return <footer><span>青账 · 好好生活，慢慢积累</span><span>本地保存 · {month}</span></footer>;}
