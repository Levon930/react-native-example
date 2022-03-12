
import { URL, CITY_CODE } from 'configs';
import axios from 'axios';

export const getMessages = (deviceId) => {
  const url = URL + 'api/v1/' + CITY_CODE + '/messages/general/' + deviceId;
  return axios.get(url);
};

export const getMessagesCounter = (deviceId) => {
  const url = URL + 'api/v1/' + CITY_CODE + '/messages/general/count/' + deviceId;
  return axios.get(url);
};

