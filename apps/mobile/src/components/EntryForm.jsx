import React,{useState} from 'react';
import {Alert,KeyboardAvoidingView,Modal,Platform,SafeAreaView,ScrollView,Text,View} from 'react-native';
import {cents,id,runRecurring,saveEntry,today} from '@qingzhang/core';
import styles from '../styles';
import {Button,Chips,Field} from './ui';

export default function EntryForm({data,state,onClose,onSave}){
  const [type,setType]=useState(data.type||'expense');
  const [amount,setAmount]=useState(data.amount?String(data.amount/100):'');
  const [account,setAccount]=useState(data.account||state.accounts[0].id);
  const [target,setTarget]=useState(data.target||state.accounts[1]?.id);
  const [category,setCategory]=useState(data.category||state.categories[0]);
  const [date,setDate]=useState(data.date||today());
  const [note,setNote]=useState(data.note||'');
  const [budget,setBudget]=useState(Object.fromEntries(Object.entries(state.budgets).map(([key,value])=>[key,String(value/100)])));
  const [name,setName]=useState('');
  const [opening,setOpening]=useState('0');

  function submit(){
    try{
      if(data.budget){onSave({...state,budgets:Object.fromEntries(Object.entries(budget).map(([key,value])=>[key,cents(value)]))});return;}
      if(data.newCategory){if(!name.trim()||state.categories.includes(name.trim()))throw Error('请输入不同的分类名');onSave({...state,categories:[...state.categories,name.trim()]});return;}
      if(data.newAccount){if(!name.trim()||!Number.isFinite(Number(opening)))throw Error('请填写账户名称和有效余额');onSave({...state,accounts:[...state.accounts,{id:id(),name:name.trim(),opening:Math.round(Number(opening)*100)}]});return;}
      const entry={...data,type,amount:cents(amount),account,target:type==='transfer'?target:undefined,category,date,note};
      const checked=saveEntry(state,entry);
      if(data.recurring){const rule={...entry,id:id(),nextDate:date,day:Number(date.slice(8)),active:true};onSave(runRecurring({...state,recurring:[...state.recurring,rule]}));}else onSave(checked);
    }catch(error){Alert.alert('请检查输入',error.message);}
  }

  return <Modal animationType="slide" onRequestClose={onClose}><SafeAreaView style={styles.screen}><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}><View style={styles.top}><Text style={styles.h2}>{data.budget?'调整预算':data.newAccount?'添加账户':data.newCategory?'添加分类':data.recurring?'周期账单':'记一笔'}</Text><Button onPress={onClose}>关闭</Button></View><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">{data.budget?Object.keys(budget).map(key=><Field key={key} label={key==='total'?'总预算':key} keyboardType="decimal-pad" value={budget[key]} onChangeText={value=>setBudget({...budget,[key]:value})}/>):data.newAccount||data.newCategory?<><Field label="名称" value={name} onChangeText={setName}/>{data.newAccount&&<Field label="初始余额" value={opening} onChangeText={setOpening} keyboardType="decimal-pad"/>}</>:<><Chips items={data.recurring?[['expense','支出'],['income','收入']]:[['expense','支出'],['income','收入'],['transfer','转账']]} value={type} onChange={setType}/><Field label="金额 · CNY" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00"/><Text style={styles.small}>{type==='transfer'?'转出账户':'账户'}</Text><Chips items={state.accounts.map(item=>[item.id,item.name])} value={account} onChange={setAccount}/>{type==='transfer'?<><Text style={styles.small}>转入账户</Text><Chips items={state.accounts.map(item=>[item.id,item.name])} value={target} onChange={setTarget}/></>:<><Text style={styles.small}>分类</Text><Chips items={state.categories} value={category} onChange={setCategory}/></>}<Field label={data.recurring?'首次日期（此后每月）':'日期 YYYY-MM-DD'} value={date} onChangeText={setDate}/><Field label="备注" value={note} onChangeText={setNote} maxLength={200}/></>}<Button primary onPress={submit}>保存记录</Button></ScrollView></KeyboardAvoidingView></SafeAreaView></Modal>;
}
