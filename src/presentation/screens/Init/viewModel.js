import { observable, action } from 'mobx';
import Workers, { ASYNC_STORE_KEYS } from 'Workers';
import { PushNotificationsStore } from 'stores';

export default class {

  @observable
  isFirstLaunch = true;

  @action
  setLaunchStatus = async (callback, appLanguage) => {
    this.worker = new Workers();
    const defaultValue = true;
    const answer = await this.worker
      .getValueWithKey(ASYNC_STORE_KEYS.keyFirstLaunch, defaultValue.toString());

    //#1 change local launch state
    this.isFirstLaunch = answer;
    await PushNotificationsStore.registerDeviceToken(this.isFirstLaunch === (true).toString(), appLanguage);
    callback();
    //#2 change AsyncStorage state
    if (answer === defaultValue.toString()) {
      const keyValue = {
        key: ASYNC_STORE_KEYS.keyFirstLaunch,
        value: (!defaultValue).toString(),
      };
      await this.worker.storeKeyValuePair(keyValue);
    }
  }
}
