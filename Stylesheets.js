import { StyleSheet, Dimensions } from 'react-native';
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  horizontalControl: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    bottom: 0,
  },
  toplevelContainerView: {
    display: 'flex',
    height: screenHeight,
  },
  card: {
    backgroundColor: '#ddbbff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    margin: 24,
    borderRadius: 8,
    width: screenWidth - 48,
    height: screenHeight - 200,
  },
  picker: {
    backgroundColor: '#ddbbff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccaaee',
    width: screenWidth - 48,
    height: 48,
    marginTop: 12,
  },
  pickerItem: {
    height: 48,
  },
  textinput: {
    height: 48,
    width: screenWidth - 48,
    textAlign: 'center',
    fontSize: 18,
  }
});

export default styles;
