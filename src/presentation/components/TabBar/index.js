import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import * as Colors from '../../../presentation/styles/colors';
import { SafeAreaLayout } from '../';
import { SaveAreaInset, AppRoutes } from '../../../enums';
import { PushNotificationsStore } from '../../../stores';
import styles from './styles';

export default ({ state, descriptors, navigation }) => {
  return (
    <SafeAreaLayout insets={SaveAreaInset.BOTTOM}>
      <View style={styles.mainContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const TabIcon = options.tabBarIcon;
          const isDisabledScreen = route.name === AppRoutes.TICKETS;
          const showBadge = route.name === AppRoutes.SETTINGS
            && PushNotificationsStore.messagesCounter > 0;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key });

            if (isDisabledScreen) return;

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <View key={index} style={styles.tabContainer}>
              <TouchableWithoutFeedback
                accessibilityRole="button"
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
              >
                <View style={styles.tab}>
                  <Choose>
                    <When condition={isDisabledScreen}>
                      <TabIcon
                        size={styles.centerIconSize}
                        marginVertical={2}
                        tintColor={Colors.accented}
                      />
                    </When>
                    <Otherwise>
                      <TabIcon
                        size={styles.iconSize}
                        marginVertical={2}
                        tintColor={isFocused ? Colors.primary : Colors.inactiveTab}
                        showBadge={showBadge}
                        badgeStyle={styles.badgeStyle}
                      />
                    </Otherwise>
                  </Choose>
                </View>
              </TouchableWithoutFeedback>
            </View>
          );
        })}
      </View>
    </SafeAreaLayout>
  );
};
