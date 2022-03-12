import { URL, CITY_CODE } from 'configs';
import axios from 'axios';

export const getTransportVersion = () => {
  const url = URL + 'api/v1/' + CITY_CODE + '/version';
  return axios.get(url);
};

