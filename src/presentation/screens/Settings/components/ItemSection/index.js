import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import * as Assets from 'assets';
import { Text } from 'components';
import styles from './styles';

export default ({ onPress, title, style, messagesCounter }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.container, style]}
  >
    <Text>{title}</Text>
    <If condition={messagesCounter}>
      <View style={styles.counterContainer}>
        <Text style={{ fontSize: 12, fontWeight: '500' }} inverted>
          {messagesCounter < 100 ? messagesCounter : '99+'}
        </Text>
      </View>
    </If>
    <View style={{ flex: 1 }} />
    <Image
      resizeMode="contain"
      style={styles.icon}
      source={Assets.rightArrowIcon}
    />
  </TouchableOpacity>
);

