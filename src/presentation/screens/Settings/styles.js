import { StyleSheet } from 'react-native';
import { activeArea } from 'presentation/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: activeArea,
  },
  mainPaddings: {
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 40,
  },
});
