import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  AsyncStorage,
} from 'react-native';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state={
    ip:'',
    dev:''
  }

  componentDidMount = async () => {
    try {
      const value = await AsyncStorage.getItem('IP');
      const ID = await AsyncStorage.getItem('DEV');
      if (value !== null) {
        this.setState({ip:value})
      }
      if (ID !== null) {
        this.setState({dev:ID})
      }
    } catch (error) {
      Alert.alert('attention',`pulling saved data: ${error}`)
    }
  }

  moveForward = async () => {
    // console.log(this.state.ip)
    try {
      await AsyncStorage.setItem('IP', this.state.ip);
      await AsyncStorage.setItem('DEV', this.state.dev);
    } catch (error) {
      Alert.alert('attention',`saving data: ${error}`)
    }
    this.state.ip && this.state.dev? this.props.navigation.navigate('Camera',{ip:this.state.ip}) : Alert.alert('Warning','Please enter an IP address for the server')
  }

  render() {
    return (

      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View style={styles.inputContainer}>
            <Text style={styles.uidText}>Server IP: </Text>
            <TextInput
              style={styles.inputBox}
              onChangeText={(ip) => this.setState({ip})}
              value={this.state.ip}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.uidText}>Testing Device: </Text>
            <TextInput
              style={styles.inputBox}
              onChangeText={(dev) => this.setState({dev})}
              value={this.state.dev}
            />
          </View>
          <Text style={{marginHorizontal:20,color:'rgba(96,100,109, 0.3)',fontSize:8}}>Must Enter or else you cannot move foward </Text>


          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={()=>this.moveForward()}>
              <Image style={styles.photoButton} source={require('../assets/images/camera2.jpg')} />
            </TouchableOpacity>
            <Text style={styles.noteText}>Click on camera button to scan</Text>
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              For purpose of taking Acon 14 urinalysis strips images via phone cameras and to convert into quantitative number for subsequent analysis
            </Text>
          </View>
        
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer:{
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-start',
    paddingTop:8,
    marginHorizontal:20,
  },
  inputBox:{
    height: 20, 
    borderColor: 'rgba(96,100,109, 0.5)', 
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal:3,
    alignSelf:'stretch',
    justifyContent:'center',
    alignItems:'center',
    flex:1,
  },
  uidText:{
    fontSize: 14,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 20,
  },
  contentContainer: {
    paddingTop: 80,
  },
  buttonContainer: {
    flex:1,
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 25,
  },
  photoButton:{
    height:150,
    width:150,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    paddingTop:60,
  },
  noteText: {
    marginTop:25,
    fontSize: 12,
    color: 'rgba(96,100,109, 0.5)',
  },
  getStartedText: {
    fontSize: 12,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 17,
    textAlign: 'justify',
  },
});
