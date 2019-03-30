import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
  AsyncStorage,
} from 'react-native';
import { SQLite,FileSystem,Constants } from 'expo';
import { Ionicons } from '@expo/vector-icons';
const subjectsCN =['白细胞','尿胆原','微量白蛋白','蛋白质','胆红素','葡萄糖','抗坏血酸','比重','酮体','亚硝酸盐','肌酐','pH值','隐血','尿钙']
const subjectsEN =['Leukocyte','Urobilinogen','Microalbumin','Protein','Bilirubin','Glucose','Ascorbic acid','Specific Gravity','Ketone','Nitrite','Creatine','pH','Blood','Calcium'] 


export default class ResultScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state={
    uid:'',
    results:{},
  }

  componentDidMount = async () =>{
    const result = this.props.navigation.getParam('data')
    this.setState({results:result})
  }

  save2db(){
    this.state.uid ? Alert.alert('Alert','save to database?',[{text:'Cancel'},{text:'OK',onPress:()=>this.sendData2Server()}]) : Alert.alert('Alert','results not valid or uid not defined, \n\n 1) press CANCEL to enter uid \n or \n 2) HOME to retake the data',[{text:'Cancel'},{text:'Home',onPress:()=>this.props.navigation.navigate('Home')}])
  }

  sendData2Server = async (uri) => {
    const ip = this.props.navigation.getParam('ip')
    let apiUrl = 'http://'+ ip + ':5000/save2db';
    let ID =''
    try {
      ID = await AsyncStorage.getItem('DEV');
    } catch (error) {
      Alert.alert('attention',`pulling saved data: ${error}`)
    }
    const output ={
      dev: ID,
      uid:this.state.uid,
      data1: this.state.results[subjectsEN[0]]['res'], 
      data2: this.state.results[subjectsEN[1]]['res'], 
      data3: this.state.results[subjectsEN[2]]['res'],  
      data4: this.state.results[subjectsEN[3]]['res'], 
      data5: this.state.results[subjectsEN[4]]['res'], 
      data6: this.state.results[subjectsEN[5]]['res'], 
      data7: this.state.results[subjectsEN[6]]['res'], 
      data8: this.state.results[subjectsEN[7]]['res'],  
      data9: this.state.results[subjectsEN[8]]['res'], 
      data10: this.state.results[subjectsEN[9]]['res'],  
      data11: this.state.results[subjectsEN[10]]['res'],  
      data12: this.state.results[subjectsEN[11]]['res'],  
      data13: this.state.results[subjectsEN[12]]['res'],  
      data14: this.state.results[subjectsEN[13]]['res'],  
      timestamp: Date.now()
    }
  
    let options = {
      method: 'POST',
      body: JSON.stringify(output),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    };
    
    try {
      let results = await fetch(apiUrl, options);
      console.log(results)
      this.props.navigation.navigate('Home')
    }catch(error){
      Alert.alert('Something went wrong',`here is the error message: \n ${error} \n\n press OKAY to return to homepage`,[{text:'Cancel'},{text:'Okay',onPress:()=>this.props.nav.navigation.navigate('Home')}])
    }
  }

  deleteData(){
    Alert.alert('Alert','delete and return to homepage?',[{text:'Cancel'},{text:'OK',onPress:()=>this.props.navigation.navigate('Home')}])
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <TouchableOpacity onPress={()=>this.save2db()} onLongPress={()=>this.deleteData()}>
            <View style={styles.getStartedContainer}>
              <Text style={styles.topText}>
                Kaboom! Below is the Result {'\n'}
                CLICK ON ME TO SAVE!
              </Text> 
            </View>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.uidText}>enter UID b4 saving: </Text>
            <TextInput
              style={styles.inputBox}
              onChangeText={(uid) => this.setState({uid})}
              value={this.state.uid}
            />
            
          </View>

          {/* <Text style={{marginHorizontal:20,color:'rgba(96,100,109, 0.3)',fontSize:8}}>note if you enter the same UID it will overwrite old data with same uid </Text> */}
          
      
          <View style={styles.resultContainer}>
            {
              subjectsCN.map((value,index)=>{
                return(
                  <View style={styles.resultItemContainer} key={index}>
                    {/* <Ionicons name="ios-help-circle-outline" size={20}/> */}
                    <View style={{width:'50%'}}>
                      <Text style={styles.getStartedText}>{value}({subjectsEN[index]})</Text>
                    </View>
                    <Text style={styles.getStartedText}>
                      {this.state.results[subjectsEN[index]]?this.state.results[subjectsEN[index]]['res'] :'n/a'}
                    </Text>
                    <Text style={styles.getStartedText}>
                      {this.state.results[subjectsEN[index]]?this.state.results[subjectsEN[index]]['conf'].toFixed(2):'n/a'}
                    </Text>

                    {/* <Ionicons name="ios-arrow-dropdown" size={20}/> */}
                  </View>
                )
              })
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'pink',
  },
  contentContainer: {
    paddingTop: 50,
  },
  inputContainer:{
    flexDirection:'row',
    justifyContent:'flex-start',
    paddingTop:20,
    marginHorizontal:20,
  },
  inputBox:{
    paddingLeft:3,
    height: 20, 
    borderColor: 'gray', 
    borderWidth: 1,
    borderRadius: 5,
    width:150,
    flex:1
  },
  resultContainer:{
    paddingTop:25,
    // backgroundColor:'grey',
  },
  resultItemContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    // alignItems:'center',
    paddingHorizontal:15, 
    marginVertical:3,
    paddingVertical:5,
    borderRadius:5,
    borderColor:'rgba(232,232,232,0.7)',
    borderWidth:0.5,
    shadowColor: 'black',
    shadowOffset: { height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // backgroundColor:'green',
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  getStartedText: {
    fontSize: 14,
    color: 'rgba(0,0,0, 1)',
    lineHeight: 20,
    textAlign: 'justify',
  },
  topText: {
    fontSize: 18,
    color: 'rgba(0,0,0, 1)',
    lineHeight: 20,
    textAlign: 'center',
    fontWeight:'bold'
  },
  uidText:{
    fontSize: 14,
    color: 'rgba(0,0,0, 1)',
    lineHeight: 20,
  }
});
