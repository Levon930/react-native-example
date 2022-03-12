export const DeviceType = Object.freeze({
  IOS: 'ios',
  ANDROID: 'android',
});

export const AppRoutes = Object.freeze({
  INIT: 'init',
  ONBOARDING: 'onboarding',
  HOME: 'home',
  VEHICLES: 'vehicles',
  FAVORITES: 'favorites',
  TICKETS: 'tickets',
  SETTINGS: 'settings',
  ABOUT: 'about',
  CONTACT_SUPPORT: 'contactSupport',
  CONTACT_SUPPORT_SUCCESS: 'contactSupportSuccess',
  LANGUAGES: 'languages',
  NOTIFICATIONS: 'notifications',
  USER_AGREEMENT: 'userAgreement',
  ABOUT_APP: 'aboutApp',
  CHOSEN_ROUTE: 'chosenRoute',
  ROUTES_DETAILS: 'routeDetails',
  TIME_FORMATS: 'timeFormats',
});

export const SaveAreaInset = Object.freeze({
  TOP: 'top',
  BOTTOM: 'bottom',
});

export const Deltas = Object.freeze({
  SMALL_LATITUDE_DELTA: 0.039437803303776775,
  SMALL_LONGITUDE_DELTA: 0.03244433552026749,
  NORMAL_LATITUDE_DELTA: 0.15,
  NORMAL_LONGITUDE_DELTA: 0.15,
  BIG_LATITUDE_DELTA: 0.55,
  BIG_LONGITUDE_DELTA: 0.55,
});

export const PermissionTypes = Object.freeze({
  LOCATION: 'location',
  NOTIFICATIONS: 'notification',
});

export const PermissionRequestResult = Object.freeze({
  AUTHORIZED: 'authorized',
  DENIED: 'denied',
});

export const Languages = Object.freeze({
  UA: 'ua',
  EN: 'en',
  RU: 'ru',
});

export const RouteNameKeys = Object.freeze({
  NAMEEN: 'nameEN',
  NAMERU: 'nameRU',
  NAMEUA: 'nameUA',
});

export const VehicleAbbrevs = Object.freeze({
  TRAM: 'T',
  TROLLEYBUS: 'Tp',
  TROLLEYBUS_EN: 'Tr',
  BUS: 'A',
  BUS_EN: 'B',
  METRO: 'M',
});

export const RouteDirections = Object.freeze({
  FORWARD: 'forward',
  BACKWARD: 'backward',
});

export const VehicleTypes = Object.freeze({
  TRAM: 0,
  TROLLEYBUS: 1,
  BUS: 2,
  METRO: 3,
  START: 4,
  TRANSFER: 5,
  END: 6,
});

export const FavoriteTypes = Object.freeze({
  VEHICLES: 0,
  STOPS: 1,
});

export const Errors = Object.freeze({
  NOT_FOUND: 'not found',
});

export const AutocompleteTypes = Object.freeze({
  STOP: 'stop',
  PLACE: 'place',
});

export const TimeFormats = Object.freeze({
  HOURS: 'HH:mm',
  MINUTES: 'm',
  SECONDS: 's'
});

export const EmptyListMessageType = Object.freeze({
  BASIC: 'basic',
  SEARCH: 'search',
});
