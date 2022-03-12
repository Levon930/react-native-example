import React from 'react';
import { View } from 'react-native';
import { Text } from 'components';
import styles from '../../styles';

export const TitledText = ({ style, title, text }) => {
  return (
    <View style={style}>
      <Text h6 style={styles.textTitle}>
        {title}:
      </Text>
      <Text  style={styles.textTitleValue}>
        {text}
      </Text>
    </View>
  );
};
