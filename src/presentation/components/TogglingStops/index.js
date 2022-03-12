import React from 'react';
import { View, Dimensions } from 'react-native';
import { Marker } from 'react-native-maps';
import { RouteDirections } from '../../../enums';
import { parseRouteData } from '../../../utils';
import { styles } from './styles';

export default class TogglingStops extends React.Component {

  constructor(props) {
    super(props);
    this.screenWidth = Dimensions.get('window').width;
    this.state = {
      trackedRoutesStops: [],
      calculatedZoomLevel: '',
    };
  }

  componentDidMount() {
    this.parseData(this.props.routesDataSet);
  }

  componentDidUpdate(prevProps) {
    const { regionToReactTo, routeIdToReactTo } = this.props;
    let _abortOnMapPan = true;
    _abortOnMapPan = prevProps.routeIdToReactTo === routeIdToReactTo;
    if (JSON.stringify(prevProps.regionToReactTo) !== JSON.stringify(regionToReactTo) ||
        prevProps.routeIdToReactTo !== routeIdToReactTo) {
      this.handleStopsVisibility(regionToReactTo, routeIdToReactTo, _abortOnMapPan);
    }
  }

  parseData = (initData) => {
    const list = [];
    initData.forEach(item => {
      let route = item;
      if (this.props.activeRoute) {
        route = parseRouteData(item);
      }
      const data = { routeID: route.id, hidden: true };

      const forwardStopsSet = {
        routeDirection: RouteDirections.FORWARD,
        stops: route.forward.stops,
        ...data,
      };
      list.push(forwardStopsSet);

      const backwardStopsSet = {
        routeDirection: RouteDirections.BACKWARD,
        stops: route.backward.stops,
        ...data,
      };
      list.push(backwardStopsSet);

      this.setState({ trackedRoutesStops: list });
    });
  }

  handleStopsVisibility = (region, _chosenRouteId, abortOnMapPan) => {
    const zoomLevel =
      Math.log2((360 * ((this.screenWidth / 256) / region.longitudeDelta))) + 1;

    if (this.state.calculatedZoomLevel === zoomLevel && abortOnMapPan) {
      return;
    }

    this.setState({ calculatedZoomLevel: zoomLevel });
    if (_chosenRouteId !== null) {
      if (zoomLevel > this.props.zoomThreadhold) {
        if (this.props.showSelectRouteOnly === true) {
          this.showStopsForRoute(_chosenRouteId);
        } else {
          this.toggleAllStopsVisibility(false);
        }
      } else {
        this.toggleAllStopsVisibility(true);
      }
    }
  }

  showStopsForRoute = (_routeID) => {
    const updatedMap = this.state.trackedRoutesStops.map(item => {
      //all stops don't hide when no routeID is selected
      const newState = _routeID === '' || !_routeID ?
        false : item.routeID !== _routeID;
      return { ...item, hidden: newState };
    });
    this.setState({ trackedRoutesStops: updatedMap });
  }

  toggleAllStopsVisibility = (isHidden) => {
    const updatedMap = this.state.trackedRoutesStops.map(item => {
      return { ...item, hidden: isHidden };
    });
    this.setState({ trackedRoutesStops: updatedMap });
  }

  render() {
    const { forwardStopColor, defaultStopColor,
      backwardStopColor, stopSize, showStops, activeRoute } = this.props;

    return (
      this.state.trackedRoutesStops.map((stopSet, index) => {
        const length = stopSet.stops.length;

        if (stopSet.hidden === false) {
          let stopColor = defaultStopColor;
          if (this.props.colorDifferentDirections) {
            stopColor = stopSet.routeDirection === RouteDirections.FORWARD ?
              forwardStopColor : backwardStopColor;
          }
          const borderStyle = { borderColor: stopColor, stopSize };
          return (
            stopSet.stops.map((stop, i) => {
              return (
                <If condition={stop.geolocation !== undefined}>
                  <Marker
                    key={stop.id + '_' + i}
                    tracksViewChanges={false}
                    anchor={{ x: 0.5, y: 0.5 }}
                    coordinate={{
                      latitude: stop.geolocation.latitude,
                      longitude: stop.geolocation.longitude,
                    }}
                    onPress={() => { this.props.onStopPress(stop.id); }}
                  >
                    <If condition={this.props.renderStopView === undefined}>
                      <View
                        style={[
                          this.props.defaultStopStyle,
                          styles(borderStyle).stopCircle,
                        ]}
                      />
                    </If>
                    <If
                      condition={!!this.props.renderStartStopFlag && stop.isStart}
                    >
                      <View>
                        {this.props.renderStartStopFlag()}
                      </View>
                    </If>
                    <If
                      condition={!!this.props.renderEndStopFlag && stop.isEnd}
                    >
                      <View>
                        {this.props.renderEndStopFlag()}
                      </View>
                    </If>
                    <If condition={this.props.renderStopView !== undefined}>
                      <View>
                        {this.props.renderStopView(stop.type)}
                      </View>
                    </If>
                  </Marker>
                </If>
              );
            })
          );
        } else {
          // start and end points for stops are always visible for the user
          const isActive = showStops && (!activeRoute || activeRoute === stopSet.routeID);
          return (
            <If condition={stopSet.stops && stopSet.stops.length > 1 && isActive}>
              <View key={`${stopSet.stops[0].id}_view${activeRoute}`}>
                <If condition={!!this.props.renderStartStopFlag && stopSet.stops[0].isStart}>
                  <Marker
                    key={stopSet.stops[0].id + activeRoute}
                    tracksViewChanges={false}
                    coordinate={{
                      latitude: stopSet.stops[0].geolocation.latitude,
                      longitude: stopSet.stops[0].geolocation.longitude,
                    }}
                    onPress={() => { this.props.onStopPress(stopSet.stops[0].id); }}
                  >
                    <View>
                      {this.props.renderStartStopFlag()}
                    </View>
                  </Marker>
                </If>
                <If condition={!!this.props.renderEndStopFlag && stopSet.stops[length - 1].isEnd}>
                  <Marker
                    key={stopSet.stops[length - 1].id + activeRoute}
                    tracksViewChanges={false}
                    coordinate={{
                      latitude: stopSet.stops[length - 1].geolocation.latitude,
                      longitude: stopSet.stops[length - 1].geolocation.longitude,
                    }}
                    onPress={() => { this.props.onStopPress(stopSet.stops[length - 1].id); }}
                  >
                    <View>
                      {this.props.renderEndStopFlag()}
                    </View>
                  </Marker>
                </If>
              </View>
            </If>
          );
        }
      })
    );
  }
}
