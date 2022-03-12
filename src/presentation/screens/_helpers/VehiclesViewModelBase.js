import { action, computed, observable, toJS } from 'mobx';
import React from 'react';
import { Animated } from 'react-native';
import _ from 'lodash';
import { getTransportMarkerIcon } from 'utils';
import { Deltas } from 'enums';
import { AnimatedRegion } from 'react-native-maps';
import { getTransferAngle } from 'rotate-tracker';
import { getRoutesDetails } from '../../../services/api/routes';

export default class VehiclesViewModelBase {

  _view;

  @observable
  error = null;

  @observable
  animatedVehicles = [];

  @observable
  _apiTimer;

  @observable
  region = {
    latitude: 48.46905218988482,
    longitude: 35.04738936200738,
    latitudeDelta: Deltas.SMALL_LATITUDE_DELTA,
    longitudeDelta: Deltas.SMALL_LONGITUDE_DELTA,
  };

  @observable
  animatedVehiclesErrorCounter = 0;

  _apiCallInterval = 15000;
  _routeIds = [];

  constructor(view) {
    this._view = view;
  }


  @action
  stopAnimation = () => {
    this.clearApiTimer();
    this.animatedVehicles = [];
  };

  @action
  clearApiTimer = () => {
    clearTimeout(this._apiTimer);
    this._apiTimer = null;
  };

  _parseRouteData(responseData) {
    const data = this._parseDataToArray(responseData);

    const newData = {
      routeIds: [],
      vehicles: [],
      timestamp: 0,
    };

    data.forEach(route => {
      if (route && route.vehicles) {
        const vehicles = route.vehicles.map(v => {
          const vehicle = v;
          vehicle.routeId = route.routeId;
          vehicle.number = route.number;
          vehicle.vehicleType = route.vehicleType;
          return vehicle;
        });
        newData.routeIds.push(route.routeId);
        newData.vehicles.push(...vehicles);
        newData.timestamp = route.timestamp;
      }
    });

    return newData;
  }

  _parseDataToArray(data) {
    return (toString.call(data) !== '[object Array]') ? [data] : data;
  }

  // Set timer to call an api
  @action
  _setApiCallTimer = (timestamp, callback) => {
    this._apiTimer = setTimeout(() => callback(), this._apiCallInterval);
  };

  @action
  setRoutes = (routesIds) => {
    this._routeIds = toJS(routesIds);
    if (this._routeIds.length === 0) return;
    this.error = null;
    this.clearApiTimer();
    return getRoutesDetails(this._routeIds)
      .then(action((response) => {
        if (!response || !response.data) return;
        const routesData = this._parseRouteData(response.data);
        if (!_.isEqual(routesData.routeIds.sort(), this._routeIds.sort())) return;
        this._setApiCallTimer(routesData.timestamp, () => this.setRoutes(this._routeIds));
        routesData.vehicles = routesData.vehicles.filter(
          x => x.normal && x.normal.length > 0 && (x.normal[0].latitude || x.normal[0].longitude));

        this.animatedVehicles = this.animatedVehicles.filter(
          vehicle => routesData.vehicles.find(v => v.bort_number === vehicle.bort_number));

        this.pushMarkers(routesData.vehicles);

        this.triggerAnimation();
      }))
      .catch(action((e) => {
        ++this.animatedVehiclesErrorCounter;
        if (this.animatedVehiclesErrorCounter === 3) {
          this.error = `${e}`;
          this._view.refs.toastRef.show(this.error, 5000);
          this.animatedVehiclesErrorCounter = 0;
          this.stopAnimation();
        }
      }));
  };

  @action
  pushMarkers = (vehicles) => {
    vehicles.forEach(vehicle => {
      const index = this.animatedVehicles.findIndex(v => v.bort_number === vehicle.bort_number);
      const params = {
        ...vehicle,
        coordinate: new AnimatedRegion({
          latitude: vehicle.normal[0].latitude,
          longitude: vehicle.normal[0].longitude,
          latitudeDelta: Deltas.SMALL_LATITUDE_DELTA,
          longitudeDelta: Deltas.SMALL_LONGITUDE_DELTA,
        }),
        ref: React.createRef(),
        deg: new Animated.Value(0),
        icon: getTransportMarkerIcon(vehicle.vehicleType),
      };

      if (index === -1) {
        this.animatedVehicles.push(params);
      } else {
        params.deg = this.animatedVehicles[index].deg;
        this.animatedVehicles[index] = params;
      }
    });
  };

  @action
  triggerAnimation = () => {
    const generateAnimation = (vehicle, index = 0, vehicleIndex) => {
      if (vehicle.normal && (vehicle.normal.length > index)) {
        const newCoordinate = {
          latitude: vehicle.normal[index].latitude,
          longitude: vehicle.normal[index].longitude,
          latitudeDelta: Deltas.SMALL_LATITUDE_DELTA,
          longitudeDelta: Deltas.SMALL_LONGITUDE_DELTA,
        };
        const currentCoordinate = {
          latitude: vehicle.coordinate.latitude._value,
          longitude: vehicle.coordinate.longitude._value,
        };

        if (newCoordinate.latitude !== currentCoordinate.latitude ||
          newCoordinate.longitude !== currentCoordinate.longitude) {
          const angle = getTransferAngle(currentCoordinate, newCoordinate);
          this.animatedVehicles = this.animatedVehicles.map((v, i) => {
            const veh = v;
            if (i === vehicleIndex) {
              Animated.spring(vehicle.deg, {
                toValue: angle,
              }).start();
            }
            return veh;
          });
        }

        const duration = 15015 / vehicle.normal.length;
        vehicle.coordinate.timing({ ...newCoordinate, duration })
          .start((e) => {
            if (e.finished) {
              generateAnimation(vehicle, index + 1, vehicleIndex);
            }
          });

      }
    };
    this.animatedVehicles.forEach((vehicle, index) => {
      generateAnimation(vehicle, 0, index);
    });
  };

  //MapView actions
  @action
  zoomInRegion = () => {
    this.region = {
      ...this.region,
      latitudeDelta: this.region.latitudeDelta / 2,
      longitudeDelta: this.region.longitudeDelta / 2,
    };
  };

  @action
  zoomOutRegion = () => {
    this.region = {
      ...this.region,
      latitudeDelta: this.region.latitudeDelta * 2,
      longitudeDelta: this.region.longitudeDelta * 2,
    };
  };

  @computed
  get jsRegion() {
    return toJS(this.region);
  }
}
