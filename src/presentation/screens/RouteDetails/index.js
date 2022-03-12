import React from 'react';
import {
  View, Image, TouchableOpacity, TouchableWithoutFeedback,
  Dimensions, ScrollView, StatusBar,
} from 'react-native';
import { showLocation } from 'react-native-map-link';
import Toast from 'react-native-easy-toast';
import Interactable from 'react-native-interactable';
import { Polyline, Marker } from 'react-native-maps';
import { observer } from 'mobx-react';
import {
  Text, Map, Row, Divider, ETAModal,
  VehicleIcon, TogglingStops,
} from '../../components';
import * as Assets from '../../assets';
import { LocalizationContext } from '../../../services';
import { getRouteAbbrev, isRouteType, endWayPointIcon, getVehicleColor } from '../../../utils';
import * as Colors from '../../../presentation/styles/colors';
import styles from './styles';
import ViewModel from './viewModel';
import { TitledText, ListItem } from './components';

const screenHeight = Dimensions.get('window').height;
const interectableUpperViewBoundary = screenHeight * 0.35;
const backButtonTop = interectableUpperViewBoundary * 0.2;
const clickablePanelHeaderHeight = 130;
const panelMiddleContainerHeight = 145;
const scrollViewBotttomDummyHeight = interectableUpperViewBoundary + 10;
const minScrollViewHeight =
          screenHeight
        - interectableUpperViewBoundary
        - clickablePanelHeaderHeight
        - panelMiddleContainerHeight;

@observer
export class RouteDetailsScreen extends React.PureComponent {
  static contextType = LocalizationContext;

  constructor(props) {
    super(props);
    this.state = {
      currentSnapPoint: 1,
      handicappedFilter: this.props.route.params.handicappedFilter,
    };

    if (this.state.handicappedFilter) {
      this.viewModel.toggleHandicappedFilter();
    }

    this.viewModel.parseStopsData(
      this.props.route.params.routeItem,
      this.props.route.params.initialCoords);

  }

  componentWillUnmount() {
    this.viewModel.stopAnimation();
  }

  onStopPress = (stopID) => {
    this.viewModel.requestETADataOfAStop(stopID);
  }

  getPolylineColor(way, index) {
    const filtered = this.viewModel.jsRoute.ways.filter((item) => !!item.geolocations);
    return filtered[0] === way ? Colors.fromGreen : Colors.toBlue;
  }

  expandPanel = () => {
    this.panelRef.snapTo({ index: 0 });
    this.setState({ currentSnapPoint: 0 });
  }

  collapsePanel = () => {
    this.panelRef.snapTo({ index: 1 });
  }

  calculateInterectableViewInitialPosition = () => {
    const compensation = screenHeight * 0.01;

    return screenHeight
       - clickablePanelHeaderHeight
       - compensation;
  }

  calculateInterectableViewBoundaries = () => {
    return interectableUpperViewBoundary;
  }

  viewModel = new ViewModel(this);

  zoomInMap = () => {
    if (this.viewModel.jsRegion.longitudeDelta >= 0.0003) {
      this.viewModel.zoomInRegion();
      this.refs.mapView.animateToRegion(this.viewModel.jsRegion);
    }
  }

  zoomOutMap = () => {
    if (this.viewModel.jsRegion.longitudeDelta <= 20) {
      this.viewModel.zoomOutRegion();
      this.refs.mapView.animateToRegion(this.viewModel.jsRegion);
    }
  }

  openMapLink = (start, end) => {
    const { translations } = this.context;
    return showLocation({
      latitude: end.latitude,
      longitude: end.longitude,
      sourceLatitude: start.latitude, // optionally specify starting location for directions
      sourceLongitude: start.longitude, // not optional if sourceLatitude is specified
      googleForceLatLon: false, // optionally force GoogleMaps to use the latlon for the query instead of the title
      alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari
      dialogTitle: translations.mapLink.dialogTitle,
      dialogMessage: translations.mapLink.dialogMessage,
      cancelText: translations.general.cancel,
    });
  };

  renderStopView = (stopType) => {
    if (stopType === 1) {
      return (
            <Image style={{ width: 15, height: 15 }} source={Assets.metroStopIcon} />
      );
    } else {
      return (
        <Image style={{ width: 15, height: 15 }} source={Assets.busStopIcon} />
      );
    }
  };

  render() {
    const { translations, appLanguage } = this.context;
    const firstItem = this.viewModel.route.ways.find(
      way => isRouteType(way.type)
    );
    const secondItem = this.viewModel.route.ways.find(
      way => isRouteType(way.type) && way.routeId !== firstItem.routeId);

    return (
      <View style={styles.flex1}>
        <StatusBar
          translucent
          backgroundColor={Colors.black}
          barStyle={'dark-content'}
        />
        <ETAModal
          hideBottomButtons
          loadingETAs={this.viewModel.loadingETAs}
          data={this.viewModel.etaDataOfOneStop}
          activeStop={this.viewModel.activeStop}
          closeETAModal={this.viewModel.closeETAModal}
          onSetFavoriteStop={this.viewModel.onSetFavoriteStop}
        />
        <Map
          ref='mapView'
          initialRegion={this.viewModel.jsRegion}
          onRegionChangeComplete={this.viewModel.setRegion}
          zoomInMap={this.zoomInMap}
          zoomOutMap={this.zoomOutMap}
          minusButtonStyle={styles.mapZoomOut}
          animatedVehicles={this.viewModel.animatedVehicles}
          showHandicappedMarkers={this.viewModel.showHandicappedMarkers}
          renderPolyLines={
            this.viewModel.jsRoute.ways.map((way, index) => {
              let isHandicated = false;
              if(this.viewModel.jsRoute?.ways?.length >= (index + 1)) {
                isHandicated = this.viewModel.jsRoute?.ways[index + 1]?.handicapped;
              }
              if(this.viewModel.jsRoute?.ways?.length >= (index - 1) && this.viewModel.jsRoute?.ways?.length === (index + 1)) {
                isHandicated = this.viewModel.jsRoute?.ways[index - 1]?.handicapped;
              }
              return (
                <View>
                  <If condition={way.geolocations}>
                    <Polyline
                      key={Math.random()}
                      strokeWidth={3.5}
                      coordinates={way.geolocations}
                      strokeColor={this.getPolylineColor(way, index)}
                    />
                  </If>
                  <If condition={way.startGeolocation}>
                    <Marker anchor={{ x: 0.5, y: 0.5 }}
                      tracksViewChanges={false}
                      coordinate={way.startGeolocation}
                    >
                      <Image
                        style={{marginTop: 50}}
                        source={isHandicated ? Assets.humanIconHendicate : Assets.humanIcon}
                      />
                    </Marker>
                    <Polyline
                      key={Math.random()}
                      strokeWidth={1.5}
                      coordinates={[way.startGeolocation, way.endGeolocation]}
                      lineDashPattern={[5, 5]}
                      strokeColor={Colors.darkGrey}
                    />
                  </If>
                </View>
              );
            })
          }
          renderStops={
            <TogglingStops
              showStops
              routesDataSet={[this.viewModel.jsRoute]}
              showSelectRouteOnly={false}
              zoomThreadhold={13}
              regionToReactTo={this.viewModel.jsRegion}
              routeIdToReactTo='0'
              renderStopView={this.renderStopView}
              onStopPress={this.onStopPress}
            />
          }
          renderMarkers={
            <View>
              <Marker
                tracksViewChanges={false}
                coordinate={this.viewModel.startPointMarker}
                onPress={
                  this.viewModel.startPoint.stopId ?
                    () => this.onStopPress(this.viewModel.startPoint.stopId) :
                    null
                }
              >
                <Image
                  style={styles.endPointsIcon}
                  source={this.viewModel.startPoint.stopId ?
                    Assets.aPointIcon : Assets.aPointIcon}
                />
              </Marker>
              <Marker
                tracksViewChanges={false}
                coordinate={this.viewModel.endPointMarker}
                onPress={this.viewModel.endPoint.stopId ?
                  () => this.onStopPress(this.viewModel.endPoint.stopId) :
                  null}
              >
                <Image
                  source={endWayPointIcon(this.viewModel.endPoint, appLanguage)}
                  style={styles.endPointsIcon}
                />
              </Marker>
            </View>
          }
        />
        <TouchableOpacity
          style={[styles.backButton, { top: backButtonTop }]}
          onPress={this.props.navigation.goBack}
        >
          <Image source={Assets.backButtonIcon} />
        </TouchableOpacity>
        <If condition={this.state.handicappedFilter}>
          <TouchableOpacity
            style={[styles.handicappedContainer]}
            onPress={this.viewModel.toggleHandicappedFilter}
          >
            <View
              style={this.viewModel.showHandicappedMarkers ?
                [styles.disabledContainer, styles.active] : styles.disabledContainer}
            >
              <Image
                source={Assets.disabledIcon}
              />
            </View>
          </TouchableOpacity>

        </If>
        <Interactable.View
          ref={(r) => { this.panelRef = r; }}
          style={styles.interactableContainer}
          verticalOnly
          snapPoints={[
            { y: interectableUpperViewBoundary },
            { y: this.calculateInterectableViewInitialPosition() },
          ]}
          boundaries={{ top: interectableUpperViewBoundary }}
          initialPosition={{ y: this.calculateInterectableViewInitialPosition() }}
        >
          <TouchableWithoutFeedback
            underlayColor={Colors.lightGrey}
            style={[
              styles.touchableContainer,
              styles.transportInfoContainer,
              { height: clickablePanelHeaderHeight },
            ]}
            onPress={() => {
              const snapPtNow = this.state.currentSnapPoint;
              if (snapPtNow === 1) {
                this.expandPanel();
              } else {
                this.collapsePanel();
              }
            }}
          >
            <View
              style={
                [styles.touchableContainer,
                  { height: clickablePanelHeaderHeight },
                ]
              }
            >
              <View style={styles.transportInfoContainer}>
                <Row style={{alignItems: 'center'}}>
                  <VehicleIcon type={firstItem.type} platformizedTint='black' />
                  <Text bold style={styles.titleText}>
                    {getRouteAbbrev(firstItem.type, appLanguage)} {firstItem.name}
                  </Text>
                  <View style={styles.stopsCountContainer}>
                    <Text bold inverted style={[styles.secondaryText, styles.stopsCount]}>
                      {firstItem.stopStations.length} {translations.home.routeList.stops}
                    </Text>
                  </View>
                  <If condition={firstItem.handicapped}>
                    <Image source={Assets.disabillityIconGreen} style={styles.disabledIcon} />
                  </If>
                  <If condition={!!secondItem}>
                    <Image source={Assets.arrowToRightIcon} style={styles.arrowIcon} />
                    <VehicleIcon type={secondItem.type} platformizedTint='black' />
                    <Text bold style={styles.titleText}>
                      {getRouteAbbrev(secondItem.type)} {secondItem.name}
                    </Text>
                    <View style={styles.stopsCountContainer}>
                      <Text bold inverted style={[styles.secondaryText, styles.stopsCount]}>
                        {!!secondItem.stopStations
                    && secondItem.stopStations.length} {translations.home.routeList.stops}
                      </Text>
                    </View>
                    <If condition={secondItem.handicapped}>
                      <Image source={Assets.disabillityIconGreen} style={styles.disabledIcon} />
                    </If>
                  </If>
                </Row>
                <Row style={styles.transportInfoRow}>
                  <TitledText
                    title={translations.home.routeList.distance}
                    text={`${this.viewModel.route.totalDistance.toFixed(2)} ${translations.home.routeList.kilometres}`}
                  />
                  <TitledText
                    title={translations.home.routeList.totalFare}
                    text={`${this.viewModel.route.totalPrice} ${translations.home.routeList.UAH}`}
                  />
                  <TitledText
                    title={translations.home.routeList.inTheWay}
                    text={`${this.viewModel.route.totalTime} ${translations.home.routeList.minutes}`}
                  />
                </Row>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.paddingHorizontal20,
              styles.middleContentWrap,
            ]}
          >
            <Divider />
            <ScrollView
              style={[styles.flatList, { paddingTop: 20, height: minScrollViewHeight + 120 }]}
            >
              <For
                each='item'
                of={this.viewModel.route.ways}
                index='index'
              >
                <ListItem
                  data={this.viewModel.route.ways}
                  way={item}
                  appLanguage={appLanguage}
                  startPoint={this.props.route.params.startPoint}
                  endPoint={this.props.route.params.endPoint}
                  index={index}
                  translations={translations}
                  firstItemId={firstItem.routeId}
                  openMapLinkPress={this.openMapLink}
                />
              </For>
              <View style={{ height: 50 }} />
            </ScrollView>
          </View>
          <View
            style={[styles.interactableBottomPad,
              { height: scrollViewBotttomDummyHeight }]}
          />
        </Interactable.View>
        <Toast
          ref='toastRef'
          fadeInDuration={350}
          fadeOutDuration={1000}
          opacity={0.8}
          positionValue={150}
        />
      </View>
    );
  }
}
