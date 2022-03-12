import AsyncStorage from '@react-native-community/async-storage';

export const ASYNC_STORE_KEYS = {
  keyFirstLaunch: 'KFL',
};

export default class Workers {

  //expected param format:
  // {key:"",value:""} value must be already stringified
  async storeKeyValuePair(keyStringifiedValuePair) {
    const p = keyStringifiedValuePair;
    try {
      if (p.key && p.value) {
        await AsyncStorage.setItem(p.key, p.value);
      }
    } catch (err) {

    }
  }

  //defaultValue can be any type because it's not being put to store
  async getValueWithKey(keyName, defaultValue) {
    let output = '';
    try {
      const result = await AsyncStorage.getItem(keyName);
      const target = (result !== null && result !== undefined && result !== '')
        ? result : defaultValue;
      if (typeof target === 'object') {
        try {
          output = JSON.parse(target);
        } catch (e) {

        }
      } else {
        output = target;
      }
    } catch (e) {

    }
    return output;
  }

}
