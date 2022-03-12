import { StyleSheet } from 'react-native';
import * as Colors from 'presentation/styles/colors';

export default StyleSheet.create({
  innerContainer: {
    backgroundColor: Colors.white,
    padding: 10,
    paddingLeft: 15,
    flexDirection: 'column',
  },
  firstRow: {
    paddingTop: 3,
    paddingBottom: 3,
    justifyContent: 'space-between',
  },
  btnsContainer: {
    flexDirection: 'row',
    paddingRight: 5,
    alignItems: 'center',
  },
  clickableIcon: {
    marginLeft: 15,
    borderRadius: 6,
  },
  smallDot: {
    marginTop: 2.5,
    height: 3,
    width: 3,
    borderRadius: 9,
    backgroundColor: Colors.smallDots,
    alignSelf: 'center',
  },
  bigDotFrom: {
    height: 10,
    width: 10,
    borderWidth: 2,
    borderColor: Colors.fromGreen,
    borderRadius: 45,
    marginBottom: 3,
  },
  bigDotTo: {
    height: 10,
    width: 10,
    borderWidth: 2,
    borderColor: Colors.toBlue,
    borderRadius: 45,
    marginTop: 6,
  },
  placeText: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
  },
  placeTextWrap: {
    marginLeft: 16,
  },
  warningIcon: {
    height: 20,
    width: 20,
    marginLeft: 7,
  },
  marginTop15: {
    marginTop: 15,
  },
});
