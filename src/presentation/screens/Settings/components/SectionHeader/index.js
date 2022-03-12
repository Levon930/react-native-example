import React from 'react';
import { View } from 'react-native';
import { Text } from 'components';
import styles from './styles';

export default ({ title, style }) => (
  <View style={[styles.container, style]}>
    <Text bold style={styles.title}>{title}</Text>
  </View>
);
