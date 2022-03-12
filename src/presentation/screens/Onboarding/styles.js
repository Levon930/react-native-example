import { StyleSheet } from 'react-native';
import { fromGreen, toBlue } from 'presentation/styles/colors';

export default StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 120,
    paddingTop: 40,
  },
  text: {
    maxWidth: '80%',
    fontSize: 18,
    lineHeight: 20,
    marginTop: 50,
    color: '#0D0D0D',
    fontWeight: '400',
  },
  startButton: {
    marginBottom: 21,
    marginHorizontal: 20,
    backgroundColor: '#0F0F4D',
  },
  skipButtonText: {
    color: '#0F0F4D',
    fontWeight: '500',
  },
  skipButton: {
    marginBottom: 40,
    marginTop: 10,
  },
});
