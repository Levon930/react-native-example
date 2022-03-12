import React from 'react';
import { View, StyleSheet } from 'react-native';

export default ({ style, ...props }) => (
  <View
    {...props}
    pointerEvents={props.pointerEvents || 'box-none'}
    style={[
      styles.overlay,
      props.centered && styles.centered,
      style,
    ]}
  />
);

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
});
