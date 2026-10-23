import React from 'react';
import {Pressable,ScrollView,Text,TextInput,View} from 'react-native';
import styles from '../styles';

export function Button({children,onPress,primary=false}){return <Pressable accessibilityRole="button" onPress={onPress} style={[styles.button,primary&&styles.primary]}><Text style={[styles.buttonText,primary&&{color:'#fff'}]}>{children}</Text></Pressable>;}
export function Field({label,...props}){return <View style={{marginVertical:8}}><Text style={styles.small}>{label}</Text><TextInput style={styles.input} {...props}/></View>;}
export function Chips({items,value,onChange}){return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{items.map(item=>{const [itemValue,label]=Array.isArray(item)?item:[item,item];return <Pressable key={itemValue} style={[styles.chip,value===itemValue&&styles.selected]} onPress={()=>onChange(itemValue)}><Text style={{fontSize:12,color:value===itemValue?'#fff':'#183e32'}}>{label}</Text></Pressable>;})}</ScrollView>;}
export function Card({children}){return <View style={styles.card}>{children}</View>;}
