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
} from 'react-native';
import { SQLite,FileSystem } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import Results from '../assets/results';

// import { MonoText } from '../components/StyledText';

const subjectsCN =['白细胞','尿胆原','微量白蛋白','胆红素','葡萄糖','抗坏血酸','比重','酮体','亚硝酸盐','肌酐','pH值','隐血','尿钙']
const subjectsEN =['Leukocyte','Urobilinogen','Protein','Bilirubin','Glucose','Ascorbic acid','Specific Gravity','Ketone','Nitrite','Creatine','pH','Blood','Calcium'] 
// const db = SQLite.openDatabase({name:'urineTest.db'});

export default class ResultScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state={
    uid:'',
    results:[],
  }

  save2db(){
    // this.state.results[0]&&this.state.uid ? Alert.alert('Alert','save to database?',[{text:'Cancel'},{text:'OK',onPress:()=>this.write2db()}]) : Alert.alert('Alert','results not valid or uid not defined, data deleted, press cancel to enter uid or redo to return to homepage',[{text:'Cancel'},{text:'Redo',onPress:()=>this.props.navigation.navigate('Home')}])
    this.state.uid ? Alert.alert('Alert','save to database?',[{text:'Cancel'},{text:'OK',onPress:()=>this.write2db()}]) : Alert.alert('Alert','results not valid or uid not defined, \n\n 1) press CANCEL to enter uid \n or \n 2) HOME to retake the data',[{text:'Cancel'},{text:'Home',onPress:()=>this.props.navigation.navigate('Home')}])
    //SHOULD WE MAKE UID UNIQUE? OVERWRITE etc????
  }

  async write2db(){

    Results.createTable()
    const props ={
      uid:this.state.uid,
      data1: 1, 
      data2: 2, 
      data3: 3, 
      data4: 4,
      data5: 5,
      data6: 6, 
      data7: 7, 
      data8: 8, 
      data9: 9, 
      data10: 0, 
      data11: 1, 
      data12: 2, 
      data13: 3, 
      data14: 4, 
      timestamp: Date.now()
    }
    Results.create(props)

    await FileSystem.moveAsync({
      from: this.props.navigation.getParam('uri'),
      to: `${FileSystem.documentDirectory}photos/${this.state.uid}.jpg`,
    });

    // const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    // console.log('Photos updated to database, list of photos: ', photos)

    // const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('urineTest.db'))
    // databaseLayer.executeSql('SELECT * from Results').then(response => {
    // console.log('!!!!!updated results:', response)
    // })

  


    // await db.transaction(tx => {
    //   tx.executeSql(
    //     'create table if not exists result(id integer primary key not null, date int, Leukocyte float(4,2),Urobilinogen float(4,2),Protein float(4,2),Bilirubin float(4,2),Glucose float(4,2),Ascorbic acid float(4,2),Specific Gravity float(4,2),Ketone float(4,2),Nitrite float(4,2),Creatine float(4,2),pH float(4,2),Blood float(4,2),Calcium float(4,2));'
    //   );
    // });
  

    this.props.navigation.navigate('Home')

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
          <Text style={{color:'rgba(0,0,0,0.4)'}}>note if you enter the same UID it will overwrite old data with same uid </Text>
      
          <View style={styles.resultContainer}>
            {
              subjectsCN.map((value,index)=>{
                return(
                  <View style={styles.resultItemContainer} key={index}>
                    <Ionicons name="ios-help-circle-outline" size={20}/>
                    <View style={{width:'50%'}}>
                      <Text style={styles.getStartedText}>{value}({subjectsEN[index]})</Text>
                    </View>
                    <Text style={styles.getStartedText}>{this.state.results[index]?this.state.results[index]:'n/a'}</Text>
                    <Ionicons name="ios-arrow-dropdown" size={20}/>
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
    height: 20, 
    borderColor: 'gray', 
    borderWidth: 1,
    borderRadius: 5,
    width:150,
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
