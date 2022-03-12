import { StyleSheet } from 'react-native';
import * as Colors from 'presentation/styles/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 10,
    shadowColor: 'lightgrey',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  rightIconStyle: {
    tintColor: 'grey',
  },
  searchIcon: {
    width: 17,
    height: 17,
    alignSelf: 'center',
    margin: 20,
  },
  textInputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 3,
    flex: 1,
  },
  innerStyle: {
    marginTop: 10,
    minHeight: 20,
    padding: 0,
    color: 'black',
    flex: 1,
  },
  submit: {
    height: 45,
    width: 90,
    alignSelf: 'center',
    marginHorizontal: 8,
    backgroundColor: Colors.fromGreen,
  },
});
