import { StyleSheet } from 'react-native';
import { accented } from 'presentation/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  activeContainer: {
    backgroundColor: 'rgba(98,154,255, 0.1)',
  },
  date: {
    paddingVertical: 5,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: accented,
    marginTop: 28,
    marginRight: 5,
  },
  footer: {
    justifyContent: 'center',
  },
  footerText: {
    color: accented,
    marginTop: 7,
  },
  icon: {
    width: 10,
    height: 10,
    transform: [{ rotate: '-90deg' }],
    marginTop: 8,
    marginLeft: 5,
  },
  marginLeft10: {
    marginLeft: 10,
  },
  marginRight10: {
    marginRight: 10,
  },
});
