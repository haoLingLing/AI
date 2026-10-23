import React from 'react';
import {ArrowDownRight,ArrowUpRight} from 'lucide-react';
import {money} from '@qingzhang/core';
import {COLORS} from '../config';

export function Summary({sum}){
  return <div className="summary"><article className="balance"><p>本月结余 <span>MONTHLY BALANCE</span></p><strong>{money(sum.income-sum.expense)}</strong><small>{sum.income?`结余率 ${Math.round((sum.income-sum.expense)/sum.income*100)}%`:'开始记录，慢慢积累'}</small><div className="abstract"/></article><article><div className="stat-icon"><ArrowUpRight/></div><p>本月收入</p><strong>{money(sum.income)}</strong><small>把努力，变成看得见的积累。</small></article><article><div className="stat-icon orange"><ArrowDownRight/></div><p>本月支出</p><strong className="expense">{money(sum.expense)}</strong><small>每一笔支出，都值得被认真对待。</small></article></div>;
}

export function Trend({trend}){
  const max=Math.max(1,...trend.flatMap(item=>[item.income,item.expense]));
  return <section className="panel"><div className="panel-heading"><h2>收支趋势</h2><span className="muted">最近 6 个月</span></div><div className="chart trend-chart">{trend.map(item=><div className="trend-month" key={item.key}><div className="trend-bars"><i className="trend-income" style={{height:`${Math.max(2,item.income/max*100)}%`}} title={`收入 ${money(item.income)}`}/><i className="trend-expense" style={{height:`${Math.max(2,item.expense/max*100)}%`}} title={`支出 ${money(item.expense)}`}/></div><small>{item.name}</small></div>)}</div><div className="legend"><span>● 收入</span><span>● 支出</span></div></section>;
}

export function Categories({categories,sum}){
  let cursor=0;
  const gradient=categories.map((category,index)=>{const start=cursor;cursor+=category.value/sum.expense*100;return `${COLORS[index%COLORS.length]} ${start}% ${cursor}%`;}).join(',');
  return <section className="panel"><div className="panel-heading"><h2>支出分类</h2><span className="muted">本月</span></div>{categories.length?<div className="category-content"><div className="donut"><div className="donut-ring" style={{background:`conic-gradient(${gradient})`}}/><div className="donut-label"><b>{money(sum.expense)}</b><small>本月支出</small></div></div><div className="category-legend">{categories.map((category,index)=><div key={category.name}><i style={{background:COLORS[index%COLORS.length]}}/><span>{category.name}</span><b>{money(category.value)}</b><small>{Math.round(category.value/sum.expense*100)}%</small></div>)}</div></div>:<p className="empty">本月还没有支出</p>}</section>;
}

export function Budget({state,sum,categories,onEdit}){
  const percentage=state.budgets.total?Math.round(sum.expense/state.budgets.total*100):0;
  return <section className="panel"><div className="panel-heading"><h2>预算进度</h2><button onClick={onEdit}>调整预算</button></div><div className="budget-total"><strong>{percentage}<em>%</em></strong><div>已用 {money(sum.expense)}<small>总预算 {money(state.budgets.total||0)}</small></div></div><div className="progress"><i style={{width:Math.min(100,percentage)+'%',background:percentage>100?'#c97550':''}}/></div>{Object.entries(state.budgets).filter(([key])=>key!=='total').map(([key,value])=>{const used=categories.find(category=>category.name===key)?.value||0;return <div className="budget-row" key={key}><span>{key}</span><div><small>{money(used)} / {money(value)}</small><div className="progress"><i style={{width:Math.min(100,used/value*100)+'%',background:used>value?'#c97550':''}}/></div></div></div>;})}{percentage>=100&&<p className="warning">本月预算已用完，请留意后续支出。</p>}</section>;
}
