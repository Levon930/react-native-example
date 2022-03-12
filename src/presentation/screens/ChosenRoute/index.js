import React from 'react';
import {Dimensions, Image, ScrollView, StatusBar, TouchableHighlight, TouchableOpacity, View,} from 'react-native';
import {observer} from 'mobx-react';
import SmallModal from 'react-native-modal';
import {ClickableIcon, Divider, ETAModal, LoaderView, Map, Row, Text, TogglingStops, VehicleIcon,} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';
import Interactable from 'react-native-interactable';
import {Polyline} from 'react-native-maps';
import Toast from 'react-native-easy-toast';
import {LocalizationContext} from 'services';
import {AllRoutesStore, PushNotificationsStore, TipsStore} from 'stores';
import * as Assets from 'assets';
import {Deltas, Languages, RouteDirections} from 'enums';
import {
    getCarrierAddress,
    getCarrierDirector,
    getCarrierName,
    getMessageTranslation,
    getName,
    getVehicleColor,
    isLongRoute
} from '../../../utils';
import * as Colors from '../../styles/colors';
import styles from './styles';
import ViewModel from './viewModel';
import {ClickableDirectionTab, TitledText} from './components';
import Modal from "react-native-modalbox";
import {VehicleTypes} from "../../../enums";

const screenHeight = Dimensions.get('window').height;
const interectableUpperViewBoundary = screenHeight * 0.13;
const backButtonTop = interectableUpperViewBoundary * 0.5 - 20;
const clickablePanelHeaderHeight = 125;
const scrollViewBotttomDummyHeight = interectableUpperViewBoundary + 10;

@observer
export class ChosenRouteScreen extends React.Component {
    static contextType = LocalizationContext;

    constructor(props) {
        super(props);
        //duplicating props into state because
        //updating root props on parent failed to see changes in this class
        this.state = {
            currentSnapPoint: 1,
            showWarningMessage: true,
            modalOpened: false,
            showTips: TipsStore.secondPageTip < 3,
            tipShown: TipsStore.secondPageTip,
        };

        minScrollViewHeight =
            screenHeight
            - interectableUpperViewBoundary
            - clickablePanelHeaderHeight
            - this.viewModel.panelMiddleContainerHeight;

        if (this.props.route.params.routeid) {
            this.viewModel.setRoutes([this.props.route.params.routeid]);

            this.viewModel.getRouteDetails(this.props.route.params.routeid)
                .then(() => {
                    if (this.getValidGeolocation(this.viewModel.jsRoute)) {
                        const geolocation = this.getValidGeolocation(this.viewModel.jsRoute);
                        // Moving the map to the middle of the chosen route
                        if (geolocation) this.refs.mapView.animateToRegion(geolocation);
                    }
                });
            setTimeout(() => this.viewModel.setRoutes([this.props.route.params.routeid]), 0);
        } else {
            if (this.getValidGeolocation(this.props.route.params.routeItem)) {
                const geolocation = this.getValidGeolocation(this.props.route.params.routeItem);
                // Moving the map to the middle of the chosen route
                if (geolocation) this.viewModel.setRegion(geolocation);
            }
            setTimeout(() => this.viewModel.setRoutes([this.props.route.params.routeItem.id]), 0);
            this.viewModel.parseStopsData(this.props.route.params.routeItem);
        }
    }

    componentDidUpdate() {
        const {translations} = this.context;
        if (this.viewModel.callToast === true) {
            this.refs.toastRef.show(
                translations.vehicle.toastCannotTrackMore,
                2000,
            );
            this.viewModel.toggleToast();
        }
    }

    componentWillUnmount() {
        this.viewModel.stopAnimation();
    }

    onStopRowListItemPressed = (itemId) => {
        this.collapsePanel();
        this.viewModel.requestETADataOfAStop(itemId);
    };

    onStopPress = (stopID) => {
        this.viewModel.requestETADataOfAStop(stopID);
    };

    getValidGeolocation = (route) => {
        if (!route) return;

        const newRegion = {
            latitudeDelta: Deltas.NORMAL_LATITUDE_DELTA,
            longitudeDelta: Deltas.NORMAL_LONGITUDE_DELTA,
            latitude: 48.466667,
            longitude: 35.016667,
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

    expandPanel = () => {
        this.panelRef.snapTo({index: 0});
        this.setState({currentSnapPoint: 0, showWarningMessage: false});
    };

    collapsePanel = () => {
        this.panelRef.snapTo({index: 1});
        this.setState({currentSnapPoint: 1});
    };

    calculateInterectableViewInitialPosition = () => {
        const compensation = screenHeight * 0.01;

        return screenHeight
            - clickablePanelHeaderHeight
            - compensation;
    };

    calculateInterectableViewBoundaries = () => {
        return interectableUpperViewBoundary;
    };

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

    renderTip = () => (
        <SmallModal
            isVisible={this.state.showTips}
            onBackdropPress={() => {
                if (this.state.tipShown === 1) this.setState({tipShown: 2});
                else this.setState({showTips: false, tipShown: 3});
                TipsStore.setSecondPageTip(this.state.tipShown + 1);
            }}
            style={{justifyContent: 'flex-end'}}
            backdropOpacity={0}
            coverScreen={false}
        >
            <View style={styles.tipsContainer}>
                <Text inverted bold center>
                    {
                        this.state.tipShown === 1 ?
                            this.context.translations.vehicle.tipsList.firstTip :
                            this.context.translations.vehicle.tipsList.secondTip
                    }
                </Text>
            </View>
            <View
                style={[styles.tipsTriangle, {marginLeft: this.state.tipShown === 1 ? '73%' : '87%'}]}
            />
        </SmallModal>
    );

    renderStopView = (stopType) => {
        if (stopType === 1) {
            return (
                <Image style={{width: 15, height: 15}} source={Assets.metroStopIcon}/>
            );
        } else {
            return (
                <Image style={{width: 15, height: 15}} source={Assets.busStopIcon}/>
            );
        }
    };

    renderStartStopFlag = () => {
        return (
            <Image source={Assets.aPointIcon}/>
        );
    };

    renderEndStopFlag = () => {
        const isEnglish = this.context.appLanguage === Languages.EN;
        return (
            <Image source={isEnglish ? Assets.bPointIconEng : Assets.bPointIcon}/>
        );
    };

    renderStops = () => {
        const route = this.viewModel.jsRoute;
        if(route?.backward) {
            route.backward.stops = route.backward.stops.filter(x => !route.forward.stops.find(y => y?.id === x?.id));
            route.backward.stops = route.backward.stops.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
            route.forward.stops = route.forward.stops.filter(x => !route.backward.stops.find(y => y?.id === x?.id));
            route.forward.stops = route.forward.stops.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        }

        if (this.viewModel.jsRoute) {
            return (
                <TogglingStops
                    routesDataSet={[route]}
                    showSelectRouteOnly={false}
                    zoomThreadhold={13}
                    showStops
                    regionToReactTo={this.viewModel.jsRegion}
                    routeIdToReactTo={this.viewModel.jsRoute.id}
                    renderStopView={this.renderStopView}
                    renderStartStopFlag={this.renderStartStopFlag}
                    renderEndStopFlag={this.renderEndStopFlag}
                    onStopPress={this.onStopPress}
                />
            );
        }
    };

    render() {
        const {routeItem, forwardFrom, forwardTo} = this.props.route.params;
        const _isFav = AllRoutesStore.isRouteFavorite(routeItem.id);
        const _isTracked = AllRoutesStore.isRouteSubscribed(routeItem.id);
        const {translations, appLanguage} = this.context;
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
                    renderForwardPolyline={
                        <If condition={_.get(this.viewModel.jsRoute, 'forward.geolocation[0].latitude')}>
                            <Polyline
                                key={`${routeItem.id} forward`}
                                tappable
                                strokeWidth={2}
                                coordinates={this.viewModel.jsRoute && this.viewModel.jsRoute.forward.geolocation}
                                strokeColor='#ABBFD6'
                            />
                        </If>
                    }
                    renderBackwardPolyline={
                        <If condition={_.get(this.viewModel.jsRoute, 'backward.geolocation[0].latitude')}>
                            <Polyline
                                key={`${routeItem.id} backward`}
                                tappable
                                strokeWidth={2}
                                coordinates={this.viewModel.jsRoute && this.viewModel.jsRoute.backward.geolocation}
                                strokeColor='#061040'
                            />
                        </If>
                    }
                    renderStops={this.renderStops()}
                />
                <TouchableOpacity
                    style={[styles.backButton, {top: backButtonTop}]}
                    onPress={this.props.navigation.goBack}
                >
                    <Image source={Assets.backButtonIcon}/>
                </TouchableOpacity>
                <If condition={routeItem.message && !this.state.showWarningMessage}>
                    <ClickableIcon
                        imageSource={Assets.warningIcon}
                        style={[styles.warningButton, {top: backButtonTop - 5}]}
                        onPress={() => this.setState({showWarningMessage: !this.state.showWarningMessage})}
                    />
                </If>
                <If condition={this.state.showWarningMessage && routeItem.message}>
                    <Row
                        style={[
                            styles.warningMessageContainer,
                            {top: this.calculateInterectableViewBoundaries()}]
                        }
                    >
                        <View style={styles.warningIcon}>
                            <Image source={Assets.warningIcon}/>
                        </View>
                        <View style={styles.warningMessage}>
                            <Text>{getMessageTranslation(routeItem.message, appLanguage)}</Text>
                        </View>
                        <View style={styles.warningCloseIcon}>
                            <ClickableIcon
                                imageSource={Assets.closeIcon}
                                onPress={() => this.setState({showWarningMessage: false})}
                            />
                        </View>
                    </Row>
                </If>
                <Interactable.View
                    ref={(r) => {
                        this.panelRef = r;
                    }}
                    style={styles.interactableContainer}
                    verticalOnly
                    snapPoints={[
                        {y: this.calculateInterectableViewBoundaries()},
                        {y: this.calculateInterectableViewInitialPosition()},
                    ]}
                    boundaries={{top: this.calculateInterectableViewBoundaries()}}
                    initialPosition={{y: this.calculateInterectableViewInitialPosition()}}
                    onSnapStart={() => this.setState({showWarningMessage: false})}
                >
                    <LinearGradient
                        colors={['rgba(45,45,45,0.01)', 'rgba(35,35,35,0.15)', 'rgba(45,45,45,0.3)']}
                        style={styles.shadow}
                    />
                    <TouchableHighlight
                        underlayColor={Colors.lightGrey}
                        style={[
                            styles.touchableContainer,
                            styles.transportInfoContainer,
                            {height: clickablePanelHeaderHeight},
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
                                    {height: clickablePanelHeaderHeight},
                                ]
                            }
                        >
                            <View style={styles.marginTop20}/>
                            <Row style={[styles.paddingHorizontal20]}>
                                <VehicleIcon type={routeItem.type}
                                             platformizedTint={routeItem.type !== VehicleTypes.METRO ? getVehicleColor(routeItem.type) : '#061040'}/>
                                <Text style={styles.transportNumber}>
                                    {routeItem.number && routeItem.number.trim()}
                                </Text>
                                <View style={[styles.gpsContainer, styles.gpsIconSize,
                                    {backgroundColor: this.viewModel?.jsRoute?.gpsStatus ? '#061040' : '#ABBFD6'}]}>
                                    <Text h6 bold style={styles.whiteColor}>GPS</Text>
                                </View>
                                <View style={styles.flex1}/>
                                <Row style={{alignItems: 'center'}}>
                                    <ClickableIcon
                                        imageStyle={[styles.eyeIconContainer]}
                                        imageSource={_isTracked ? Assets.followActiveIcon : Assets.followInactiveIcon}
                                        onPress={() => {
                                            this.viewModel.onSubscribe(this.viewModel.jsRoute);
                                            this.forceUpdate();
                                        }}
                                    />
                                    <ClickableIcon
                                        imageStyle={{marginRight: 10}}
                                        imageSource={_isFav ? Assets.favActiveIcon : Assets.favInactiveIcon}
                                        onPress={() => {
                                            this.viewModel.onSetFavoriteRoute(this.viewModel.jsRoute);
                                            this.forceUpdate();
                                        }}
                                    />
                                </Row>
                            </Row>
                            <Row style={styles.addressContainer}>
                                <Image source={Assets.routeIcon}/>
                                <View style={{marginLeft: 17}}>
                                    <Text h6>{forwardFrom}</Text>
                                    <Text h6 style={styles.marginTop8}>{forwardTo}</Text>
                                </View>
                            </Row>
                        </View>
                    </TouchableHighlight>
                    <Choose>
                        <When condition={this.viewModel.loading}>
                            <LoaderView style={styles.loader}/>
                        </When>
                        <When condition={this.viewModel.jsRoute}>
                            <Divider/>
                            <View
                                style={[
                                    styles.paddingHorizontal20,
                                    styles.middleContentWrap,
                                ]}>
                                <Row style={[styles.marginTop10, {justifyContent: 'space-between'}]}>
                                    <TitledText
                                        title={translations.chosenRoute.distance}
                                        text={`${this.viewModel.jsRoute.length} ${translations.home.routeList.kilometres}`}
                                    />
                                    <TitledText
                                        title={translations.chosenRoute.price}
                                        text={`${this.viewModel.jsRoute.costMoving}  ${translations.home.routeList.UAH}`}
                                    />
                                    <TitledText
                                        title={translations.chosenRoute.workingHours}
                                        text={
                                            `${this.viewModel.startHour} - ${this.viewModel.endHour}`
                                        }
                                    />
                                </Row>
                              <TouchableOpacity
                                    style={[{marginTop: 15, flexDirection: 'row', alignItems: 'center'}]}
                                  onPress={() => this.setState({modalOpened: true})}>
                                <TitledText
                                    style={{marginBottom: 9, flex: 1}}
                                    title={translations.chosenRoute.carrier}
                                    text={getCarrierName(this.viewModel.jsRoute.carrier, appLanguage)}
                                />
                                  <Image source={Assets.rightArrowIcon}/>
                              </TouchableOpacity>
                                <Row style={[styles.buttonsRow]}>
                                    <ClickableDirectionTab
                                        style={[
                                            styles.routeTabItemForward,
                                            this.viewModel.chosenRoute === RouteDirections.FORWARD
                                            && {backgroundColor: '#ABBFD6'},
                                        ]}
                                        onPress={() => this.viewModel.setChosenRoute(RouteDirections.FORWARD)}
                                        textStyle={
                                            this.viewModel.chosenRoute === RouteDirections.FORWARD ?
                                                styles.whiteColor : {color: '#ABBFD6'}
                                        }
                                        text={translations.chosenRoute.forward}
                                    />
                                    <ClickableDirectionTab
                                        style={[
                                            styles.routeTabItemBackward,
                                            this.viewModel.chosenRoute === RouteDirections.BACKWARD
                                            && {backgroundColor: '#ABBFD6'},
                                        ]}
                                        onPress={() => this.viewModel.setChosenRoute(RouteDirections.BACKWARD)}
                                        textStyle={
                                            this.viewModel.chosenRoute === RouteDirections.BACKWARD ?
                                                styles.whiteColor : {color: '#ABBFD6'}
                                        }
                                        text={translations.chosenRoute.backward}
                                    />
                                </Row>
                            </View>
                            <ScrollView
                                ItemSeparatorComponent={() => (<Divider style={styles.divider}/>)}
                                style={[styles.flatList, {height: minScrollViewHeight}]}
                            >
                                {this.viewModel.stopsList && this.viewModel.stopsList.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            onPress={() => {
                                                this.onStopRowListItemPressed(item.id);
                                            }}
                                            style={[styles.flatListItem, styles.paddingHorizontal20]}
                                        >
                                            <Row centered style={{flex: 1}}>
                                                <Choose>
                                                    <When condition={index === 0}>
                                                        <View style={styles.firstItemLineWrap}>
                                                            <View style={styles.firstItemDot}/>
                                                            <View style={styles.firstItemLine}/>
                                                        </View>
                                                    </When>
                                                    <When condition={index === this.viewModel.stopsList.length - 1}>
                                                        <View style={styles.lastItemLineWrap}>
                                                            <View style={styles.lastItemLine}/>
                                                            <View style={styles.lastItemDot}/>
                                                        </View>
                                                    </When>
                                                    <Otherwise>
                                                        <View style={styles.normalItemLineWrap}>
                                                            <View style={styles.normalItemLineTop}/>
                                                            <View style={styles.normalItemLineDot}/>
                                                            <View style={styles.normalItemLineBottom}/>
                                                        </View>
                                                    </Otherwise>
                                                </Choose>
                                                <View style={{flex: 1}}>
                                                    <Text>
                                                        {getName(item, appLanguage)}
                                                    </Text>
                                                </View>
                                                <View style={styles.rightArrowWrap}>
                                                    <Image source={Assets.rightArrowIcon}/>
                                                </View>
                                            </Row>
                                            <Divider style={{marginLeft: 13, backgroundColor: '#F0F2F7'}}/>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </When>
                        <Otherwise>
                            <View
                                style={[
                                    styles.paddingHorizontal20,
                                    styles.middleContentWrap,
                                    {height: this.viewModel.panelMiddleContainerHeight + minScrollViewHeight},
                                ]}
                            >
                                <Text center>{translations.errors.noInfoError}</Text>
                            </View>
                        </Otherwise>
                    </Choose>
                    <View
                        style={[styles.interactableBottomPad,
                            {height: scrollViewBotttomDummyHeight}]}
                    />
                </Interactable.View>
                <Toast
                    ref='toastRef'
                    fadeInDuration={350}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />
                <Modal
                    ref='modal'
                    swipeToClose={true}
                    keyboardTopOffset={0}
                    isOpen={this.state.modalOpened}
                    onClosed={() => {
                        this.setState({modalOpened: false});
                    }}
                    style={{width: '90%', height: 'auto', borderRadius: 9, padding: 20, paddingBottom: 35, top: '37%'}}
                    backdropPressToClose={true}
                    position='top'
                >
                    <Choose>
                        <When condition={this.viewModel.loading}>
                            <LoaderView style={styles.loader}/>
                        </When>
                        <When condition={this.viewModel.jsRoute}>
                            <View
                                style={[
                                    styles.paddingHorizontal20,
                                    styles.middleContentWrap,
                                ]}
                            >
                                <TitledText
                                    title={translations.chosenRoute.carrier}
                                    text={getCarrierName(this.viewModel.jsRoute.carrier, appLanguage)}
                                    style={styles.marginTop10}
                                />
                                <Row style={{flexWrap: 'wrap'}}>
                                    <TitledText
                                        title={translations.chosenRoute.director}
                                        text={getCarrierDirector(this.viewModel.jsRoute.carrier, appLanguage)}
                                        style={[styles.marginRight30, styles.marginTop10]}
                                    />
                                    <If condition={!(this.viewModel.carrierDirectorNameLength > 20)}>
                                        <TitledText
                                            title={translations.chosenRoute.phoneNumber}
                                            text={this.viewModel.jsRoute.carrier.phoneNumber || '--'}
                                            style={styles.marginTop10}
                                        />
                                    </If>
                                </Row>
                                <If condition={this.viewModel.carrierDirectorNameLength > 20}>
                                    <TitledText
                                        title={translations.chosenRoute.phoneNumber}
                                        text={this.viewModel.jsRoute.carrier.phoneNumber}
                                        style={[styles.marginRight20, styles.marginTop10]}
                                    />
                                </If>
                                <TitledText
                                    title={translations.chosenRoute.address}
                                    text={getCarrierAddress(this.viewModel.jsRoute.carrier, appLanguage)}
                                    style={styles.marginTop10}
                                />
                            </View>
                        </When>
                    </Choose>
                </Modal>
                <If condition={PushNotificationsStore.isFirstLaunch && !this.viewModel.loading}>
                    {this.renderTip()}
                </If>
            </View>
    );
    }
    }
