import React from 'react';
import { Dimensions, View } from 'react-native';
import { Text, Divider } from 'components';
import { getName } from 'utils';
import * as Assets from 'assets';
import ClickableListItem from './../ClickableListItem';
import styles from './styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default ({
  index, item, text, appLanguage, onStopPress,
  onShowAllPress, displayAllLikedStops,
}) => (
  <View>
    <Choose>
      <When condition={index === 0}>
        <ClickableListItem
          key={item.id}
          text={getName(item, appLanguage)}
          imageStyle={styles.favoriteStopsIcon}
          imageSource={Assets.darkHeartIcon}
          onPress={onStopPress}
          withoutDivider
        />
        <If condition={!displayAllLikedStops && SCREEN_HEIGHT < 736}>
          <Text
            h6
            style={[styles.viewAllText, styles.marginBottom10]}
            onPress={onShowAllPress}
          >
            {text}
          </Text>
          <Divider />
        </If>
      </When>
      <When condition={index === 1 && (SCREEN_HEIGHT >= 736 || displayAllLikedStops)}>
        <ClickableListItem
          key={item.id}
          text={getName(item, appLanguage)}
          imageStyle={styles.favoriteStopsIcon}
          imageSource={Assets.darkHeartIcon}
          onPress={onStopPress}
          withoutDivider
        />
        <If condition={!displayAllLikedStops && SCREEN_HEIGHT >= 736}>
          <Divider />
          <Text
            h6
            style={[styles.viewAllText, styles.marginBottom10]}
            onPress={onShowAllPress}
          >
            {text}
          </Text>
        </If>
      </When>
      <When condition={displayAllLikedStops}>
        <ClickableListItem
          key={item.id}
          text={getName(item, appLanguage)}
          imageStyle={styles.favoriteStopsIcon}
          imageSource={Assets.darkHeartIcon}
          onPress={onStopPress}
          withoutDivider
        />
      </When>
    </Choose>
  </View>
);

