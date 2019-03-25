import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state={
    ip:'',
  }

  moveForward() {
    console.log(this.state.ip)
    this.state.ip? this.props.navigation.navigate('Camera',{ip:this.state.ip}) : Alert.alert('Warning','Please enter an IP address for the server')
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
          <Text style={{marginHorizontal:35,color:'rgba(96,100,109, 0.3)',fontSize:8}}>Must Enter or else you cannot move foward </Text>


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
    flexDirection:'row',
    justifyContent:'center',
    paddingTop:20,
    marginHorizontal:20,
  },
  inputBox:{
    height: 20, 
    borderColor: 'rgba(96,100,109, 0.5)', 
    borderWidth: 1,
    borderRadius: 5,
    width:240,
  },
  uidText:{
    fontSize: 14,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 20,
  },
  contentContainer: {
    paddingTop: 30,
  },
  buttonContainer: {
    flex:1,
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  photoButton:{
    height:150,
    width:150,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    paddingTop:50,
  },
  noteText: {
    marginTop:40,
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
