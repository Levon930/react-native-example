import React from 'react';
import { Image, Platform } from 'react-native';
import styles from './styles';
import {getRouteIcon} from '../../../utils';

export default ({ type, iconStyle, platformizedTint }) => {
  const imageStyle =
    Platform.OS === 'android' ?
      {} : { tintColor: platformizedTint };

  return (
    <Image
      source={getRouteIcon(type)}
      tintColor={platformizedTint}
      resizeMode={'contain'}
      style={[styles.size, imageStyle, iconStyle]}
    />
  );
};
