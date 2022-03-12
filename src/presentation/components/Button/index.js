import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '../';
import styles from './styles';

function _getContainerStyle(props) {
  let containerStyle;
  if (props.filled) {
    containerStyle = styles.containerFilled;
  } else {
    containerStyle = styles.containerDefault;
  }
  return containerStyle;
}

export default ({ style, onPress, title, disabled, child, ...props }) => (
  <TouchableOpacity
    {...props}
    onPress={onPress}
    disabled={disabled}
    style={[disabled ? styles.containerDisabled : _getContainerStyle(props), style]}
  >
    <View>
      <If condition={child !== undefined}>
        {child}
      </If>
      <If condition={!child && title}>
        <Text style={props.filled ? [styles.text, styles.textReverted] : styles.text}>{title}</Text>
      </If>
    </View>
  </TouchableOpacity>
);
