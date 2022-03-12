import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

export default ({ style, onPress, imageSource, imageStyle }) => {
  return (
    <TouchableOpacity 
      style={style}
      onPress={onPress}
    >
      <Image
        source={imageSource} 
        style={imageStyle}
      />
    </TouchableOpacity>
  );
};
