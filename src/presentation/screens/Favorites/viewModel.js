import { observable, action, computed, toJS } from 'mobx';
import { StopsStore, AllRoutesStore } from 'stores';

export default class {

  @observable
  activeTab = 0;

  @observable
  refreshing = false;

  @action
  toggleToast = () => {
    AllRoutesStore.toggleToast();
  }

  @action
  setActiveTab = (index) => {
    this.activeTab = index;
  }

  @action
  onSetFavoriteStop = (item) => {
    StopsStore.onSetFavoriteStop(item); 
  }

  @action
  onSetFavoriteRoute = (item) => {
    AllRoutesStore.onSetFavorite(item); 
  }

  @action
  onSubscribe = (item) => {
    AllRoutesStore.onSubscribe(item); 
  }

  @action
  refreshRoutes = async () => {
    this.error = null;
    this.refreshing = true;
    await AllRoutesStore.getTransportVersion();
    await AllRoutesStore.updateFavoriteedRoutes();
    this.refreshing = false;
  }

  @action
  refreshStops = async () => {
    this.error = null;
    this.refreshing = true;
    await StopsStore.setStops();
    this.refreshing = false;
  }

  @action
  refreshStops = async () => {
    this.error = null;
    this.refreshing = true;
    await AllRoutesStore.getTransportVersion();
    await AllRoutesStore.updateFavoriteedRoutes();
    this.refreshing = false;
  }

  @computed
  get stops() {
    return toJS(StopsStore.favoriteStops);
  }

  @computed
  get routes() {
    return toJS(AllRoutesStore.favoriteRoutes);
  }

  @computed
  get callToast() {
    return AllRoutesStore.callToast;
  }
}
