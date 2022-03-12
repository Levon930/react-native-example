
import React from 'react';
import { AppRoutes } from 'enums';
import * as Screens from 'screens';
import * as Assets from 'assets';
import { Image, View } from 'react-native';
import { TabBar } from 'components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';

const BottomTabs = createBottomTabNavigator();

const Icon = (name, params) => (
  <View>
    <Image
      source={name}
      resizeMode="contain"
      tintColor={params.tintColor}
      style={[params.size, { tintColor: params.tintColor }]}
    />
    <If condition={params.showBadge}>
      <View style={params.badgeStyle} />
    </If>
  </View>
);

export const HomeNavigator = () => {
  return (
    <BottomTabs.Navigator
      tabBar={props => <TabBar {...props} />}
    >
      <BottomTabs.Screen
        name={AppRoutes.HOME}
        component={Screens.HomeScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: (params) => (Icon(Assets.mapIcon, params)),
        }}
      />
      <BottomTabs.Screen
        name={AppRoutes.VEHICLES}
        component={Screens.VehiclesScreen}
        options={{
          tabBarIcon: (params) => (Icon(Assets.vehicleIcon, params)),
        }}
      />
      <BottomTabs.Screen
        name={AppRoutes.TICKETS}
        component={Screens.TicketsScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: () => (<Image source={Assets.ticketIcon} resizeMode="contain" />),
        }}
      />
      <BottomTabs.Screen
        name={AppRoutes.FAVORITES}
        component={Screens.FavoritesScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: (params) => (Icon(Assets.heartIcon, params)),
        }}
      />
      <BottomTabs.Screen
        name={AppRoutes.SETTINGS}
        component={Screens.SettingsScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: (params) => (Icon(Assets.settingsIcon, params)),
        }}
      />
    </BottomTabs.Navigator>
  );
};

export function resetInitRouteAndNavigate(_route, _navigation, _extraparams) {
  _navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: _route }],
    })
  );
}
