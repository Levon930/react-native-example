import { StyleSheet } from 'react-native';
import * as Colors from 'presentation/styles/colors';

export default StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 0,
    height: 50,
    marginVertical: 4,
  },
  textInput: {
    fontSize: 15,
    paddingTop: 15,
    fontFamily: 'Avenir-Medium',
    color: Colors.inputTextGrey,
  },
  titleStyles: {
    position: 'absolute',
    fontFamily: 'Avenir-Medium',
    left: 3,
    color: Colors.titleGrey,
  },
});
