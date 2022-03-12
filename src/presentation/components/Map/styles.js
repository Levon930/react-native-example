import { StyleSheet } from 'react-native';
import * as Colors from 'presentation/styles/colors';

export default StyleSheet.create({
  map: {
    height: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 60,
    right: 15,
  },
  buttonContainer: {
    backgroundColor: Colors.white,
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderColor: Colors.mapButtonBorder,
    borderWidth: 0.2,
  },
  plusButton: {
    marginBottom: 10,
    marginTop: 25,
  },
  minusButton: {
    marginBottom: 20,
  },
});
