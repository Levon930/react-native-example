import React from 'react';
import { View } from 'react-native';
import { Text } from '../';
import styles from './styles';

export default ({ title, isSmallHeaderVisible, style }) => (
  <View style={[styles.container, style]}>
    <Text
      center
      bold
      style={{ opacity: isSmallHeaderVisible ? 1 : 0 }}
    >
      {title}
    </Text>
  </View>
);
