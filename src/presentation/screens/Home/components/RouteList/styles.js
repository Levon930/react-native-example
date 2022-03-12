import { StyleSheet } from 'react-native';
import { white, toBlue, greyBackground } from 'presentation/styles/colors';

export default StyleSheet.create({
  mainContainer: {
    marginTop: 5,
    backgroundColor: white,
    height: 90,
    borderRadius: 5,
  },
  transportInfoContainer: {
    flex: 1,
    marginLeft: 20,
    marginTop: 15,
  },
  titleText: {
    paddingLeft: 5,
    fontSize: 18,
  },
  secondaryText: {
    fontSize: 10,
    maxWidth: 160,
  },
  distanceInfoContainer: {
    marginRight: 50,
  },
  stopsCountContainer: {
    backgroundColor: toBlue,
    height: 17,
    marginTop: 3,
    paddingBottom: 2,
    paddingTop: 2,
    marginLeft: 10,
    marginBottom: 10,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopsCount: {
    marginHorizontal: 5,
    marginVertical: 1,
  },
  cornerTriangle: {
    height: 0,
    width: 0,
    transform: [{ rotate: '45deg' }],
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 20,
    borderBottomWidth: 20,
    borderLeftWidth: 20,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    alignSelf: 'flex-end',
    marginRight: -13,
    marginTop: -3,
  },
  timeEstimationText: {
    marginBottom: 5,
    marginTop: 18,
    textAlign: 'center',
    marginRight: 8,
  },
  touchableContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: greyBackground,
    marginTop: 230,
  },
  disabledIcon: {
    marginTop: 4,
    marginLeft: 4,
  },
  arrowIcon: {
    marginTop: 10,
    marginHorizontal: 8,
  },
  estimatedTime: {
    marginRight: 15,
  },
});
