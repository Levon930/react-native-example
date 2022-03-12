import { StyleSheet } from 'react-native';
import { lightGrey } from 'presentation/styles/colors';

export default StyleSheet.create({
  containerHeight: {
    height: 50,
  },
  containerRow: {
    flex: 1, 
    alignItems: 'center', 
    paddingHorizontal: 25,
  },
  image: {
    marginRight: 15,
  },
  divider: {
    height: 1, 
    backgroundColor: lightGrey,
  },
});
