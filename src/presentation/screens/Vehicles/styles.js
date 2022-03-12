import { StyleSheet } from 'react-native';
import * as Colors from 'presentation/styles/colors';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.activeArea,
  },
  toast: {
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
  },
  tabsContainer: {
    backgroundColor: '#061040',
    height: 142,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 30,
  },
  listItem: {
    maxWidth: '23%',
    flex: 1,
    paddingHorizontal: 3,
    height: 40,
    marginHorizontal: 3,
    marginVertical: 2,
    backgroundColor: Colors.white,
  },
  listContainer: {
    marginHorizontal: 3,
  },
  emptyList: {
    flex: 1,
    margin: 20,
  },
});
