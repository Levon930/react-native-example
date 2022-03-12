import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoutes } from 'enums';
import * as Screens from '../../screens';
import { HomeNavigator } from './../HomeNavigator';

const Stack = createStackNavigator();

export default AppNavigator = (props) => (
  <Stack.Navigator {...props} headerMode='none'>
    <Stack.Screen name={AppRoutes.INIT} component={Screens.InitScreen} />
    <Stack.Screen name={AppRoutes.FAVORITES} component={Screens.FavoritesScreen} />
    <Stack.Screen name={AppRoutes.VEHICLES} component={Screens.VehiclesScreen} />
    <Stack.Screen name={AppRoutes.HOME} component={HomeNavigator} />
    <Stack.Screen name={AppRoutes.ONBOARDING} component={Screens.OnboardingScreen} />
    <Stack.Screen name={AppRoutes.SETTINGS} component={Screens.SettingsScreen} />
    <Stack.Screen name={AppRoutes.CONTACT_SUPPORT} component={Screens.ContactSupportScreen} />
    <Stack.Screen name={AppRoutes.TICKETS} component={Screens.TicketsScreen} />
    <Stack.Screen name={AppRoutes.USER_AGREEMENT} component={Screens.UserAgreementScreen} />
    <Stack.Screen name={AppRoutes.ABOUT_APP} component={Screens.AboutAppScreen} />
    <Stack.Screen
      name={AppRoutes.CONTACT_SUPPORT_SUCCESS}
      component={Screens.ContactSupportSuccessScreen}
    />
    <Stack.Screen name={AppRoutes.LANGUAGES} component={Screens.LanguagesScreen} />
    <Stack.Screen name={AppRoutes.NOTIFICATIONS} component={Screens.NotificationsScreen} />
    <Stack.Screen name={AppRoutes.CHOSEN_ROUTE} component={Screens.ChosenRouteScreen} />
    <Stack.Screen name={AppRoutes.ROUTES_DETAILS} component={Screens.RouteDetailsScreen} />
    <Stack.Screen name={AppRoutes.TIME_FORMATS} component={Screens.TimeFormatsScreen} />
  </Stack.Navigator>
);
