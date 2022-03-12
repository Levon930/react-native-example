import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  interactable: {
    zIndex: 100,
    position: 'absolute',
    width: '100%',
  },
  searchTopPanel: {
    backgroundColor: 'transparent',
    position: 'absolute',
    width: '100%',
  },
  shadow: {
    position: 'absolute',
    width: '100%',
    bottom: -10,
    zIndex: -5,
    height: 15,
  },
  innerWrap: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  roundedBottom: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  flatBorder: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});
