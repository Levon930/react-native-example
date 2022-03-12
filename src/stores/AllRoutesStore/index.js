import { observable, action, computed } from 'mobx';
import { VehicleTypes, TimeFormats } from 'enums';
import AsyncStorage from '@react-native-community/async-storage';
import {
  FAVORITE_ROUTES_KEY,
  SUBSCRIBED_ROUTES_KEY,
  ALL_ROUTES_KEY, ROUTE_VERSION_KEY,
  DATE_FORMAT_KEY, IS_VISIBLE_SUBURBAN_FILTER_KEY,
} from '../../constants';
import { getTransportVersion, getRoutesByIds, isVisibleSuburban } from '../../services/api';

export default class AllRoutesStore {

  @observable
  allRoutes = [];

  @observable
  trackedRoutes = [];

  @observable
  favoriteRoutes = [];

  @observable
  callToast = false;

  @observable
  parseRoutesError = false;

  @observable
  _lastUpdatedDate;

  @observable
  routesDateFormat = TimeFormats.MINUTES;

  @observable
  routesIsVisibleSuburban = false;

  constructor() {
    this.getFavoriteRoutes();
    this.getSubscribedRoutes();
    this.getStoredRoutes();

    this.getRoutesDateFormat();
    setInterval(() => {
      this.getTransportVersion().then(() => {
        this.updateFavoriteedRoutes();
        this.updateSubscribedRoutes();
      });
    }, 7200000);
  }

  @action
  getTransportVersion = () => {
    return getTransportVersion().then((lastUpdatedDate) => {
      this._lastUpdatedDate = lastUpdatedDate.data;
    });
  }

  @action
  updateSubscribedRoutes = () => {
    if (this.trackedRoutes.length === 0) return;

    const ids = this.trackedRoutes.map((item) => item.id);
    getRoutesByIds(ids).then(({ data }) => {
      data.forEach(element => {
        const index = this.trackedRoutes.findIndex((i) => i.id === element.id);
        if (index !== -1) this.trackedRoutes[index] = element;
      });

      AsyncStorage.setItem(SUBSCRIBED_ROUTES_KEY, JSON.stringify({
        items: this.trackedRoutes,
      }));
    });
  }

  @action
  updateFavoriteedRoutes = () => {
    if (this.favoriteRoutes.length === 0) return;

    const update = (ids) => {
      getRoutesByIds(ids).then(({ data }) => {
        data.forEach(element => {
          const index = this.favoriteRoutes.findIndex((i) => {
            return i.id === element.id;
          });
          if (index !== -1) this.favoriteRoutes[index] = element;
        });

        AsyncStorage.setItem(FAVORITE_ROUTES_KEY, JSON.stringify({
          items: this.favoriteRoutes,
        }));
      });
    };

    const loop = (type) => {
    // There is no limit for favorite routes at he app till now.
    // To avoid errors related to the big amount of data
    // favorite routes are divided into small arrays

      const arr = this.favoriteRoutes.filter(
        item => item.type === type
      );

      for (let index = arr.length; index > 0; index -= 7) {
        if (index < 8) {
          const ids = arr.map((item) => item.id);
          update(ids);
        } else {
          const part = arr.splice(0, 7);
          const ids = part.map((item) => item.id);
          update(ids);
        }
      }
    };

    AsyncStorage.getItem(ROUTE_VERSION_KEY).then((response) => {
      const parsedResponse = JSON.parse(response);
      if (!response) return;
      const isTram =
        parsedResponse.version.tram.lastUpdated !== this._lastUpdatedDate.tram.lastUpdated;
      const isMetro =
        parsedResponse.version.metro.lastUpdated !== this._lastUpdatedDate.metro.lastUpdated;
      const isBus =
        parsedResponse.version.bus.lastUpdated !== this._lastUpdatedDate.bus.lastUpdated;
      const isTrolleybus
      = parsedResponse.version.trol.lastUpdated !== this._lastUpdatedDate.trol.lastUpdated;

      if (isTram) loop(VehicleTypes.TRAM);
      if (isMetro) loop(VehicleTypes.METRO);
      if (isBus) loop(VehicleTypes.BUS);
      if (isTrolleybus) loop(VehicleTypes.TROLLEYBUS);
    });
  }

  @action
  getFavoriteRoutes() {
    AsyncStorage.getItem(FAVORITE_ROUTES_KEY).then((result) => {
      this.favoriteRoutes = result ? JSON.parse(result).items : [];
      this.getTransportVersion().then(() => {
        this.updateFavoriteedRoutes();
      });
    });
  }

  @action
  getSubscribedRoutes() {
    AsyncStorage.getItem(SUBSCRIBED_ROUTES_KEY).then((result) => {
      this.trackedRoutes = result ? JSON.parse(result).items : [];
      this.updateSubscribedRoutes();
    });
  }

  @action
  getStoredRoutes() {
    AsyncStorage.getItem(ALL_ROUTES_KEY)
      .then((routes) => {
        this.allRoutes = routes ? JSON.parse(routes).routes : [];
      });
  }

  @action
  onSubscribe = (selectedRoute) => {
    const targetIdx = this.trackedRoutes.findIndex(t => t.id === selectedRoute.id);
    if (targetIdx === -1) {
      if (this.trackCount < 5) {
        this.trackedRoutes.push(selectedRoute);
      } else {
        this.toggleToast();
      }
    } else if (targetIdx > -1) {
      this.trackedRoutes.splice(targetIdx, 1);
    }
    AsyncStorage.setItem(SUBSCRIBED_ROUTES_KEY, JSON.stringify({ items: this.trackedRoutes }));
  }

  @action
  onSetFavorite = (selectedRoute) => {
    const targetIdx = this.favoriteRoutes.findIndex(t => t.id === selectedRoute.id);
    if (targetIdx === -1) {
      this.favoriteRoutes.push(selectedRoute);
    } else if (targetIdx > -1) {
      this.favoriteRoutes.splice(targetIdx, 1);
    }
    AsyncStorage.setItem(FAVORITE_ROUTES_KEY, JSON.stringify({ items: this.favoriteRoutes }));
  }

  @action
  isRouteFavorite = (routeId) => {
    return this.favoriteRoutes.some(t => t.id === routeId);
  }

  @action
  isRouteSubscribed = (routeId) => {
    return this.trackedRoutes.some(t => t.id === routeId);
  }

  @action
  toggleToast = () => {
    this.callToast = !this.callToast;
  }

  @action
  getRoutesDateFormat() {
    AsyncStorage.getItem(DATE_FORMAT_KEY).then((response) => {
      this.routesDateFormat = response || TimeFormats.MINUTES;
    });
    return this.routesDateFormat;
  }

  @action
  getRoutesIsVisibleSuburban() {
    AsyncStorage.getItem(IS_VISIBLE_SUBURBAN_FILTER_KEY).then((response) => {
      this.routesIsVisibleSuburban = response;
    });
    return this.routesIsVisibleSuburban;
  }

  @action
  setRoutesDateFormat(index) {
    this.routesDateFormat = index;
    AsyncStorage.setItem(DATE_FORMAT_KEY, index.toString());
  }

  @action
  setRoutesIsVisibleSuburban() {
    isVisibleSuburban().then(({ data }) => {
      AsyncStorage.setItem(IS_VISIBLE_SUBURBAN_FILTER_KEY, data.toString());
    });
  }

  @computed
  get trackCount() {
    return this.trackedRoutes.length;
  }
}
