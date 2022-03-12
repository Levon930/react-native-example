import { observable, action, computed, toJS } from 'mobx';
import { StopsStore } from 'stores';
import { isRouteType, isLongRoute } from 'utils';
import { getRoutesByStopId } from 'api';
import { VehicleTypes, Deltas } from 'enums';
import VehiclesViewModelBase from '../_helpers/VehiclesViewModelBase';

export default class extends VehiclesViewModelBase {

  @observable
  showUserLocation = false;

  userRegion;

  @observable
  region = {
    latitude: 48.466667,
    longitude: 35.016667,
    latitudeDelta: Deltas.NORMAL_LATITUDE_DELTA,
    longitudeDelta: Deltas.NORMAL_LATITUDE_DELTA,
  }

  @observable
  etaDataOfOneStop = {};

  @observable
  isETAModalVisible = false;

  @observable
  loadingETAs = false;

  @observable
  route;

  @observable
  startPoint;

  @observable
  endPoint;

  @observable
  showHandicappedMarkers = false;

  _view;

  activeStop;

  @action
  parseStopsData = (rawRoute, initCoords) => {
    let clonedForwardStops = [];

    rawRoute.ways.forEach(way => {
      if (way.stopStations) {
        clonedForwardStops = clonedForwardStops.concat(way.stopStations);
      }
    });

    if (rawRoute.ways[0].startGeolocation) {
      const isStartPointStop = clonedForwardStops.find(item => {
        return item.geolocation.latitude === rawRoute.ways[0].startGeolocation.latitude &&
          item.geolocation.longitude === rawRoute.ways[0].startGeolocation.longitude;
      });
      this.startPoint = {
        coordinates: rawRoute.ways[0].startGeolocation,
        stopId: isStartPointStop ? isStartPointStop.id : undefined,
      };
    } else {
      this.startPoint = {
        coordinates: rawRoute.ways[0].stopStations[0].geolocation,
        stopId: rawRoute.ways[0].stopStations[0].id,
      };
      clonedForwardStops = clonedForwardStops.filter(item => item.id !== this.startPoint.stopId);
    }

    if (rawRoute.ways[rawRoute.ways.length - 1].endGeolocation) {
      const isEndPointStop = clonedForwardStops.find(item => {
        return item.geolocation.latitude === rawRoute.ways[rawRoute.ways.length - 1]
          .endGeolocation.latitude && item.geolocation.longitude
            === rawRoute.ways[rawRoute.ways.length - 1].endGeolocation.longitude;
      });
      this.endPoint = {
        coordinates: rawRoute.ways[rawRoute.ways.length - 1].endGeolocation,
        stopId: isEndPointStop ? isEndPointStop.id : undefined,
      };
    } else if (rawRoute.ways[rawRoute.ways.length - 1].stopStations) {
      this.endPoint = {
        coordinates: rawRoute.ways[rawRoute.ways.length - 1]
          .stopStations[rawRoute.ways[rawRoute.ways.length - 1]
            .stopStations.length - 1].geolocation,
        stopId: rawRoute.ways[rawRoute.ways.length - 1]
          .stopStations[rawRoute.ways[rawRoute.ways.length - 1]
            .stopStations.length - 1].id,
      };
      clonedForwardStops = clonedForwardStops.filter(item => item.id !== this.endPoint.stopId);
    } else {
      this.endPoint = {
        coordinates: rawRoute.ways[rawRoute.ways.length - 2]
          .stopStations[rawRoute.ways[rawRoute.ways.length - 2]
            .stopStations.length - 1].geolocation,
        stopId: rawRoute.ways[rawRoute.ways.length - 2]
          .stopStations[rawRoute.ways[rawRoute.ways.length - 2]
            .stopStations.length - 1].id,
      };
      clonedForwardStops = clonedForwardStops.filter(item => item.id !== this.endPoint.stopId);
    }

    const parsed = {
      ...rawRoute,
      forward: {
        stops: clonedForwardStops,
        stopsId: '0',
      },
      backward: {
        stops: [],
        stopsId: '1',
      },
    };
    this.route = parsed;

    const routesData = toJS(this.route).ways.filter(
      way => isRouteType(way.type)
    );
    const ids = routesData.map((item) => item.routeId);
    this.setRoutes(ids);

    const hasEndPoint = this.route.ways.findIndex(item => item.type === VehicleTypes.END);
    if (hasEndPoint === -1) {
      this.route.ways.push({
        type: VehicleTypes.END,
      });
    }

    const newRegion = {
      latitudeDelta: Deltas.NORMAL_LATITUDE_DELTA,
      longitudeDelta: Deltas.NORMAL_LATITUDE_DELTA,
      latitude: 48.466667,
      longitude: 35.016667,
    };

    if (isLongRoute(initCoords)) {
      newRegion.latitudeDelta = Deltas.BIG_LATITUDE_DELTA;
      newRegion.longitudeDelta = Deltas.BIG_LONGITUDE_DELTA;
    }

    const wayWithGeolocation = this.route.ways.find(item => item.geolocations);

    if (wayWithGeolocation) {
      const middle = Math.round(wayWithGeolocation.geolocations.length / 2);

      newRegion.latitude = wayWithGeolocation.geolocations[middle].latitude;
      newRegion.longitude = wayWithGeolocation.geolocations[middle].longitude;
      this.region = newRegion;
    } else return;
  }


  @action
  setShowUserLocation = () => {
    this.showUserLocation = true;
  }

  @action
  setRegion = (region) => {
    this.region = region;
  }

  toggleHandicappedFilter = () => {
    this.showHandicappedMarkers = !this.showHandicappedMarkers;
  };

  @action
  setUserRegion = (position) => {
    this.userRegion = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.10, //an amount based on the supplied latitude as the center
      longitudeDelta: 0.15,
    };
  }

  @action
  openETAModal = () => {
    this.isETAModalVisible = true;
  }

  @action
  requestETADataOfAStop = async (id) => {
    getRoutesByStopId(id)
      .then(action((response) => {
        const current = response.data;
        this.activeStop = id;
        this.etaDataOfOneStop = { ...current, isFavorite: StopsStore.isFavorite(current.id) };
      }))
      .finally(() => { this.loadingETAs = false; });
  }

  @action
  closeETAModal = () => {
    this.activeStop = null;
  }

  @action
  onSetFavoriteStop = () => {
    StopsStore.onSetFavoriteStop(toJS(this.etaDataOfOneStop));
    const current = this.etaDataOfOneStop.isFavorite;
    this.etaDataOfOneStop = { ...this.etaDataOfOneStop, isFavorite: !current };
  }

  @computed
  get jsRoute() {
    return toJS(this.route);
  }

  @computed
  get startPointMarker() {
    return toJS(this.startPoint.coordinates);
  }

  @computed
  get endPointMarker() {
    return toJS(this.endPoint.coordinates);
  }
}
