import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  smallDot: {
    marginTop: 3,
    height: 3,
    width: 3,
    borderRadius: 25,
    backgroundColor: '#ABBFD6',
    alignSelf: 'center',
  },
  bigDotFrom: {
    height: 21,
    width: 21,
    textAlign: 'center',
    backgroundColor: '#ABBFD6',
    borderColor: '#ABBFD6',
    borderRadius: 45,
    marginBottom: 3,
  },
  bigDotText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '500',
    textAlign: 'center',
  },
  bigDotTo: {
    height: 21,
    width: 21,
    borderWidth: 1,
    borderColor: '#ABBFD6',
    borderRadius: 45,
    marginTop: 6,
  },
  dotsContainer: {
    justifyContent: 'center',
  },
});
