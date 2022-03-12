import { StyleSheet } from 'react-native';
import { white, toBlue } from 'presentation/styles/colors';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: white,
  },
  icon: {
    width: 15,
    height: 15,
    marginBottom: 10,
  },
  counterContainer: {
    height: 18,
    minWidth: 18,
    backgroundColor: '#061040',
    marginLeft: 11,
    borderRadius: 11,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterDimension: {
    height: 25,
    width: 25,
  },
});
