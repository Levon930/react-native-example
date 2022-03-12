import React from 'react';
import { View, StyleSheet } from 'react-native';

export default ({ style, ...props }) => (
  <View
    {...props}
    style={[
      styles.row,
      props.centered && styles.centered,
      style,
    ]}
  />
);

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
});
