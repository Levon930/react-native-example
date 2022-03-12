
import { URL, CITY_CODE } from 'configs';
import axios from 'axios';

export const searchStops = (query, lang) => {
  const url = URL + 'api/v1/' + CITY_CODE + '/search/stops';
  return axios.get(url, {
    params: {
      query,
      lang,
    },
  });
};

export const searchAddress = (lat, lon, lang) => {
  const url = URL + 'api/v1/' + CITY_CODE + '/search/address/' + lat + ',' + lon;
  return axios.get(url, {
    params: {
      lang,
    },
  });
};

