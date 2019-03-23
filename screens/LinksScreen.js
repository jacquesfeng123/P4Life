import React from 'react';
import { ScrollView, StyleSheet,ListView} from 'react-native';
import { SQLite,FileSystem } from 'expo';
import Results from '../assets/results';

const PHOTOS_DIR = FileSystem.documentDirectory+ 'photos';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount = async () => {
    const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    console.log('list of photos: ', photos)

    // const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('urineTest.db'))
    // databaseLayer.executeSql('SELECT * from Results').then(response => {
    //   console.log('results:', response)
    // })

    const lol = await Results.query()
    console.log(lol)
  };


  render() {
    return (
      <ScrollView style={styles.container}>
        {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
