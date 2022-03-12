import React from 'react';
import { action, computed, observable, toJS } from 'mobx';
import { Languages, RouteDirections } from 'enums';
import _ from 'lodash';
import { AllRoutesStore, StopsStore } from 'stores';
import moment from 'moment';
import { getRouteById, getRoutesByStopId } from 'api';
import VehiclesViewModelBase from '../_helpers/VehiclesViewModelBase';
import { parseRouteData } from '../../../utils';

export default class extends VehiclesViewModelBase {
  @observable
  showUserLocation = false;

  @observable
  loading = true;

  userRegion;

  @observable
  chosenRoute = RouteDirections.FORWARD;

  @observable
  favorite = false;

  @observable
  subscribe = false;

  @observable
  etaDataOfOneStop = {};

  @observable
  isETAModalVisible = false;

  @observable
  loadingETAs = false;

  @observable
  route;

  _view;

  activeStop;

  // eslint-disable-next-line no-useless-constructor
  constructor(view) {
    super(view);
    this._view = view;
  }

  @action
  parseStopsData = (rawRoute) => {
    this.route = parseRouteData(rawRoute);
    this.loading = false;
  };

  @action
  getRouteDetails = (id) => {
    this.loading = true;
    return getRouteById(id)
      .then(({ data }) => {
        this.parseStopsData(data);
      })
      .finally(() => {
        this.loading = false;
      });
  };


  @action
  setShowUserLocation = () => {
    this.showUserLocation = true;
  };

  @action
  setRegion = (region) => {
    this.region = region;
  };

  @action
  setUserRegion = (position) => {
    this.userRegion = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.10, //an amount based on the supplied latitude as the center
      longitudeDelta: 0.15,
    };
  };

  @action
  toggleFavorite = () => {
    this.favorite = !this.favorite;
  };

  toggleSubscribe = () => {
    this.subscribe = !this.subscribe;
  };


  @action
  setChosenRoute = (route) => {
    this.chosenRoute = route;
  };

  @action
  openETAModal = () => {
    this.isETAModalVisible = true;
  };

  @action
  requestETADataOfAStop = async (id) => {
    getRoutesByStopId(id)
      .then(action((response) => {
        const current = response.data;
        this.activeStop = id;
        this.etaDataOfOneStop = { ...current, isFavorite: StopsStore.isFavorite(current.id) };
      }))
      .finally(() => {
        this.loadingETAs = false;
      });
  };

  @action
  closeETAModal = () => {
    this.activeStop = null;
  };

  @action
  onSetFavoriteStop = () => {
    StopsStore.onSetFavoriteStop(toJS(this.etaDataOfOneStop));
    const current = this.etaDataOfOneStop.isFavorite;
    this.etaDataOfOneStop = { ...this.etaDataOfOneStop, isFavorite: !current };
  };

  @action
  onSubscribe = (route) => {
    AllRoutesStore.onSubscribe(route);
  };

  @action
  toggleToast = () => {
    AllRoutesStore.toggleToast();
  };

  @action
  onSetFavoriteRoute = (item) => {
    AllRoutesStore.onSetFavorite(item);
  };

  @computed
  get jsRoute() {
    return toJS(this.route);
  }

  @computed
  get stopsList() {
    if (this.chosenRoute === RouteDirections.FORWARD) {
      return toJS(this.route).forward.stops;
    } else {
      return toJS(this.route).backward.stops;
    }
  }

  @computed
  get callToast() {
    return AllRoutesStore.callToast;
  }

  @computed
  get startHour() {
    return moment(this.route.startHour)
      .format('HH:mm');
  }

  @computed
  get endHour() {
    return moment(this.route.endHour)
      .format('HH:mm');
  }

  @computed
  get panelMiddleContainerHeight() {
    return this.carrierDirectorNameLength < 20 ? 240 : 280;
  }

  @computed
  get carrierDirectorNameLength() {
    if (!this.jsRoute || !this.jsRoute.carrier) return 0;
    switch (_.get(this._view.context, 'appLanguage')) {
      case Languages.UA:
        return this.jsRoute.carrier.directorNameUA ? this.jsRoute.carrier.directorNameUA.length : 0;
      case Languages.RU:
        return this.jsRoute.carrier.directorNameRU ? this.jsRoute.carrier.directorNameRU.length : 0;
      case Languages.EN:
        return this.jsRoute.carrier.directorNameEN ? this.jsRoute.carrier.directorNameEN.length : 0;
      default:
        return 0;
    }
  }
}
