import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Text, Row } from 'components';
import styles from './styles';

export default ({ style, onPress, text, imageSource, imageStyle, withoutDivider }) => (
  <TouchableOpacity 
    style={[styles.containerHeight, style]}
    onPress={onPress}
  >
    <Row style={styles.containerRow}>
      <Image
        resizeMode="contain"
        source={imageSource}
        style={[styles.image, imageStyle]}
      />
      <Text>{text}</Text>
    </Row>
    <If condition={!withoutDivider}>
      <View style={styles.divider} />
    </If>
  </TouchableOpacity>
  
);
