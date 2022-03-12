import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from 'components';

export const ClickableDirectionTab = ({ style, onPress, text, textStyle }) => {
  return (
    <TouchableOpacity 
      style={style}
      onPress={onPress}
    >
      <Text 
        style={textStyle}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};
