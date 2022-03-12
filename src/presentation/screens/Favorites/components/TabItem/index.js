import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from 'components';
import { activeVehicleTabBlue } from 'presentation/styles/colors';
import styles from './styles';


export default ({ style, imageStyle, source, text, onPress, ...props }) => (
  <TouchableOpacity
    {...props}
    style={[
      styles.container,
      props.focused && { borderBottomColor: '#ABBFD6' },
      style,
    ]}
    onPress={onPress}
  >
    <Text
      inverted
      style={[
        styles.text,
        props.focused && { color: '#ffffff' },
        props.textStyle,
      ]}
    >
      {text}
    </Text>
  </TouchableOpacity>
);
