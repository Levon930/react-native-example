
import { URL, CITY_CODE } from 'configs';
import axios from 'axios';

export const addDevice = (token = '3', type, language = 'en') => {
  const url = URL + 'api/v1/' + CITY_CODE + '/devices';
  
  return axios.post(url, {
    token,
    type,
    language,
  });
};
