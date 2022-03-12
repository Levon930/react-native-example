import { observable, action } from 'mobx';
import { Platform } from 'react-native';
import firebase from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { DeviceType } from 'enums';
import { LocalizationContext } from 'services';
import { addDevice, getMessagesCounter } from 'api';

export default class PushNotificationsStore {

  @observable
  deviceToken = '';

  @observable
  messagesCounter;

  @observable
  isFirstLaunch;


  _deviceType = Platform.select({ ios: DeviceType.IOS, android: DeviceType.ANDROID })

  static contextType = LocalizationContext;

  @action
  registerDevice(appLanguage) {
    addDevice(this.deviceToken, this._deviceType, appLanguage)
      .catch(console.warn);
  }

  @action
  getMessagesCounter() {
    getMessagesCounter(this.deviceToken)
      .then((response) => {
        this.messagesCounter = response.data.messageCount;
      });
  }

  @action
  setMessagesCounter = messagesCounter => {
    this.messagesCounter = messagesCounter;
  }

  sendLocalNotification = (remoteMessage = { title: 'test', message: 'test' }) => {
    const details = {
      /* Android Only Properties */
      // id: 0, // (optional)
      largeIcon: 'ic_launcher', // (optional)
      smallIcon: 'ic_notification', // (optional)
      color: '#293043',

      ignoreInForeground: false,

      /* iOS and Android properties */
      message: remoteMessage.data.message, // (required)
      playSound: false, // (optional) default: true
    };

    PushNotification.localNotification(details);
  }

  @action
  async registerDeviceToken(isFirstLaunch, appLanguage) {

    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === 1 || authStatus === 2;

    if (enabled) {
      firebase.messaging().getToken();
      firebase.messaging().getToken()
        .then((token) => {
          this.deviceToken = token;

          firebase.messaging().onMessage(async remoteMessage => {
            this.sendLocalNotification(remoteMessage);
          });
          
          if (isFirstLaunch) {
            this.isFirstLaunch = true;
            this.registerDevice(appLanguage);
          }
          this.getMessagesCounter();
        }).catch((error) => console.log(error));
    }

  }
}

