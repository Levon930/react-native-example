import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

export default ({
  smallDotsCount, smallDotsStyle, fromDotStyle, toDotStyle, modalMode, lang, ...props
}) => (
  <View
    style={styles.dotsContainer}
    {...props}
  >
    <View style={[styles.bigDotFrom, fromDotStyle]}>
      <Text style={[styles.bigDotText, { color: modalMode ? '#061040' : '#ffffff' }]}>A</Text>
    </View>
    {
      [...Array(smallDotsCount)].map((i, index) => {
        return (
          <View
            key={index}
            style={[styles.smallDot, smallDotsStyle]}
          />
        );
      })
    }
    <View style={[styles.bigDotTo, toDotStyle]}>
      <Text style={[styles.bigDotText, { color: '#ABBFD6' }]}>{lang === 'en' ? 'B' : 'Б'}</Text>
    </View>
  </View>
);
