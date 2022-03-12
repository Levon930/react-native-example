import React from 'react';
import { Text } from 'components';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default ({ title, isActive, onPress, position }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.container]}
  >
    <View
      style={[styles.button,
        isActive && styles.activeFiler, position === 'left' && {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          paddingLeft: 13,
        }, position === 'right' && {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          paddingRight: 13,
        }]}
    >
      <Text h6 style={[styles.text, isActive && { color: '#061040' }]}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  text: {
    color: '#B7C3CF',
    fontSize: 15,
    lineHeight: 15,
  },
  activeFiler: {
    backgroundColor: '#B7C3CF',
  },
  button: {
    alignItems: 'center',
    paddingVertical: 5,
    justifyContent: 'center',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#B7C3CF',
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
});
