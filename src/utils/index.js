import * as Assets from 'assets';
import { Languages, TimeFormats, VehicleAbbrevs, VehicleTypes } from 'enums';

export const getRouteIcon = (vehicleType) => {
  const vT = Number(vehicleType);
  switch (vT) {
    case 0:
      return Assets.tramIcon;
    case 1:
      return Assets.trolleybusIcon;
    case 2:
      return Assets.busLightIcon;
    case 3:
      return Assets.metroIcon;
  }
};

export const getVehicleColor = (type) => {
  const t = Number(type);
  switch (t) {
    case VehicleTypes.TROLLEYBUS:
      return '#00ADE5';
    case VehicleTypes.BUS:
      return '#F99A1C';
    case VehicleTypes.METRO:
      return '#204CA3';
    case VehicleTypes.TRAM:
      return '#E5312E';
    default:
      return '#000';
  }
}

export const getName = (item, appLanguage) => {
  switch (appLanguage) {
    case Languages.UA:
      return item.nameUA;
    case Languages.EN:
      return item.nameEN;
    case Languages.RU:
      return item.nameRU;
    default:
      return item.nameUA;
  }
};

export const getMessageTranslation = (item, appLanguage) => {
  switch (appLanguage) {
    case Languages.UA:
      return item.messageUA;
    case Languages.RU:
      return item.messageRU;
    case Languages.EN:
      return item.messageEN;
    default:
      return item.messageUA;
  }
};

export const getLanguage = (currentLanguage) => {
  switch (currentLanguage) {
    case Languages.UA:
    case 'uk':
    case 'uk-UA':
    case 'uk-US':
      return Languages.UA;
    case Languages.RU:
    case 'ru-US':
    case 'ru-RU':
    case 'ru-UA':
      return Languages.RU;
    case Languages.EN:
    case 'en-CA':
    case 'en-GB':
    case 'en-AU':
    case 'en-BZ':
    case 'en-CB':
    case 'en-IE':
    case 'en-JM':
    case 'en-NZ':
    case 'en-PH':
    case 'en-TT':
    case 'en-US':
    case 'en-ZA':
    case 'en-ZW':
      return Languages.EN;
    default:
      return Languages.EN;
  }
};

export const getRouteAbbrev = (type, lang = Languages.UA) => {
  if (lang === Languages.EN) {
    switch (type) {
      case VehicleTypes.TRAM:
        return VehicleAbbrevs.TRAM;

      case VehicleTypes.TROLLEYBUS:
        return VehicleAbbrevs.TROLLEYBUS_EN;

      case VehicleTypes.BUS:
        return VehicleAbbrevs.BUS_EN;

      case VehicleTypes.METRO:
        return VehicleAbbrevs.METRO;

      default:
        return '';
    }
  } else {
    switch (type) {
      case VehicleTypes.TRAM:
        return VehicleAbbrevs.TRAM;

      case VehicleTypes.TROLLEYBUS:
        return VehicleAbbrevs.TROLLEYBUS;

      case VehicleTypes.BUS:
        return VehicleAbbrevs.BUS;

      case VehicleTypes.METRO:
        return VehicleAbbrevs.METRO;

      default:
        return '';
    }
  }
};

export const getErrorMessage = (error, translations) => {
  switch (error) {
    default:
      return translations.errors.failedRequest;
  }
};

export const getTransportMarkerIcon = (vehicleType) => {
  switch (vehicleType) {
    case 0:
      return Assets.tramMarker;
    case 1:
      return Assets.trolleybusMarker;
    case 2:
      return Assets.busMarker;
    case 3:
      return Assets.busMarker; // switch to `metro` in case markers for this type will be shown
    default:
      return Assets.busMarker;
  }
};

export const isRouteType = (type) => {
  switch (type) {
    case VehicleTypes.TRAM:
    case VehicleTypes.TROLLEYBUS:
    case VehicleTypes.BUS:
    case VehicleTypes.METRO:
      return true;
    default:
      return false;
  }
};

export const parseRouteData = (rawRoute) => {
  // Parse route stops data for displaying start and end markers
  const clonedForwardStops = rawRoute.forward.stops;
  clonedForwardStops[0] =
    { ...clonedForwardStops[0], isStart: true };
  clonedForwardStops[clonedForwardStops.length - 1] =
    { ...clonedForwardStops[clonedForwardStops.length - 1], isEnd: true };
  const parsed = {
    ...rawRoute,
    forward: {
      pathId: rawRoute.forward.pathId,
      geolocation: rawRoute.forward.geolocation,
      stops: clonedForwardStops,
      stopsId: rawRoute.forward.stopsId,
    },
    backward: {
      pathId: rawRoute.backward.pathId,
      geolocation: rawRoute.backward.geolocation,
      stops: rawRoute.backward.stops,
      stopsId: rawRoute.backward.stopsId,
    },
  };
  return parsed;
};

export const dateFormat = (format, translations) => {
  switch (format) {
    case TimeFormats.MINUTES:
      return translations.settings.arrivalFormat.minutes;
    case TimeFormats.HOURS:
      return translations.settings.arrivalFormat.hours;
    default:
      return translations.settings.arrivalFormat.minutes;
  }
};

export const isLongRoute = (geolocations) => {
  const x = Math.abs(geolocations[0].latitude - geolocations[geolocations.length - 1].latitude);
  const y = Math.abs(geolocations[0].longitude - geolocations[geolocations.length - 1].longitude);
  return x >= 0.105 || y >= 0.105;
};

export const endWayPointIcon = (endPoint, appLanguage) => {
  switch (true) {
    case (endPoint.stopId && appLanguage === Languages.EN):
      return Assets.busStopPointBIconEng;
    case endPoint.stopId:
      return Assets.busStopPointBIconUa;
    case appLanguage === Languages.EN:
      return Assets.bPointIconEng;
    default:
      return Assets.bPointIcon;
  }
};

export const getDistanceFromLatLon = (from, to) => {
  const latFrom = from.latitude;
  const lonFrom = from.longitude;
  const latTo = to.latitude;
  const lonTo = to.longitude;
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(latTo - latFrom);// deg2rad below
  const dLon = deg2rad(lonTo - lonFrom);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(latFrom)) * Math.cos(deg2rad(latTo)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Distance in m

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
};

export const getCarrierName = (carrier, language) => {
  switch (language) {
    case Languages.UA:
      return carrier.nameUA ? carrier.nameUA : '--';
    case Languages.RU:
      return carrier.nameRU ? carrier.nameRU : '--';
    case Languages.EN:
      return carrier.nameEN ? carrier.nameEN : '--';
    default:
      return '--';
  }
};

export const getCarrierDirector = (carrier, language) => {
  switch (language) {
    case Languages.UA:
      return carrier.directorNameUA ? carrier.directorNameUA : '--';
    case Languages.RU:
      return carrier.directorNameRU ? carrier.directorNameRU : '--';
    case Languages.EN:
      return carrier.directorNameEN ? carrier.directorNameEN : '--';
    default:
      return '--';
  }
};

export const getCarrierAddress = (carrier, language) => {
  switch (language) {
    case Languages.UA:
      return carrier.addressUA ? carrier.addressUA : '--';
    case Languages.RU:
      return carrier.addressRU ? carrier.addressRU : '--';
    case Languages.EN:
      return carrier.addressEN ? carrier.addressEN : '--';
    default:
      return '--';
  }
};
