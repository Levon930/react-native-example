import { StyleSheet, Platform } from 'react-native';
import * as Colors from 'presentation/styles/colors';

export default StyleSheet.create({
  flex1: {
    flex: 1,
  },
  routeContainer: {
    height: 32,
    minWidth: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginLeft: 10,
  },
  routeContainerDark: {
    backgroundColor: Colors.dark,
  },
  routeContainerText: {
    color: Colors.dark,
    fontSize: 15,
    marginHorizontal: 7,
  },
  routeContainerTextDark: {
    color: Colors.white,
    fontWeight: '500',
  },
  floatingView: {
    backgroundColor: '#06104010',
    height: 52,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  eyeIcon: {
    marginLeft: 22,
    marginRight: 5,
  },
  floatingTextInputs: {
    marginTop: 70,
    borderRadius: 7,
    backgroundColor: Colors.white,
    height: Platform.OS === 'ios' ? 105 : 120,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    borderWidth: 1,
    borderColor: 'rgba(138, 147, 200, 0.2)',
    elevation: 5,
  },
  floatingTextInputsModal: {
    backgroundColor: '#061040',
    paddingHorizontal: 15,
    paddingTop: 45,
    paddingBottom: 16,
    height: 230,
  },
  dotsContainer: {
    justifyContent: 'center',
    height: '100%',
  },
  marginRight20: {
    marginRight: 20,
  },
  marginBottom10: {
    marginBottom: 10,
  },
  textInputContainer: {
    flex: 1,
    paddingTop: 12,
    marginLeft: 7,
  },
  textInput: {
    minHeight: 35,
    paddingTop: 0,
    paddingBottom: 8,
  },
  colorWhite: {
    color: Colors.white,
  },
  swapIcon: {
    justifyContent: 'center',
    marginLeft: 10,
    paddingBottom: 10,
  },
  streetsListContainer: {
    marginTop: 230,
    borderBottomWidth: 0.5,
    borderColor: Colors.lightGrey,
    paddingBottom: 20,
  },
  markerFixed: {
    left: '50%',
    position: 'absolute',
    top: '50%',
    marginTop: -8,
    marginLeft: -1,
  },
  confirmPinUserLocationButton: {
    position: 'absolute',
    bottom: 25,
    left: 15,
    right: 15,
    backgroundColor: '#061040',
  },
  disabledFilterContainer: {
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#ABBFD6',
  },
  activeFiler: {
    backgroundColor: '#007AFF',
  },
  errorText: {
    alignSelf: 'center',
    marginTop: 20,
  },
  tipsTriangle: {
    height: 0,
    width: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 15,
    borderBottomWidth: 15,
    borderLeftWidth: 15,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: 'rgba(228,37,72,0.85)',
  },
  tipsContainer: {
    backgroundColor: 'rgba(228,37,72,0.9)',
    height: '8%',
    width: '102%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 7,
  },
  loader: {
    height: 200,
  },
  modalHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
