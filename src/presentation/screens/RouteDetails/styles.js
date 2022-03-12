import { StyleSheet, Platform } from 'react-native';
import * as Colors from 'presentation/styles/colors';

export default StyleSheet.create({
  mapZoomOut: {
    marginBottom: 100,
  },
  smallDot: {
    marginTop: 5,
    height: 2,
    width: 2,
    borderRadius: 25,
    backgroundColor: Colors.titleGrey,
  },
  interactableContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderColor: Colors.lightGrey,
    borderWidth: 0.3,
  },
  interactableBottomPad: {
    backgroundColor: Colors.white,
  },
  touchableContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
  },
  middleContentWrap: {
    backgroundColor: Colors.white,
  },
  transportInfoContainer: {
    paddingTop: 40,
    backgroundColor: Colors.white,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    paddingLeft: 27,
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  handicappedContainer: {
    position: 'absolute',
    right: 20,
    top: 40,
  },
  flex1: {
    flex: 1,
  },
  transportIcon: {
    height: 30,
    width: 30,
    margin: 20,
  },
  transportArrowWrapper: {
    alignItems: 'center',
    height: 40,
    width: 40,
    margin: 15,
  },
  transportBortNumber: {
    position: 'absolute',
    top: 0,
    width: 70,
    textAlign: 'center',
  },
  paddingHorizontal20: {
    paddingHorizontal: 20,
  },
  flatList: {
    backgroundColor: Colors.white,
    position: 'relative',
    bottom: 0,
    width: '100%',
  },
  textTitle: {
    color: '#9FB1C2',
    fontSize: 10,
    lineHeight: 10,
    marginBottom: 3,
  },
  textTitleValue: {
    color: '#0D0D0D',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 16,
  },
  paddingLeft15: {
    paddingLeft: 15,
  },
  secondaryText: {
    fontSize: 10,
    maxWidth: 160,
  },
  stopsCountContainer: {
    backgroundColor: Colors.toBlue,
    height: 17,
    marginTop: 3,
    paddingTop: 2,
    marginLeft: 10,
    marginBottom: 5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopsCount: {
    marginHorizontal: 5,
    marginVertical: 1,
  },
  arrowIcon: {
    marginTop: 1,
    marginHorizontal: 10,
  },
  transportListInfoContainer: {
    width: 105,
    borderRightWidth: 1,
    borderColor: Colors.lightGrey,
    paddingLeft: 5,
  },
  transportListLine: {
    marginLeft: 9,
    marginVertical: 7,
    width: 2,
    flex: 1,
    minHeight: 30,
  },
  transportListStopName: {
    marginBottom: 15,
    marginTop: 3,
  },
  dotsContainer: {
    marginLeft: 8,
    marginTop: 5,
    marginBottom: 10,
  },
  busStopIcon: {
    height: 15,
    width: 15,
    marginTop: 3,
    marginLeft: 2,
  },
  stopsListIcon: {
    width: 10,
    height: 10,
    transform: [{ rotate: '90deg' }],
    marginTop: 5,
    marginLeft: 5,
  },
  stopsListHeader: {
    color: Colors.toBlue,
    marginBottom: 5,
  },
  stopsListText: {
    marginBottom: 5,
    width: 220,
  },
  transportInfoRow: {
    justifyContent: 'space-between',
    marginRight: 60,
    marginLeft: 5,
    marginTop: 9,
  },
  disabledContainer: {
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.activeVehicleTabBlue,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(98, 154, 255, 0.2)',
  },
  disabledIcon: {
    marginTop: 0,
    marginLeft: 4,
  },
  active: {
    backgroundColor: Colors.activeVehicleTabBlue,
  },
  directionIcon: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#3D4763',
  },
  endPointsIcon: {
    marginTop: Platform.OS === 'ios' ? -20 : 0,
  },
  confirmButton: {
    backgroundColor: Colors.toBlue,
    marginRight: 20,
    height: 31,
    marginTop: 10,
  },
});
