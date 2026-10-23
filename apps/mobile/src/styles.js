import {StyleSheet} from 'react-native';

export const colors=['#c97550','#43805b','#cbd66d','#9bb49b','#8f9a99'];

export default StyleSheet.create({
  screen:{flex:1,backgroundColor:'#f5f2ea'},
  top:{paddingHorizontal:20,paddingVertical:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  logo:{fontSize:25,fontWeight:'800',color:'#183e32'},
  content:{padding:20,paddingBottom:35},
  eyebrow:{fontSize:8,letterSpacing:2,color:'#829078',marginBottom:10},
  title:{fontSize:36,fontWeight:'800',lineHeight:46,color:'#183e32',letterSpacing:-1},
  row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  columns:{flexDirection:'row',gap:10,marginVertical:10},
  card:{padding:20,borderRadius:18,backgroundColor:'#fffdf7',borderColor:'#e7e5dc',borderWidth:1,marginBottom:14},
  balance:{padding:25,borderRadius:19,backgroundColor:'#183e32',marginBottom:4},
  big:{fontSize:42,fontWeight:'700',color:'#183e32',letterSpacing:-1,marginVertical:15},
  amount:{fontSize:19,fontWeight:'600',color:'#183e32',marginTop:12},
  h2:{fontSize:17,fontWeight:'700',color:'#183e32'},
  small:{fontSize:11,color:'#7c8c78'},
  button:{paddingHorizontal:15,paddingVertical:12,borderRadius:10,borderWidth:1,borderColor:'#dfe2d6',alignItems:'center',marginVertical:3},
  primary:{backgroundColor:'#183e32',borderColor:'#183e32'},
  buttonText:{fontSize:12,color:'#183e32',fontWeight:'600'},
  track:{height:6,backgroundColor:'#eaeede',borderRadius:8,marginTop:8,overflow:'hidden'},
  bar:{height:6,backgroundColor:'#43805b',borderRadius:8},
  transaction:{paddingVertical:15,borderBottomWidth:1,borderBottomColor:'#eeede5',flexDirection:'row',alignItems:'center',gap:10},
  input:{padding:14,borderWidth:1,borderColor:'#dfe2d6',borderRadius:10,backgroundColor:'#fffdf7',marginTop:7,color:'#183e32',fontSize:16},
  chips:{flexDirection:'row',gap:7,paddingVertical:12},
  chip:{paddingHorizontal:15,paddingVertical:10,borderWidth:1,borderColor:'#dfe2d6',borderRadius:20},
  selected:{backgroundColor:'#183e32'},
  nav:{flexDirection:'row',paddingHorizontal:10,paddingVertical:10,gap:4,borderTopWidth:1,borderTopColor:'#e7e5dc',backgroundColor:'#fffdf7'},
  navItem:{flex:1,paddingVertical:12,borderRadius:10,alignItems:'center'},
  navActive:{backgroundColor:'#183e32'},
});
