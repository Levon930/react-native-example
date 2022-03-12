import React from 'react';
import { View, Image } from 'react-native';
import * as Assets from '../../assets';
import { Row, TextInput, Button } from '../';
import styles from './styles';

export default ({
  value, onPress, onChangeText, submitText, onSubmit, onFocus,
  onRightIconPress,
}) => (
  <Row style={styles.container}>
    <Image
      source={Assets.searchIcon}
      resizeMode='contain'
      style={styles.searchIcon}
      tintColor='grey'
    />
    <View style={styles.textInputContainer}>
      <TextInput
        textContentType='creditCardNumber'
        hideTitle
        innerStyle={styles.innerStyle}
        onPress={onPress}
        rightIcon={Assets.deleteIcon}
        onRightIconPress={onRightIconPress}
        value={value}
        onChangeText={onChangeText}
        rightIconStyle={styles.rightIconStyle}
        onFocus={onFocus}
      />
    </View>
    <Button
      filled
      title={submitText}
      onPress={onSubmit}
      style={styles.submit}
    />
  </Row>
);
