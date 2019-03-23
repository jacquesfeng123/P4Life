import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Text,StatusBar } from 'react-native';
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

  analyze = async () => {
    this.props.nav.navigation.navigate('Result',{uri:this.props.uri})

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
          <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
            <Text style={styles.whiteText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.analyze}>
            <Text style={styles.whiteText}>Analyze</Text>
          </TouchableOpacity>
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
