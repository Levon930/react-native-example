import { URL, CITY_CODE } from 'configs';
import axios from 'axios';

export const getRoutes = () => {
  const url = URL + 'api/v1/' + CITY_CODE + '/routes';
  return axios.get(url);
};

export const getRoutesByType = (type, size = 15, pageNumber) => {
  const url = URL + 'api/v1/' + CITY_CODE + '/routes/type/' + type;
  const config = {
    pageSize: size,
    page: pageNumber,
  };

  return axios.get(url, { params: config });
};

export const getRouteById = (id) => {
  const url = URL + 'api/v1/' + CITY_CODE + '/routes/' + id;
  return axios.get(url);
};

export const getRoutesDetails = (ids) => {
  const strIds = ids.map((x, i) => ((i !== 0 ? '&ids=' : '?ids=') + x)).join('');
  const url = `${URL}api/v1/${CITY_CODE}/routes/details${strIds}`;
  return axios.get(url);
};

export const searchRoutes = (lat1, lon1, lat2, lon2, includeSuburban) => {
  const url = URL + 'api/v1/' + CITY_CODE + '/routes/search?includeSuburban=' + includeSuburban;

  return axios.get(url, {
    params: {
      lat1,
      lon1,
      lat2,
      lon2,
    },
  });
};

export const getRoutesCompact = () => {
  const url = URL + 'api/v1/' + CITY_CODE + '/routes/compact';
  const config = {
    pageSize: 0,
    page: 1,
  };
  return axios.get(url, { params: config });
};

export const getRoutesByIds = (ids) => {
  const parsedIds = ids.reduce((accumulator, currentValue, currentIndex) => {
    return accumulator + '&ids=' + currentValue;
  }, 'ids=');

  const url = URL + 'api/v1/' + CITY_CODE + '/routes/many?' + parsedIds;
  const config = {
    ids,
  };

  return axios.get(url, { params: config });
};

export const isVisibleSuburban = () => {
  const url = URL + 'api/v1/' + CITY_CODE + '/settings/is-visible-suburban';
  return axios.get(url);
};
