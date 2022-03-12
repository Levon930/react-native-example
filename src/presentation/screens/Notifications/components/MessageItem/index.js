import React from 'react';
import { Image, View } from 'react-native';
import * as Assets from 'assets';
import ReadMore from 'react-native-read-more-text';
import moment from 'moment';
import { Text, Row, Divider } from 'components';
import styles from './styles';

export default ({ translations, isActive, date, message, style }) => {
  
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Row style={styles.footer}>
        <Text center h6 style={styles.footerText} onPress={handlePress}>
          {translations.general.showMore}
        </Text>
        <Image
          source={Assets.rightArrowIcon}
          style={[styles.icon, { transform: [{ rotate: '90deg' }] }]}
          resizeMode="contain"
        />
      </Row>
    );
  };
  
  _renderRevealedFooter = (handlePress) => {
    return (
      <Row style={styles.footer}>
        <Text center h6 style={styles.footerText} onPress={handlePress}>
          {translations.general.showLess}
        </Text>
        <Image
          source={Assets.rightArrowIcon}
          style={styles.icon}
          resizeMode="contain"
        />
      </Row>
    );
  };

  _handleTextReady = () => {};

  return (
    <View>
      <Divider />
      <Row
        style={[styles.container, isActive ? styles.activeContainer : {}, style]}
      >
        <If condition={isActive}>
          <View style={styles.circle} />
        </If>
        <View style={[!isActive ? styles.marginLeft10 : styles.marginRight10]}>
          <Text h6 secondary style={styles.date}>{moment(date).utc().format('MM.DD.YYYY')}</Text>
          <ReadMore
            numberOfLines={3}
            renderTruncatedFooter={_renderTruncatedFooter}
            renderRevealedFooter={_renderRevealedFooter}
            onReady={_handleTextReady}
          >
            <Text>{message}</Text>
          </ReadMore>
        </View>
      </Row>
    </View>
  );
};
