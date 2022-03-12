import { observable, action } from 'mobx';
import { getStops } from 'api';
import { FAVORITE_STOPS_KEY } from 'constants';
import AsyncStorage from '@react-native-community/async-storage';

export default class StopsStore {

  @observable
  stops = [];

  @observable
  favoriteStops = [];

  @observable
  lastRequestDate = '';

  @action
  getFavoriteStops() {
    AsyncStorage.getItem(FAVORITE_STOPS_KEY).then((result) => {
      this.favoriteStops = result ? JSON.parse(result).items : [];
    });
  }
  
  @action
  setStops = () => {
    if (this.stops.length === 0) {
      getStops()
        .then(action((response) => { 
          this.stops = response.data;
          this.lastRequestDate = new Date();
          return response.data;
        }
        ))
        .then((data) => {
          // update favorite stops data
          const updated = this.favoriteStops.map((favorite) => {
            const index = data.findIndex((stop) => stop.id === favorite.id);
            if (index !== -1) return data[index];
            return null;
          });
          this.favoriteStops = updated.filter((item) => !!item);
        });
    }
  }

  @action
  onSetFavoriteStop = (selectedStop) => {
    const targetIdx = this.favoriteStops.findIndex(t => t.id === selectedStop.id);
    if (targetIdx === -1) {
      this.favoriteStops.push(selectedStop);
    } else if (targetIdx > -1) {
      this.favoriteStops.splice(targetIdx, 1);
    }
    AsyncStorage.setItem(FAVORITE_STOPS_KEY, JSON.stringify({ items: this.favoriteStops }));
  }

  @action
  isFavorite = (stopId) => {
    return this.favoriteStops.some(t => t.id === stopId);
  }
}
