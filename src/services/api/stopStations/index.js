
import { URL, CITY_CODE } from 'configs';
import axios from 'axios';

export const getStops = () => {
  const url = URL + 'api/v1/' + CITY_CODE + '/stopstations';
  return axios.get(url);
};

export const getStop = (id) => {
  const url = URL + 'api/v1/' + CITY_CODE + '/stopstations/' + id;
  return axios.get(url);
};

export const getRoutesByStopId = (id) => {
  const url = URL + 'api/v1/' + CITY_CODE + '/stopstations/' + id + '/routes';
  return axios.get(url);
};
