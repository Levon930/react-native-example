import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { secondary, accented, white } from '../../../presentation/styles/colors';

export default ({ style, ...props }) => (
  <Text
    {...props}
    style={[
      styles.basicSize,
      props.center && styles.center,
      props.secondary && styles.secondary,
      props.bold && styles.bold,
      props.accented && { color: accented },
      props.h6 && styles.h6,
      props.h3 && styles.h3,
      props.inverted && { color: white },
      style,
    ]}
  />
);


const styles = StyleSheet.create({
  basicSize: {
    fontSize: 15,
  },
  h3: {
    fontSize: 19,
  },
  h6: {
    fontSize: 12,
  },
  center: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  secondary: {
    color: secondary,
  },
});
