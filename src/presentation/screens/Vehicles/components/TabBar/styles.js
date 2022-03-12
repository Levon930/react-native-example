import { StyleSheet } from 'react-native';
import { activeVehicleTabBlue } from 'presentation/styles/colors';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 16,
    height: 112,
    flex: 1,
    borderBottomWidth: 4,
    borderBottomColor: '#061040'
  },
  image: {
    tintColor: '#ABBFD6',
    height: 37,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: '#ABBFD6',
  },
});
