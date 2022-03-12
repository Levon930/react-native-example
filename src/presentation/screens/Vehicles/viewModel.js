import { AllRoutesStore } from 'stores';
import { Keyboard } from 'react-native';
import { observable, action, computed } from 'mobx';
import { EmptyListMessageType } from 'enums';
import { getTransportVersion, getRoutesCompact } from 'api';
import { ROUTE_VERSION_KEY, ALL_ROUTES_KEY } from 'constants';
import AsyncStorage from '@react-native-community/async-storage';

export default class {

  @observable
  activeTab = 0;

  @observable
  allRoutes = [];
  
  @observable
  error = null;

  @observable
  searchValue = '';

  @observable
  emptyListMessageType = EmptyListMessageType.BASIC;

  @observable
  loading = false;

  _lastUpdatedDate;

  constructor() {
    this.getTransportVersion()
      .then(() => this.fetchVehicleRoutes())
      .catch(() => {
        this.allRoutes = AllRoutesStore.allRoutes;
      });
  }

  @action
  getTransportVersion = () => {
    return getTransportVersion().then((lastUpdatedDate) => {
      this._lastUpdatedDate = lastUpdatedDate.data;
    });
  }

  @action
  fetchVehicleRoutes = () => {
    AsyncStorage.getItem(ROUTE_VERSION_KEY).then((response) => { 
      const parsedResponse = JSON.parse(response);
      if (!response || AllRoutesStore.allRoutes.length === 0) {
        this.loadVehicles();
      } else if (parsedResponse.version.tram.lastUpdated !== this._lastUpdatedDate.tram.lastUpdated 
        || parsedResponse.version.trol.lastUpdated !== this._lastUpdatedDate.trol.lastUpdated
        || parsedResponse.version.bus.lastUpdated !== this._lastUpdatedDate.bus.lastUpdated
        || parsedResponse.version.metro.lastUpdated !== this._lastUpdatedDate.metro.lastUpdated) {
        this.allRoutes = AllRoutesStore.allRoutes;
        this.loadVehicles();
      } else {
        this.allRoutes = AllRoutesStore.allRoutes;
      }
    });
  }

  @action
  loadVehicles = () => {
    this.loading = true;
    AsyncStorage.setItem(ROUTE_VERSION_KEY, JSON.stringify({ version: this._lastUpdatedDate }));
    getRoutesCompact()
      .then((routesList) => {
        this.allRoutes = routesList.data.data; 
        AsyncStorage.setItem(ALL_ROUTES_KEY, JSON.stringify({ routes: this.allRoutes }));
        AllRoutesStore.getStoredRoutes();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => { this.loading = false; });
  }

  @action
  setActiveTab = (index) => {
    Keyboard.dismiss();
    this.emptyListMessageType = EmptyListMessageType.BASIC;
    this.activeTab = index;
    this.clearSearchResult();
  }

  @action
  setSearchResult = () => {
    if (!this.searchValue) {
      this.allRoutes = AllRoutesStore.allRoutes;
      return;
    }
    const result = AllRoutesStore.allRoutes.filter(
      route => route.number.indexOf(this.searchValue) === 0);
    this.allRoutes = result;
  }

  @action
  toggleToast = () => {
    AllRoutesStore.toggleToast();
  }

  @action
  setSearchValue = (value) => {
    this.searchValue = value;
  }

  onSubmitSearch = () => {
    this.setSearchResult();
    Keyboard.dismiss();
    this.emptyListMessageType = EmptyListMessageType.SEARCH;
  }

  @action
  clearSearchResult = () => {
    this.emptyListMessageType = EmptyListMessageType.BASIC;
    this.setSearchValue('');
    this.allRoutes = AllRoutesStore.allRoutes;
  }
  
  @computed
  get callToast() {
    return AllRoutesStore.callToast;
  }

  @computed
  get routesToDisplay() {
    return this.allRoutes.filter(item => item.type === this.activeTab);
  }
}
