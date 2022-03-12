import { StyleSheet } from 'react-native';
import * as Colors from 'presentation/styles/colors';

export default StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#061040',
    fontWeight: '500',
  },
  textReverted: {
    color: Colors.white,
  },
  containerDefault: {
    height: 45,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  containerFilled: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: Colors.dark,
  },
  containerDisabled: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: Colors.disabledGrey,
  },
});
