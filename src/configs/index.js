const getURL = (env = 'prod') => {
  switch (env) {
    case 'dev':
      return 'https://api.d-transport.dp.ua/';
      // return 'https://api.ta.lionwood.software/';
    case 'stage':
      // return 'https://api.ta.lionwood.software/';
      return 'https://api.ta-stage.lionwood.software/';
    case 'prod':
      // return 'https://api.ta.lionwood.software/';
      return 'https://api.d-transport.dp.ua/';
  }
};

export const URL = getURL();

export const CITY_CODE = 'dnipro';
