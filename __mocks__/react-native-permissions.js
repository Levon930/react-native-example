const { PERMISSIONS, RESULTS } = require('react-native-permissions/lib/commonjs/constants.js');

export const openSettings = jest.fn(async () => {});
export const check = jest.fn(async permission => RESULTS.GRANTED);
export const request = jest.fn(async permission => RESULTS.GRANTED);

const notificationOptions = [
  'alert',
  'badge',
  'sound',
  'criticalAlert',
  'carPlay',
];

const notificationSettings = {
  alert: true,
  badge: true,
  sound: true,
  carPlay: true,
  criticalAlert: true,
  lockScreen: true,
  notificationCenter: true,
};

export const checkNotifications = jest.fn(async () => ({
  status: RESULTS.GRANTED,
  settings: notificationSettings,
}));

export const requestNotifications = jest.fn(async options => ({
  status: RESULTS.GRANTED,
  settings: options
    .filter(option => notificationOptions.includes(option))
    .reduce((acc, option) => ({ ...acc, [option]: true }), {
      lockScreen: true,
      notificationCenter: true,
    }),
}));

export default {
  PERMISSIONS,
  RESULTS,
  openSettings,
  check,
  request,
  checkNotifications,
  requestNotifications,
};
