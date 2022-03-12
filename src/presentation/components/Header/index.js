import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text, Row } from '../';
import { backButtonIcon } from '../../assets';
import styles from './styles';

export default ({
  title, withBackButton, titleSize, showStickyHeader,
  onBackPress, style, rightIcon, onRightIconPress, rightIconDisabled,
}) => (
  <View style={[styles.container, style]}>
    <Row style={styles.iconRow}>
      <If condition={withBackButton}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Image source={backButtonIcon} />
        </TouchableOpacity>
      </If>
      <If condition={rightIcon}>
        <TouchableOpacity
          onPress={onRightIconPress}
          disabled={rightIconDisabled}
          style={styles.rightIcon}
        >
          <Image source={rightIcon} />
        </TouchableOpacity>
      </If>
    </Row>

    <If condition={!withBackButton}>
      <View style={{ marginTop: showStickyHeader ? 16 : 48 }} />
    </If>
    <Text
      style={[
        styles.title,
        { fontSize: titleSize || 24 },
      ]}
    >
      {title}
    </Text>
  </View>);
