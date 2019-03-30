import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Text,StatusBar,Platform,Alert,TouchableHighlight } from 'react-native';
import { FileSystem, MediaLibrary, Permissions} from 'expo';

const PHOTOS_DIR = FileSystem.documentDirectory+ 'photos';

export default class GalleryScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  // state = {
  //   photo:'',
  // };

  componentDidMount = async () => {
    StatusBar.setHidden(true);
    FileSystem.makeDirectoryAsync(PHOTOS_DIR).catch(e => {
      console.log(e, 'Directory exists');
    });
    // const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    // this.setState({ photo:photos[0]});
  };

  deleteAllPhotos = async (photo) =>{
    await FileSystem.deleteAsync(PHOTOS_DIR+'/'+photo)
  }

  sendImageAsync = async (uri) => {
    // console.log('URI:', uri)
    const ip = this.props.ip
    let apiUrl = 'http://'+ ip + ':5000/poc';
    // console.log(apiUrl)
    let formData = new FormData();
    formData.append('photo',  {
      uri:Platform.OS === "android" ? uri : uri.replace("file://", ""),
      name:'photo.jpg',
      type:'image/jpg'
    });
  
    let options = {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      },
    };
  
    return fetch(apiUrl, options);
  }

  analyze = async () => {
    try {
      let response = await this.sendImageAsync(this.props.uri)
      let results = await response.json()
      // console.log('\n boom \n', results)
      this.props.nav.navigation.navigate('Result',{uri:this.props.uri, data:results,ip:this.props.ip})
    }catch(error){
      Alert.alert('Connection error',`here is the error message: \n ${error} \n\n press OKAY to return to homepage`,[{text:'Okay',onPress:()=>this.props.nav.navigation.navigate('Home')}])
    }
    //ANALYZE HERE
  };


  render() {
    // console.log(this.props.uri)
    return (
      <View style={styles.container}>
        <View style={{zIndex:-1}}>
          <Image style={styles.image} source={{uri:this.props.uri}}/>
        </View>
        <View style={styles.navbar}>
          <TouchableHighlight style={styles.button} onPress={this.props.onPress}>
            <Text style={styles.whiteText}>Delete</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.analyze}>
            <Text style={styles.whiteText}>Analyze</Text>
          </TouchableHighlight>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  navbar: {
    position:'absolute',
    top:0,
    left:10,
    flexDirection: 'column',
    height:'100%',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  image: {
    width:'100%',
    height:'100%'
  },
  button: {
    transform: [{ rotate: '90deg'}],
    alignItems:'center',
    justifyContent:'center',
    height:60,
    width:120,
    borderColor:'rgba(255, 255, 255,0.8)',
    borderRadius:15,
    borderWidth:2,
    shadowColor:'rgba(0,0,0,0.5)',
    shadowOffset:{width:10,height:10},
    shadowRadius:5,
    backgroundColor:'rgba(255, 255, 255,0.6)'
  },
  whiteText: {
    color: 'black',
    fontSize:17,
  }
});
