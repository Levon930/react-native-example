import { StyleSheet } from 'react-native';
import * as Colors from '../../../presentation/styles/colors';

export default StyleSheet.create({
  container: {
    marginVertical: 15,
    marginHorizontal: 15,
    marginRight: 20,
    alignItems: 'center',
  },
  interactableContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderColor: Colors.lightGrey,
    borderWidth: 0.3,
    zIndex: 999,
  },
  interactableBottomPad: {
    backgroundColor: Colors.white,
  },
  touchableContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingBottom: 80,
  },
  arrowDown: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: '50%',
    marginLeft: -30,
    height: 30,
    width: 60,
    zIndex: 999,
  },
  contentHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 22,
    paddingRight: 28,
    paddingTop: 30,
    paddingBottom: 18,
    marginRight: 15,
  },
  stopName: {
    fontSize: 14,
  },
  flex1: {
    flex: 1,
  },
  footer: {
    marginBottom: 16,
  },
  bottomButtons: {
    height: 45,
    width: '49%',
    borderWidth: 1,
    borderColor: '#061040',
    borderRadius: 6,
    color: '#061040',
  },
  fromButton: {
    backgroundColor: 'transparent',
  },
  toButton: {
    backgroundColor: 'transparent',
  },
  emptyList: {
    flex: 1,
    margin: 20,
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    margin: 0,
    paddingBottom: 60,
    zIndex: 99,
  },
  modalContentContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  arrowIcon: {
    width: 16,
    tintColor: '#0D0D0D',
    marginRight: 10,
  },
  dataPaddings: {
    paddingLeft: 5,
  },
  dateContainer: {
    alignItems: 'flex-end',
    flex: 1,
    marginRight: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameMaxWidth: {
    maxWidth: 190,

  },
});
