import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Text } from 'components';
import styles from './styles';


export default ({ style, imageStyle, source, text, onPress, focusedColor,  ...props }) => (
  <TouchableOpacity
    {...props}
    style={[
      styles.container,
      props.focused && {borderBottomColor: focusedColor},
      style,
    ]}
    onPress={onPress}
  >
    <Image
      source={source}
      style={[
        styles.image,
        props.focused && {tintColor: focusedColor},
        imageStyle,
      ]}
    />
    <Text
      inverted
      style={[
        styles.text,
        props.focused,
        props.textStyle,
      ]}
    >
      {text}
    </Text>
  </TouchableOpacity>
);
