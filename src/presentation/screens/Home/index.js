import Geolocation from 'react-native-geolocation-service';
import React from 'react';
import Toast from 'react-native-easy-toast';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { observer } from 'mobx-react';
import Modal from 'react-native-modalbox';
import SmallModal from 'react-native-modal';
import { Polyline } from 'react-native-maps';
import {
  Button,
  ClickableIcon,
  ETAModal,
  LoaderView,
  Map,
  Row,
  SearchTopPanel,
  StopItem,
  Text,
  TextInput,
  TogglingStops,
  VerticalDots,
} from '../../components';
import { AutocompleteTypes, Errors, Languages, PermissionTypes } from '../../../enums';
import { getName, getVehicleColor } from '../../../utils';
import * as Assets from '../../assets';
import {
  AllRoutesStore,
  PermissionsStore,
  PushNotificationsStore,
  StopsStore,
  TipsStore,
} from '../../../stores';
import { LocalizationContext } from '../../../services';
import {
  activeTrackedRouteAtoB,
  activeTrackedRouteBtoA,
  black,
  greyBackground,
} from '../../../presentation/styles/colors';
import ViewModel from './viewModel';
import styles from './styles';
import { ClickableListItem, FadeInView, FavoriteStop, FilterButton, RouteList } from './components';

const TOP = 'top';
const BOTTOM = 'bottom';

@observer
export class HomeScreen extends React.Component {
  static contextType = LocalizationContext;

  constructor(props) {
    super(props);
    this.state = {
      modalOpened: false,
      textInputFromFocused: false,
      showUserLocationPin: false,
      textInputToFocused: false,
      displayAllLikedStops: false,
      displayRoutesList: false,
      showTips: true,
      tipShown: TipsStore.firstPageTip,
    };
  }

  componentDidMount() {
    if (
      PushNotificationsStore.isFirstLaunch &&
      this.state.showTips &&
      this.state.tipShown === 2) {
      this.setState({ modalOpened: true });
    }
    PermissionsStore.requestPermission(
      PermissionTypes.LOCATION,
      this.viewModel.setShowUserLocation,
      () => {
      },
    );
    if (this.props.route.params && this.props.route.params.stopId) {
      this.viewModel.setChosenRoute('');
      const stop = StopsStore.stops.find((item) => item.id === this.props.route.params.stopId);
      if (stop) {
        this.viewModel.setRegion({
          latitude: stop.geolocation.latitude,
          longitude: stop.geolocation.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      }
      setTimeout(() => {
        this.onStopPress(this.props.route.params.stopId);
        this.props.navigation.setParams({ stopId: undefined });
      }, 200);
    }
    this.viewModel.setAppLang(this.context.appLanguage);
  }

  componentDidUpdate() {
    if (this.viewModel.callToast === true) {
      this.callToast(this.viewModel.error);
      this.viewModel.toggleToast();
    }
  }

  componentWillUnmount() {
    this.viewModel.stopAnimation();
    TipsStore.setFirstPageTip(this.state.tipShown + 1);
  }

  onStopPress = (stopID) => {
    const { translations } = this.context;
    this.viewModel.requestETADataOfAStop(stopID, translations);
  };

  onRouteSelectionChanged = (route) => {
    this.viewModel.setChosenRoute(route.id);
    const geolocation = this.viewModel.getValidGeolocation(route);
    if (geolocation) this.refs.mapView.animateToRegion(geolocation);
  };

  onAutocompleteItemPress = (item) => {
    if (this.state.textInputFromFocused) {
      this.viewModel.setSearchInputFrom(item.name, false);
      this.viewModel.setSearchFromCoords(item.lat, item.lon);
      if (!this.viewModel.searchToCoords.latitude) {
        this.refs.textInputTo.focus();
      }
    } else if (this.state.textInputToFocused) {
      this.viewModel.setSearchInputTo(item.name, false);
      this.viewModel.setSearchToCoords(item.lat, item.lon);
      if (!this.viewModel.searchFromCoords.latitude) {
        this.refs.textInputFrom.focus();
      }
    }
  };

  setStopAsFrom = (name, id) => {

    this.viewModel.setStopAsFrom(name, id);
    if (this.viewModel.showSearchRoutesButton) {
      this.setState({ modalOpened: true, displayRoutesList: false });
    }
  };

  setStopAsTo = (name, id) => {
    this.viewModel.setStopAsTo(name, id);
    if (this.viewModel.showSearchRoutesButton) {
      this.setState({ modalOpened: true, displayRoutesList: false });
    }
  };

  setFavoriteStopAsPath = (item) => {
    if (this.state.textInputFromFocused) {
      this.setStopAsFrom(getName(item, this.context.appLanguage), item.id);
    } else {
      this.setStopAsTo(getName(item, this.context.appLanguage), item.id);
    }
  };

  callToast = (e) => {
    this.refs.toastRef.show(
      e,
      2000,
    );
  };


  viewModel = new ViewModel(this);

  grantedCallback = () => {
    this.viewModel.setShowUserLocation();
    this.animateToUserLocation();
  };

  blockedCallback = () => {
    const { translations } = this.context;

    if (this.state.showUserLocationPin) {
      this.refs.mapView.animateToRegion({
        latitude: 48.46905218988482,
        longitude: 35.04738936200738,
        latitudeDelta: 0.012,
        longitudeDelta: 0.003,
      });
    } else {
      Alert.alert(
        translations.home.locationAlertTitle,
        translations.home.locationAlertText,
        [
          { text: translations.general.ok },
        ],
      );
    }
  };

  animateToUserLocation = async () => {
    if (this.viewModel.showUserLocation) {
      await Geolocation.getCurrentPosition(
        (position) => {
          this.viewModel.setUserRegion(position);
          this.refs.mapView.animateToRegion(this.viewModel.userRegion);
        },
      );
      this.viewModel.setShowUserLocation();
    } else {
      PermissionsStore.requestPermission(
        PermissionTypes.LOCATION,
        this.grantedCallback,
        this.blockedCallback,
      );
    }
  };

  useUserLocation = async () => {
    if (this.viewModel.showUserLocation) {
      await Geolocation.getCurrentPosition(
        (position) => {
          if (this.state.textInputFromFocused) {
            this.viewModel.fetchAddress(position.coords.latitude, position.coords.longitude)
              .then(({ data }) => {
                this.viewModel.setSearchInputFrom(
                  data.address === '' ? Errors.NOT_FOUND : data.address, false,
                );
                this.viewModel.setSearchFromCoords(
                  position.coords.latitude,
                  position.coords.longitude,
                );
                if (!this.viewModel.searchToCoords.latitude) {
                  this.refs.textInputTo.focus();
                }
              });
          } else if (this.state.textInputToFocused) {
            this.viewModel.fetchAddress(position.coords.latitude, position.coords.longitude)
              .then(({ data }) => {
                this.viewModel.setSearchInputTo(
                  data.address === '' ? Errors.NOT_FOUND : data.address, false,
                );
                this.viewModel.setSearchToCoords(
                  position.coords.latitude,
                  position.coords.longitude,
                );
                if (!this.viewModel.searchFromCoords.latitude) {
                  this.refs.textInputFrom.focus();
                }
              });
          }
        },
      );
    } else {
      PermissionsStore.requestPermission(
        PermissionTypes.LOCATION,
        this.grantedCallback,
        this.blockedCallback,
      );
    }
  };

  zoomInMap = () => {
    if (this.viewModel.jsRegion.longitudeDelta >= 0.0003) {
      this.viewModel.zoomInRegion();
      this.refs.mapView.animateToRegion(this.viewModel.jsRegion);
    }
  };

  zoomOutMap = () => {
    if (this.viewModel.jsRegion.longitudeDelta <= 20) {
      this.viewModel.zoomOutRegion();
      this.refs.mapView.animateToRegion(this.viewModel.jsRegion);
    }
  };

  openMapWithUserLocationPin = () => {
    this.setState({ showUserLocationPin: true, modalOpened: false }, () => {
      if ((this.state.textInputFromFocused && !this.viewModel.searchFromCoords.latitude)
        || (this.state.textInputToFocused && !this.viewModel.searchFromCoords.latitude)) {
        this.animateToUserLocation();
      }
    });
  };

  applyLocationFromPin = (region) => {
    const { translations } = this.context;
    if (this.state.textInputFromFocused) {
      this.viewModel.fetchAddress(region.latitude, region.longitude)
        .then(({ data }) => {
          if (!data.address || data.address.length < 5) {
            this.callToast(translations.errors.validAddress);
            this.viewModel.setSearchInputFrom('');
          } else {
            this.viewModel.setSearchInputFrom(data.address, false);
            this.viewModel.setSearchFromCoords(
              region.latitude,
              region.longitude,
            );
            if (!this.viewModel.searchToCoords.latitude) {
              this.refs.textInputTo.focus();
            }
          }
        })
        .catch(() => this.callToast(translations.errors.validAddress));
    } else if (this.state.textInputToFocused) {
      this.viewModel.fetchAddress(region.latitude, region.longitude)
        .then(({ data }) => {
          if (!data.address || data.address.length < 5) {
            this.callToast(translations.errors.validAddress);
            this.viewModel.setSearchInputTo('');
          } else {
            this.viewModel.setSearchInputTo(data.address, false);
            this.viewModel.setSearchToCoords(
              region.latitude,
              region.longitude,
            );
            if (!this.viewModel.searchFromCoords.latitude) {
              this.refs.textInputFrom.focus();
            }
          }
        })
        .catch(() => this.callToast(translations.errors.validAddress));
    }
  };

  tipsDisplayStatus = () => {
    if (this.state.tipShown === 1) {
      this.setState({ tipShown: 2, modalOpened: true });
    } else if (this.state.tipShown === 2) {
      this.setState({ tipShown: 3, modalOpened: false });
      if (this.viewModel.stopsForDisplaying.length) {
        this.refs.mapView.animateToRegion({
          latitude: this.viewModel.stopsForDisplaying[0].geolocation.latitude,
          longitude: this.viewModel.stopsForDisplaying[0].geolocation.longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.003,
        });
      }
    } else if (this.state.tipShown < 7) {
      this.setState({ tipShown: this.state.tipShown + 1 });
    } else {
      this.setState({ showTips: false });
    }
  };

  tipStyle = (viewPosition, trianglePosition) => {
    if (viewPosition === BOTTOM) {
      return { justifyContent: 'flex-end' };
    } else if (viewPosition === TOP && trianglePosition === BOTTOM) {
      return { justifyContent: 'center' };
    } else {
      return { justifyContent: 'flex-start' };
    }
  };

  generateTip = () => {
    const { translations } = this.context;
    switch (this.state.tipShown) {
      case 1:
        return this.renderTip(
          translations.home.tipsList.firstTip,
          TOP, TOP, { marginTop: 170, marginLeft: '47%' },
        );

      case 2:
        return this.renderTip(
          translations.home.tipsList.secondTip,
          TOP, TOP, { marginLeft: '47%', marginTop: 200 }, true,
        );

      case 3:
        return this.renderTip(
          translations.home.tipsList.thirdTip,
          TOP, BOTTOM, { marginLeft: '47%', marginTop: -1 },
        );

      case 4:
        return this.renderTip(
          translations.home.tipsList.fourthTip,
          BOTTOM, BOTTOM, { marginBottom: -10, marginLeft: '24%' },
        );

      case 5:
        return this.renderTip(
          translations.home.tipsList.fifthTip,
          BOTTOM, BOTTOM, { marginBottom: -10, marginLeft: '68%' },
        );

      case 6:
        return this.renderTip(
          translations.home.tipsList.sixthTip,
          BOTTOM, BOTTOM, { marginBottom: -10, marginLeft: '90%' },
        );

      default:
        return;
    }
  };

  renderRouteItem = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      style={[styles.routeContainer, { borderColor: getVehicleColor(item.type) },
        (this.viewModel.chosenRoute.indexOf(item.id) !== -1) && { borderColor: 'transparent', backgroundColor: getVehicleColor(item.type) }]}
      onPress={() => {
        const { chosenRoute } = this.viewModel;
        if (chosenRoute.indexOf(item.id) !== -1) {
          this.viewModel.unsetChosenRoute(item.id);
        } else {
          this.onRouteSelectionChanged(item);
        }
      }}
    >
      <Text
        style={this.viewModel.chosenRoute.indexOf(item.id) !== -1 ?
          [styles.routeContainerText, styles.routeContainerTextDark]
          : styles.routeContainerText}
      >
        {item.number && item.number.trim()}
      </Text>
    </TouchableOpacity>
  );

  renderSearchBar = () => (
    <View
      style={
        this.state.modalOpened || this.state.showUserLocationPin ?
          styles.floatingTextInputsModal : styles.floatingTextInputs
      }
    >
      <If condition={this.state.modalOpened || this.state.showUserLocationPin}>
        <Row style={styles.modalHeader}>
          <ClickableIcon
            onPress={
              () => {
                if (this.state.showUserLocationPin) {
                  this.setState({ modalOpened: true, showUserLocationPin: false });
                } else {
                  this.setState({ modalOpened: false, displayAllLikedStops: false });
                }
              }
            }
            imageSource={Assets.backButtonLightIcon}
            style={{ paddingVertical: 10, paddingRight: 10 }}
          />
          <If condition={this.viewModel.isSuburbanFilterVisible}>
            <FilterButton
              title={this.context.translations.home.suburban}
              isActive={this.viewModel.subUrbanFilter}
              onPress={() => this.viewModel.toggleSuburbanFilter(this.state.displayRoutesList)}
            />
          </If>
        </Row>
      </If>
      <Row style={styles.flex1}>
        <VerticalDots
          lang={this.viewModel._appLang}
          smallDotsCount={3}
          modalMode={this.state.modalOpened || this.state.showUserLocationPin}
        />
        <View style={styles.textInputContainer}>
          <TextInput
            withOutTitle
            ref='textInputFrom'
            lightMode={this.state.modalOpened || this.state.showUserLocationPin}
            innerStyle={[
              styles.textInput, styles.textInputFirst,
              this.state.modalOpened || this.state.showUserLocationPin ? styles.colorWhite : {},
            ]}
            onPress={
              !this.state.modalOpened && !this.state.showUserLocationPin ? async () => {
                this.viewModel.stopAnimation();
                this.viewModel.closeETAModal();
                if (PushNotificationsStore.isFirstLaunch && this.state.showTips) {
                  this.tipsDisplayStatus();
                  return;
                }

                await this.setState({ modalOpened: true, showUserLocationPin: false });
                if (!this.viewModel.searchFromCoords.latitude) {
                  this.refs.textInputFrom.focus();
                } else if (!this.viewModel.searchToCoords.latitude) {
                  this.refs.textInputTo.focus();
                }
              }
                : false
            }
            rightIcon={
              this.state.modalOpened || this.state.showUserLocationPin ? Assets.deleteIcon : null
            }
            onRightIconPress={() => {
              this.setState({ displayRoutesList: false });
              this.viewModel.setSearchInputFrom('');
              this.viewModel.clearAutocomplete();
              if (!this.state.showUserLocationPin) {
                this.refs.textInputFrom.focus();
              }
            }}
            value={this.viewModel.searchInputFrom}
            editable={this.state.modalOpened && !this.state.showUserLocationPin}
            onChangeText={(text) => {
              this.setState({ displayRoutesList: false });
              this.viewModel.setSearchInputFrom(text);
            }}
            onFocus={() => {
              this.setState({ textInputFromFocused: true, textInputTo: false });
              this.viewModel.clearAutocomplete();
            }}
            style={!this.viewModel.searchInputFrom.length && !this.state.modalOpened &&
              !this.state.showUserLocationPin && { marginTop: 7 }}
          />
          <TextInput
            withOutTitle
            ref='textInputTo'
            lightMode={this.state.modalOpened || this.state.showUserLocationPin}
            withoutDivider
            innerStyle={[
              styles.textInput,
              this.state.modalOpened || this.state.showUserLocationPin ? styles.colorWhite : {},
            ]}
            style={!this.state.modalOpened && !this.state.showUserLocationPin
            && Platform.OS === 'ios' ? { marginTop: 15 } : { marginTop: 10 }}
            onPress={
              !this.state.modalOpened && !this.state.showUserLocationPin ? async () => {
                this.viewModel.stopAnimation();
                this.viewModel.closeETAModal();
                if (PushNotificationsStore.isFirstLaunch && this.state.showTips) {
                  this.tipsDisplayStatus();
                  return;
                }

                await this.setState({ modalOpened: true, showUserLocationPin: false });
                if (!this.viewModel.searchToCoords.latitude) {
                  this.refs.textInputTo.focus();
                } else if (!this.viewModel.searchFromCoords.latitude) {
                  this.refs.textInputFrom.focus();
                }
              }
                : false
            }
            rightIcon={
              this.state.modalOpened || this.state.showUserLocationPin ? Assets.deleteIcon : null
            }
            onRightIconPress={() => {
              this.setState({ displayRoutesList: false });
              this.viewModel.setSearchInputTo('');
              this.viewModel.clearAutocomplete();
              if (!this.state.showUserLocationPin) {
                this.refs.textInputTo.focus();
              }
            }}
            value={this.viewModel.searchInputTo}
            editable={this.state.modalOpened && !this.state.showUserLocationPin}
            onChangeText={(text) => {
              this.setState({ displayRoutesList: false });
              this.viewModel.setSearchInputTo(text);
            }}
            onFocus={() => {
              this.setState({ textInputToFocused: true, textInputFromFocused: false });
              this.viewModel.clearAutocomplete();
            }}
          />
        </View>
        <ClickableIcon
          style={[
            styles.swapIcon,
            !this.state.modalOpened && !this.state.showUserLocationPin &&
            Platform.OS === 'ios' && { marginTop: 10 },
          ]}
          onPress={() => {
            this.setState({ displayRoutesList: false });
            this.viewModel.swapSearchValues();
          }}
          imageSource={
            this.state.modalOpened || this.state.showUserLocationPin ?
              Assets.swapIconDark : Assets.swapIcon
          }
        />
      </Row>
      <If condition={this.state.modalOpened || this.state.showUserLocationPin}>
        <Row style={styles.modalHeader}>
          <View />
          <Row style={{ marginLeft: 20 }}>
            <FilterButton
              position='left'
              title={this.context.translations.home.cheapest}
              isActive={this.viewModel.cheapestFilter}
              onPress={this.viewModel.toggleCheapestFilter}
            />
            <FilterButton
              position='right'
              title={this.context.translations.home.speed}
              isActive={this.viewModel.speedFilter}
              onPress={this.viewModel.toggleSpeedFilter}
            />
          </Row>
          <ClickableIcon
            imageStyle={{ tintColor: this.viewModel.disabledFilter ? '#ffffff' : '#061040' }}
            imageSource={Assets.disabledIcon}
            style={this.viewModel.disabledFilter ?
              [styles.disabledFilterContainer, styles.activeFiler] : styles.disabledFilterContainer}
            onPress={this.viewModel.toggleDisabledFilter}
          />
        </Row>
      </If>
    </View>
  );

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

  renderStartStopFlag = () => {
    return (
      <Image source={Assets.aPointIcon} />
    );
  };

  renderEndStopFlag = () => {
    const isEnglish = this.context.appLanguage === Languages.EN;
    return (
      <Image source={isEnglish ? Assets.bPointIconEng : Assets.bPointIcon} />
    );
  };

  renderTip = (text, viewPosition, trianglePosition, style, coverScreen = false) => (
    <SmallModal
      isVisible={this.state.showTips}
      onBackdropPress={this.tipsDisplayStatus}
      style={this.tipStyle(viewPosition, trianglePosition)}
      backdropOpacity={0}
      coverScreen={coverScreen}
    >
      <If condition={trianglePosition === TOP}>
        <View style={[styles.tipsTriangle, style]} />
      </If>
      <If condition={trianglePosition === BOTTOM && viewPosition === TOP}>
        <View style={{ marginBottom: '-25%' }} />
      </If>
      <View style={styles.tipsContainer}>
        <Text inverted bold center>{text}</Text>
      </View>
      <If condition={trianglePosition === BOTTOM}>
        <View style={[styles.tipsTriangle, { transform: [{ rotate: '180deg' }] }, style]} />
      </If>
    </SmallModal>
  );

  render() {
    return (
      <View style={styles.flex1}>
        <StatusBar
          translucent
          backgroundColor={black}
          barStyle={!this.state.modalOpened && Platform.OS === 'ios' ?
            'dark-content' : 'light-content'}
        />
        <SearchTopPanel
          isTransparent
          roundedBottom
          shadow={false}
          renderContentView={this.renderSearchBar()}
        />
        <Modal
          ref='modal'
          swipeToClose={false}
          keyboardTopOffset={0}
          isOpen={this.state.modalOpened}
          onClosed={() => {
            this.setState({ modalOpened: false });
            if (this.viewModel.chosenRoute && !this.state.showUserLocationPin) {
              if (this.viewModel.chosenRoute) {
                this.viewModel.setRoutes(this.viewModel.chosenRoute);
              }
            }
          }}
          backdropPressToClose={false}
          position='top'
        >
          <Choose>
            <When
              condition={
                this.viewModel.showAutocomplete && !this.viewModel.showSearchRoutesButton &&
                ((this.state.textInputFromFocused && this.viewModel.searchInputFrom.length > 1)
                  || (this.state.textInputToFocused && this.viewModel.searchInputTo.length > 1))
              }
            >
              <FlatList
                data={[
                  ...this.viewModel.autocompleteSearchList[0],
                  ...this.viewModel.autocompleteSearchList[1],
                ]}
                style={[
                  styles.streetsListContainer,
                  { paddingRight: 20 },
                  this.viewModel.routesList.length > 0 && { backgroundColor: greyBackground },
                ]}
                scrollEventThrottle={20}
                keyExtractor={(item, index) => `Autocomplete ${index} ${item.type}`}
                renderItem={({ item }) =>
                  (<ClickableListItem
                    text={item.name}
                    withoutDivider
                    onPress={() => this.onAutocompleteItemPress(item)}
                    imageSource={item.type === AutocompleteTypes.STOP ? Assets.busStopListIcon : Assets.placeMarkerIcon}
                    style={item.type === AutocompleteTypes.STOP ? {} : { paddingLeft: 5 }}
                  />)
                }
              />
            </When>
            <When
              condition={this.viewModel.routesList.length > 0 && this.state.displayRoutesList}
            >
              <RouteList
                handicappedFilter={this.viewModel.disabledFilter}
                data={this.viewModel.routesList}
                disabled={this.viewModel.disabledFilter}
                cheapest={this.viewModel.cheapestFilter}
                navigation={this.props.navigation}
                startPoint={this.viewModel.searchInputFrom}
                endPoint={this.viewModel.searchInputTo}
                initialCoords={[this.viewModel.searchFromCoords, this.viewModel.searchToCoords]}
              />
            </When>
            <Otherwise>
              <ScrollView
                style={[
                  styles.streetsListContainer,
                  this.viewModel.routesList.length > 0 && { backgroundColor: greyBackground },
                ]}
              >
                <Choose>
                  <When
                    condition={
                      this.state.textInputFromFocused && this.viewModel.searchInputFrom.length < 2
                      || this.state.textInputToFocused && this.viewModel.searchInputTo.length < 2
                    }
                  >
                    <ClickableListItem
                      text={this.context.translations.home.useUserLocation}
                      imageSource={Assets.locationIcon}
                      onPress={this.useUserLocation}
                    />
                    <ClickableListItem
                      text={this.context.translations.home.setUserLocation}
                      imageSource={Assets.pinIcon}
                      imageStyle={{ marginLeft: 2, marginRight: 18 }}
                      onPress={this.openMapWithUserLocationPin}
                    />
                    <If condition={this.viewModel.favoriteStops}>
                      <For
                        each='item'
                        of={this.viewModel.favoriteStops}
                        index="index"
                      >
                        <FavoriteStop
                          index={index}
                          item={item}
                          appLanguage={this.context.appLanguage}
                          text={this.context.translations.home.viewAll}
                          displayAllLikedStops={this.state.displayAllLikedStops}
                          onStopPress={() => this.setFavoriteStopAsPath(item)}
                          onShowAllPress={() => this.setState({ displayAllLikedStops: true })}
                        />
                      </For>
                    </If>
                  </When>
                  <When condition={this.viewModel.loading}>
                    <LoaderView style={styles.loader} />
                  </When>
                  <When
                    condition={
                      !this.viewModel.loading && this.viewModel.routesList.length < 1
                      && this.state.displayRoutesList
                    }
                  >
                    <Text style={styles.errorText}>
                      {this.context.translations.emptyLists.routes}
                    </Text>
                  </When>
                </Choose>
              </ScrollView>
            </Otherwise>
          </Choose>
          <If
            condition={
              this.viewModel.showSearchRoutesButton && !this.state.displayRoutesList
            }
          >
            <Button
              filled
              style={styles.confirmPinUserLocationButton}
              title={this.context.translations.home.getDirections}
              onPress={() => {
                this.setState({ displayRoutesList: true });
                this.viewModel.searchRoutes(this.context.translations);
              }}
            />
          </If>
        </Modal>
        <ETAModal
          hideBottomButtons={false}
          loadingETAs={this.viewModel.loadingETAs}
          data={this.viewModel.etaDataOfOneStop}
          activeStop={this.viewModel.activeStop}
          closeETAModal={this.viewModel.closeETAModal}
          onSetFavoriteStop={this.viewModel.onSetFavoriteStop}
          setFromPress={this.setStopAsFrom}
          setToPress={this.setStopAsTo}
        />
        <FadeInView style={styles.flex1}>
          <Map
            ref='mapView'
            withGps
            showsUserLocation={this.viewModel.showUserLocation}
            initialRegion={this.viewModel.jsRegion}
            onRegionChangeComplete={this.viewModel.setRegion}
            animateToUserLocation={this.animateToUserLocation}
            zoomInMap={this.zoomInMap}
            zoomOutMap={this.zoomOutMap}
            animatedVehicles={this.viewModel.animatedVehicles}
            mapPadding={
              this.viewModel.jsTogglingPolylines.length > 0 && !this.state.showUserLocation
              && !this.state.showUserLocationPin ? { bottom: 50 } : null
            }
            renderForwardPolyline={
              <If
                condition={
                  !this.state.showUserLocationPin
                }
              >
                <For
                  each="item"
                  of={this.viewModel.chosenRouteData}
                  index="i"
                >
                  <Polyline
                    key={'forward_polyline_' + i}
                    tappable
                    coordinates={item.forward.geolocation}
                    strokeColor={activeTrackedRouteAtoB}
                    strokeWidth={2}
                  />
                </For>
              </If>
            }
            renderBackwardPolyline={
              <If
                condition={
                  !this.state.showUserLocationPin
                }
              >
                <For
                  each="item"
                  of={this.viewModel.chosenRouteData}
                  index="i"
                >
                  <Polyline
                    key={'backward_polyline_' + i}
                    tappable
                    coordinates={item.backward.geolocation}
                    strokeColor={activeTrackedRouteBtoA}
                    strokeWidth={2}
                  />
                </For>
              </If>
            }
            renderStops={
              <Choose>
                <When
                  condition={
                    this.viewModel.chosenRoute.length === 0 && this.viewModel.showStops
                    && !this.state.showUserLocationPin && !this.state.modalOpened
                  }
                >
                  <For
                    each="item"
                    of={this.viewModel.stopsForDisplaying}
                    index="index"
                  >
                    <StopItem
                      key={item.id}
                      item={item}
                      activeId={this.viewModel.activeStop}
                      index={index}
                      onPress={() => {
                        this.onStopPress(item.id);
                      }}
                    />
                  </For>
                </When>
                <When condition={AllRoutesStore.trackCount > 0}>
                  <For
                    each="item"
                    of={this.viewModel.chosenRoute}
                    index="index"
                  >
                    <TogglingStops
                      key={item.id}
                      routesDataSet={AllRoutesStore.trackedRoutes}
                      showSelectRouteOnly
                      zoomThreadhold={13}
                      regionToReactTo={this.viewModel.jsRegion}
                      routeIdToReactTo={item}
                      renderStopView={this.renderStopView}
                      onStopPress={this.onStopPress}
                      renderStartStopFlag={this.renderStartStopFlag}
                      renderEndStopFlag={this.renderEndStopFlag}
                      activeRoute={item}
                      showStops={!this.state.showUserLocationPin && item}
                    />
                  </For>
                </When>
              </Choose>
            }
          />
        </FadeInView>
        <If condition={this.state.showUserLocationPin}>
          <View style={styles.markerFixed}>
            <Image source={Assets.flagPinIcon} />
          </View>
        </If>
        <If
          condition={
            this.viewModel.jsTogglingPolylines.length > 0 &&
            !this.state.showUserLocation && !this.state.showUserLocationPin
          }
        >
          <Row style={styles.floatingView}>
            <Image style={styles.eyeIcon} source={Assets.eyeIcon} />
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={this.viewModel.jsTogglingPolylines}
              keyExtractor={(__, index) => `Subscribe route ${index}`}
              renderItem={this.renderRouteItem}
            />
          </Row>
        </If>
        <If condition={this.state.showUserLocationPin}>
          <Button
            title={this.context.translations.general.ready}
            style={styles.confirmPinUserLocationButton}
            filled
            onPress={() => {
              this.setState({ modalOpened: true, showUserLocationPin: false });
              this.applyLocationFromPin(this.viewModel.region);
            }}
          />
        </If>
        <Toast
          ref='toastRef'
          fadeInDuration={350}
          fadeOutDuration={1000}
          opacity={0.8}
          positionValue={150}
        />
        <If condition={PushNotificationsStore.isFirstLaunch}>
          {this.generateTip()}
        </If>
      </View>
    );
  }
}
