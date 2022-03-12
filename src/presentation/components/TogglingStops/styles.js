import { StyleSheet } from 'react-native';
import * as Colors from 'presentation/styles/colors';

export const styles = (params) => {
  return StyleSheet.create({
    stopCircle: {
      backgroundColor: Colors.white,
      borderColor: params.borderColor,
      padding: params.stopSize,
      borderRadius: 40,
      borderWidth: 2,
    },
  });
};
