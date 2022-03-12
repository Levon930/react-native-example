import { StyleSheet } from 'react-native';
import { disabledGrey } from 'presentation/styles/colors';

export default StyleSheet.create({
  line: {
    height: 0.5,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    paddingRight: 24,
  },
  topInputText: {
    fontSize: 12,
  },
  rightIcon: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: -5
  },
  rightIconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
