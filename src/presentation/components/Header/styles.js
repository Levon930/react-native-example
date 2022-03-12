import { StyleSheet } from 'react-native';
import { primary } from 'presentation/styles/colors';

export default StyleSheet.create({
  backButton: {
    marginBottom: 15,
    marginTop: 0,
    marginLeft: -10,
    padding: 10,
  },
  title: {
    color: primary,
    fontWeight: '500',
  },
  container: {
    marginBottom: 25,
  },
  iconRow: {
    justifyContent: 'space-between',
  },
  rightIcon: {
    marginTop: 10,
  },
});
