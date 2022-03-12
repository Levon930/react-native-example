import React from 'react';
import { action, computed, observable, toJS } from 'mobx';
import { getRoutesByStopId, searchAddress, searchRoutes, searchStops } from '../../../services/api';
import { AutocompleteTypes, Deltas } from '../../../enums';
import { AllRoutesStore, StopsStore } from '../../../stores';
import { getErrorMessage, isLongRoute } from '../../../utils';
import VehiclesViewModelBase from '../_helpers/VehiclesViewModelBase';

export default class extends VehiclesViewModelBase {

    @observable
    chosenRoute = [];

    userRegion;

    @observable
    showUserLocation = false;

    @observable
    searchInputFrom = '';

    @observable
    searchInputTo = '';

    @observable
    callToast = false;

    @observable
    etaDataOfOneStop = {};

    @observable
    isETAModalVisible = false;

    @observable
    loadingETAs = false;

    @observable
    disabledFilter = false;

    @observable
    cheapestFilter = true;

    @observable
    speedFilter = false;

    @observable
    subUrbanFilter = false;

    @observable
    isSuburbanFilterVisible = false;

    @observable
    autocompleteSearchList = [];

    @observable
    searchFromCoords = {
      latitude: null,
      longitude: null,
    };

    @observable
    searchToCoords = {
      latitude: null,
      longitude: null,
    };

    @observable
    routesListUnfiltered = [];

    @observable
    loading;

    activeStop;

    _appLang;

    constructor(view) {
      super(view);
      AllRoutesStore.setRoutesIsVisibleSuburban();
      this.isSuburbanFilterVisible = AllRoutesStore.getRoutesIsVisibleSuburban() == 'true';
      if (StopsStore.stops.length === 0) StopsStore.setStops();
      if (!view.props.route.params) { // validation in case was chosen favorite stop
        if (this.jsTogglingPolylines.length > 0) {
          this.chosenRoute.push(this.jsTogglingPolylines[0].id);
        }

        if (this.chosenRoute.length > 0) {
          this.setRoutes(this.chosenRoute);

          const geolocation = this.getValidGeolocation(this.chosenRouteData[0]);
          // Moving the map to the middle of the chosen route
          if (geolocation) this.region = geolocation;
        }
      }
    }


    @action
    toggleToast = () => {
      this.callToast = !this.callToast;
    };

    @action
    setChosenRoute = (routeID) => {
      this.stopAnimation(routeID);

      if (this.chosenRoute.indexOf(routeID) === -1) {
        this.chosenRoute.push(routeID);
      }

      if (routeID && this.chosenRoute.length > 0) {
        const index = this.chosenRoute.indexOf(routeID);
        if (index !== -1) {
          this.setRoutes(this.chosenRoute);
        }
      }
    };

    @action
    unsetChosenRoute = (routeId) => {
      const chosenRoute = toJS(this.chosenRoute);
      const index = chosenRoute.indexOf(routeId);
      if (index !== -1) {
        chosenRoute.splice(index, 1);
      }
      this.chosenRoute = chosenRoute;
      this.stopAnimation();
      this.setRoutes(chosenRoute);
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
        latitudeDelta: 0.012, //an amount based on the supplied latitude as the center
        longitudeDelta: 0.003,
      };
    };

    //textInput actions
    @action
    setSearchInputFrom = (searchInputFrom, reload = true) => {
      this.searchInputFrom = searchInputFrom;
      this.searchFromCoords.latitude = null;
      this.routesListUnfiltered = [];
      if (this.searchInputFrom.length > 1 && reload) {
        this.fetchAutocompleteStops(this.searchInputFrom);
      } else if (this.searchInputFrom.length < 2) {
        this.autocompleteSearchList = [];
      }
    };

    @action
    setSearchInputTo = (searchInputTo, reload = true) => {
      this.searchInputTo = searchInputTo;
      this.searchToCoords.latitude = null;
      this.routesListUnfiltered = [];
      if (this.searchInputTo.length > 1 && reload) {
        this.fetchAutocompleteStops(this.searchInputTo);
      } else if (this.searchInputTo.length < 2) {
        this.autocompleteSearchList = [];
      }
    };

    @action
    setSearchFromCoords = (lat, lon) => {
      this.searchFromCoords.latitude = lat;
      this.searchFromCoords.longitude = lon;
    };

    @action
    setSearchToCoords = (lat, lon) => {
      this.searchToCoords.latitude = lat;
      this.searchToCoords.longitude = lon;
    };

    @action
    swapSearchValues = () => {
      const swapValue = this.searchInputFrom;
      this.searchInputFrom = this.searchInputTo;
      this.searchInputTo = swapValue;
      const swapCoords = this.searchFromCoords;
      this.searchFromCoords = this.searchToCoords;
      this.searchToCoords = swapCoords;
      this.routesListUnfiltered = [];
    };

    //ETAModal functions
    @action
    openETAModal = () => {
      this.isETAModalVisible = true;
    };

    @action
    requestETADataOfAStop = async (id, translations) => {
      this.error = null;
      this.openETAModal();
      getRoutesByStopId(id)
        .then(action((response) => {
          const current = response.data;
          this.activeStop = id;
          this.etaDataOfOneStop = { ...current, isFavorite: StopsStore.isFavorite(current.id) };
        }))
        .catch(action((e) => {
          this.error = getErrorMessage(e, translations);
          this.toggleToast();
          this.closeETAModal();
        }))
        .finally(() => {
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
    setStopAsFrom = (name, id) => {
      this.searchInputFrom = name;
      const stop = StopsStore.stops.find((item) => item.id === id);
      this.searchFromCoords.latitude = stop.geolocation.latitude;
      this.searchFromCoords.longitude = stop.geolocation.longitude;
      this.closeETAModal();
      this.routesListUnfiltered = [];
    };

    @action
    setStopAsTo = (name, id) => {
      this.searchInputTo = name;
      const stop = StopsStore.stops.find((item) => item.id === id);
      this.searchToCoords.latitude = stop.geolocation.latitude;
      this.searchToCoords.longitude = stop.geolocation.longitude;
      this.closeETAModal();
      this.routesListUnfiltered = [];
    };

    @action
    toggleDisabledFilter = () => {
      this.disabledFilter = !this.disabledFilter;
    };

    @action
    toggleCheapestFilter = () => {
      this.cheapestFilter = !this.cheapestFilter;
      if (this.cheapestFilter) this.speedFilter = false;
    };

    @action
    toggleSpeedFilter = () => {
      this.speedFilter = !this.speedFilter;
      if (this.speedFilter) this.cheapestFilter = false;
    };

    @action
    toggleSuburbanFilter = (displayRoutesList) => {
      this.subUrbanFilter = !this.subUrbanFilter;
      if (displayRoutesList && this.searchFromCoords.latitude && this.searchToCoords.latitude) {
        this.routesListUnfiltered = [];
        this.searchRoutes();
      }
    };

    @action
    fetchAutocompleteStops = (value) => {
      searchStops(value, this._appLang)
        .then(({ data }) => {
          this.autocompleteSearchList = [];
          const parsedStops = data.stops.map((item) => {
            return { ...item, type: AutocompleteTypes.STOP };
          });
          const parsedPlaces = data.places.map((item) => {
            return { ...item, type: AutocompleteTypes.PLACE };
          });
          this.autocompleteSearchList.push(parsedStops, parsedPlaces);
        });
    };

    @action
    searchRoutes = (translations) => {
      this.loading = true;
      searchRoutes(
        this.searchFromCoords.latitude, this.searchFromCoords.longitude,
        this.searchToCoords.latitude, this.searchToCoords.longitude,
        this.subUrbanFilter, // enable in case subUrban Filter will be in use
      )
        .then((response) => {
          this.routesListUnfiltered = response.data;
        })
        .catch(action((e) => {
          this.error = getErrorMessage(e, translations);
          this.toggleToast();
        }))
        .finally(() => {
          this.loading = false;
        });
    };

    @action
    fetchAddress = (lat, lon) => {
      return searchAddress(lat, lon, this._appLang);
    };

    @action
    getValidGeolocation = (route) => {
      if (!route) return;

      const newRegion = {
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
        latitude: 48.46905218988482,
        longitude: 35.04738936200738,
      };

      if (route.forward && route.forward.geolocation && route.forward.geolocation.length > 0) {
        const middle = Math.round(route.forward.geolocation.length / 2);
        const validGeolocation = route.forward.geolocation[middle] &&
                Object.keys(route.forward.geolocation[middle]).length > 0;

        if (validGeolocation) {
          newRegion.latitude = route.forward.geolocation[middle].latitude;
          newRegion.longitude = route.forward.geolocation[middle].longitude;
          if (isLongRoute(route.forward.geolocation)) {
            newRegion.latitudeDelta = Deltas.BIG_LATITUDE_DELTA;
            newRegion.longitudeDelta = Deltas.BIG_LONGITUDE_DELTA;
          }
          return newRegion;
        } else {
          return;
        }
      } else if (route.forward.stops && route.forward.stops.length > 0) {
        const middle = Math.round(route.forward.stops.length / 2);
        const validGeolocation = route.forward.stops[middle] &&
                route.forward.stops[middle].geolocation &&
                Object.keys(route.forward.stops[middle].geolocation).length > 0;

        if (validGeolocation) {
          newRegion.latitude = route.forward.stops[middle].geolocation.latitude;
          newRegion.longitude = route.forward.stops[middle].geolocation.longitude;
          return newRegion;
        } else {
          return;
        }
      } else {
        return;
      }
    };

    @action
    clearAutocomplete = () => {
      this.autocompleteSearchList = [];
    };

    @action
    setAppLang = (lang) => {
      this._appLang = lang;
    };

    @computed
    get jsTogglingPolylines() {
      return toJS(AllRoutesStore.trackedRoutes);
    }

    @computed
    get showStops() {
      if (
        this.region.longitudeDelta <= 0.05 &&
            StopsStore.stops) {
        return true;
      } else {
        return false;
      }
    }

    @computed
    get showAutocomplete() {
      return this.autocompleteSearchList.length > 0;
    }

    @computed
    get showSearchRoutesButton() {
      return this.searchFromCoords.latitude && this.searchFromCoords.longitude
            && this.searchToCoords.latitude && this.searchToCoords.longitude;
    }

    @computed
    get routesList() {
      let list = this.routesListUnfiltered;
      if (this.cheapestFilter) {
        list = list.slice()
          .sort((a, b) => (
            // eslint-disable-next-line no-nested-ternary
            (a.totalPrice > b.totalPrice) ? 1 : ((b.totalPrice > a.totalPrice) ? -1 : 0)
          ));
      }

      if (this.disabledFilter) {
        list = list.filter((item) => !item.ways.find((way) => way.handicapped === false));
      }

      return list;
    }

    @computed
    get stopsForDisplaying() {
      const filteredStops = StopsStore.stops.filter(item =>
        item.geolocation.latitude < this.region.latitude + 0.02
            && item.geolocation.longitude < this.region.longitude + 0.02
            && (item.geolocation.latitude > this.region.latitude - 0.02
            && item.geolocation.longitude > this.region.longitude - 0.02),
      );
      return filteredStops;
    }

    @computed
    get favoriteStops() {
      return toJS(StopsStore.favoriteStops);
    }

    @computed
    get chosenRouteData() {
      return this.jsTogglingPolylines.filter((item) => this.chosenRoute.indexOf(item.id) !== -1);
    }
}
