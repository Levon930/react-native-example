
import { URL, CITY_CODE } from 'configs';
import axios from 'axios';

export const sendContactForm = (email, message) => {
  const url = URL + 'api/v1/' + CITY_CODE + '/contact';
  return axios.post(url, {
    email,
    message,
  });
};

