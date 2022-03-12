import { StyleSheet } from 'react-native';
import { accented, white, toBlue } from 'presentation/styles/colors';

export default StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    borderTopColor: '#F0F2F7',
    borderTopWidth: 1,
    backgroundColor: white,
  },
  tabContainer: {
    flex: 1,
    marginVertical: 5,
    justifyContent: 'center',
    zIndex: 9999,
  },
  iconSize: {
    width: 24,
    height: 24,
  },
  centerIconSize: {
    width: 48,
    height: 48,
  },
  centerIcon: {
    tintColor: accented,
  },
  label: {
    marginTop: 5,
    fontSize: 10,
  },
  tab: {
    alignItems: 'center',
  },
  badgeStyle: {
    height: 14,
    width: 14,
    backgroundColor: toBlue,
    marginLeft: 17,
    marginTop: -4,
    position: 'absolute',
    borderWidth: 1,
    borderColor: white,
    borderRadius: 7,
  },
});
