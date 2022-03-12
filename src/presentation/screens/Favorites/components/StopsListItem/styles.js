import { StyleSheet } from 'react-native';
import * as Colors from 'presentation/styles/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    minHeight: 90,
    padding: 10,
    paddingLeft: 15,
    flexDirection: 'column',
  },
  headingContainer: {
    paddingVertical: 3,
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 21,
    color: '#0D0D0D',
    alignSelf: 'center',
  },
  routeName: {
    fontSize: 12,
    lineHeight: 12,
    color: '#061040',
  },
  routeContainer: {
    width: '85%',
    paddingTop: 5,
  },
  routeItem: {
    borderRadius: 5,
    padding: 3,
    marginLeft: 10,
    marginBottom: 7,
  },
  iconContainer: {
    paddingRight: 5,
  },
  clickableIcon: {
    marginLeft: 15,
    borderRadius: 6,
  },
});
