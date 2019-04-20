import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Text,StatusBar,Platform,Alert,TouchableHighlight,ImageBackground,Dimensions,Button, PanResponder } from 'react-native';
import { FileSystem, MediaLibrary, Permissions,ImageManipulator} from 'expo';
// import { ImageManipulator } from 'expo-image-crop'
const PHOTOS_DIR = FileSystem.documentDirectory+ 'photos';

const { width, height } = Dimensions.get('window')
const startY = (height-height/(1.2))/2
const startX = (width-height/(1.2*90/14))/2
const startW = height/(1.2*90/14)
const startH = height/1.2

export default class GalleryScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  static defaultProps = {
    scalable: true,
    minScale: 0.5,
    maxScale: 1.5
  };
  
  constructor(props){
    super(props)
    this.state = {
      isVisible:false,
      uri:this.props.uri,
      readyforprocess:false,
      scale:1,
      lastScale:1,
      offsetX:0,
      offsetY: 0,
      lastX: 0,
      lastY: 0,
      lastMovePinch: false,
    };
    this.distant = 150;

    this.gestureHandlers = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: evt => true,
      onShouldBlockNativeResponder: evt => false
    })
  }

  componentDidMount = async () => {
    StatusBar.setHidden(true);
    FileSystem.makeDirectoryAsync(PHOTOS_DIR).catch(e => {
      console.log(e, 'Directory exists');
    });
  };

  _handleStartShouldSetPanResponder = (e, gestureState) => {
    // don't respond to single touch to avoid shielding click on child components
    return false;
  };

  _handleMoveShouldSetPanResponder = (e, gestureState) => {
    return (
      this.props.scalable &&
      (Math.abs(gestureState.dx) > 2 ||
        Math.abs(gestureState.dy) > 2 ||
        gestureState.numberActiveTouches === 2)
    );
  };

  _handlePanResponderGrant = (e, gestureState) => {
    if (gestureState.numberActiveTouches === 2) {
      let dx = Math.abs(
        e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX
      );
      let dy = Math.abs(
        e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY
      );
      let distant = Math.sqrt(dx * dx + dy * dy);
      this.distant = distant;
    }
  };

  _handlePanResponderEnd = (e, gestureState) => {
    this.setState({
      lastX: this.state.offsetX,
      lastY: this.state.offsetY,
      lastScale: this.state.scale
    });
  };

  _handlePanResponderMove = (e, gestureState) => {
    // zoom
    if (gestureState.numberActiveTouches === 2) {
      let dx = Math.abs(
        e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX
      );
      let dy = Math.abs(
        e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY
      );
      let distant = Math.sqrt(dx * dx + dy * dy);
      let scale = (distant / this.distant) * this.state.lastScale;
      //check scale min to max hello
      if (scale < this.props.maxScale && scale > this.props.minScale) {
        this.setState({ scale, lastMovePinch: true });
      }
    }
    // translate
    else if (gestureState.numberActiveTouches === 1) {
      if (this.state.lastMovePinch) {
        gestureState.dx = 0;
        gestureState.dy = 0;
      }
      let offsetX = this.state.lastX + gestureState.dx / this.state.scale;
      let offsetY = this.state.lastY + gestureState.dy / this.state.scale;
      // if ( offsetX < 0  || offsetY <  0 )
      this.setState({ offsetX, offsetY, lastMovePinch: false });
    }
  };

  sendImageAsync = async (uri,method=':5000/poc') => {
    // console.log('URI:', uri)
    const ip = this.props.ip
    let apiUrl = 'http://'+ ip + method;
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
      let response = await this.sendImageAsync(this.state.uri)
      let results = await response.json()
      // console.log('\n boom \n', results)
      this.props.nav.navigation.navigate('Result',{uri:this.state.uri, data:results,ip:this.props.ip})
    }catch(error){
      Alert.alert('Connection error',`here is the error message: \n ${error} \n\n press OKAY to return to homepage`,[{text:'Okay',onPress:()=>this.props.nav.navigation.navigate('Home')}])
    }
    //ANALYZE HERE
  }

  onCropImage = async () => {
    const { uri } = this.state

    Image.getSize(
      uri,
      (W,H)=>{
        // console.log(W,H)
        imgW=W
        imgH=H
        const ratioW = imgW/width
        const ratioH = imgH/height
        // console.log('ratios:', ratioW,ratioH)
        // console.log('states:', this.state.scale,this.state.offsetY)
        let originX = ((startX + this.state.offsetX)-startW*(this.state.scale-1)/2)*ratioW
        let originY= ((startY + this.state.offsetY)-startH*(this.state.scale-1)/2)*ratioH
        let cropWidth = startW * this.state.scale*ratioW
        let cropHeight = startH * this.state.scale*ratioH
        
        const cropObj = {
            originX,
            originY,
            width: cropWidth,
            height: cropHeight,
        }

        // console.log('\n Cropping', cropObj)

        if (cropObj.originX> 0 && cropObj.originX + cropWidth< imgW && cropObj.originY > 0 && cropObj.originY + cropHeight< imgH) {
          ImageManipulator.manipulateAsync(
            this.state.uri,
            [{
              crop: cropObj,
            }],
            { format: 'jpg' },
          ).then((manipResult) => {
            // console.log(manipResult)
            this.setState({ uri: manipResult.uri, readyforprocess:true })
          }).catch(error => console.log(error))
        }else{
          // console.log(cropObj)
          Alert.alert('Attention','Crop window is ourside of the window, please verify before cropping')
        }
      },
      (error)=>{console.log(error)})
  }

  render() {
    const { uri, isVisible } = this.state
    return (
      <ImageBackground
        resizeMode="contain"
        style={{ height, width, backgroundColor: 'black'}}
        source={{ uri }}
      >
        {!this.state.readyforprocess ? 
          <View style={styles.bottom}>
            <View
              {...this.gestureHandlers.panHandlers}
              style={[
                {
                  borderStyle: 'dashed',
                  borderRadius: 2,
                  //borderWidth goes inward
                  borderWidth: 1,
                  borderColor: 'pink',
                  flex: 1,
                  minHeight: 200,
                  minWidth:10,
                  width:startW,
                  //border width *2
                  height:startH,
                  position: 'absolute',
                  top:startY,
                  left:startX,
                  maxHeight: height,
                  maxWidth: width,
                  backgroundColor: 'rgba(255,255,255,0.5)',
                },
                {
                  transform: [
                    { scaleX: this.state.scale },
                    { scaleY: this.state.scale },
                    { translateX: this.state.offsetX },
                    { translateY: this.state.offsetY }
                  ]
                }
              ]}
            />
            <View style={styles.navbar}>
              <TouchableHighlight style={styles.button} onPress={this.onCropImage}>
                <Text style={styles.whiteText}>Crop</Text>
              </TouchableHighlight>
            </View>
          </View>
          

          :
          <View style={styles.bottom}>
            <View style={styles.navbar}>
              <TouchableHighlight style={styles.button} onPress={this.props.onPress}>
                <Text style={styles.whiteText}>Delete</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.button} onPress={this.analyze}>
                <Text style={styles.whiteText}>Analyze</Text>
              </TouchableHighlight>
            </View>
          </View>
        }
          
        {/* <ImageManipulator
            photo={{ uri }}
            isVisible={isVisible}
            onPictureChoosed={uriM => this.setState({ uri: uriM, readyforprocess:true })}
            onToggleModal={this.onToggleModal}
        /> */}
      </ImageBackground>
    )
  }

  // render() {
  //   const { uri, isVisible } = this.state
  //   const { width, height } = Dimensions.get('window')
  //   // console.log(this.props.uri)
  //   return (
  //     <View style={styles.container}>
  //       <View style={{zIndex:-1}}>
  //         <Image style={styles.image} source={{uri:this.props.uri}}/>
  //       </View>
  //       <View style={styles.navbar}>
  //         <TouchableHighlight style={styles.button} onPress={this.props.onPress}>
  //           <Text style={styles.whiteText}>Delete</Text>
  //         </TouchableHighlight>
  //         <TouchableHighlight style={styles.button} onPress={this.analyze}>
  //           <Text style={styles.whiteText}>Analyze</Text>
  //         </TouchableHighlight>
  //       </View>

  //     </View>
  //   );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bottom:{
    flex:1,
    justifyContent:'flex-end',
  },
  navbar: {
    flexDirection: 'row',
    height:'15%',
    width:'100%',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  image: {
    width:'100%',
    height:'100%'
  },
  button: {
    // transform: [{ rotate: '90deg'}],
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
