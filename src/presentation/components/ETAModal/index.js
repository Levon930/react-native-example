import React from 'react';
import _ from 'lodash';
import {Dimensions, FlatList, Image, TouchableOpacity, View} from 'react-native';
import {UIActivityIndicator as Loader} from 'react-native-indicators';
import Interactable from 'react-native-interactable';
import {LocalizationContext} from '../../../services';
import {AllRoutesStore} from '../../../stores';
import {Button, ClickableIcon, Divider, Row, Text, VehicleIcon} from '../';
import {getName, getRouteAbbrev} from '../../../utils';
import {TimeFormats} from '../../../enums';
import styles from './styles.js';
import Assets from '../../../presentation/assets/index';
import {black} from '../../styles/colors';
import 'moment/locale/uk';
import 'moment/locale/en-gb';
import 'moment/locale/ru';
import moment from 'moment';

const screenHeight = Dimensions.get('window').height;
const interectableUpperViewBoundary = screenHeight * 0.35;
const backButtonTop = interectableUpperViewBoundary * 0.2;
const clickablePanelHeaderHeight = 0;
const panelMiddleContainerHeight = 145;
const scrollViewBotttomDummyHeight = interectableUpperViewBoundary;
const minScrollViewHeight =
    screenHeight
    - interectableUpperViewBoundary
    - clickablePanelHeaderHeight
    - panelMiddleContainerHeight;

export default class ETAModal extends React.PureComponent {
    static contextType = LocalizationContext;

    // eslint-disable-next-line react/sort-comp
    getName = (data, appLanguage) => {
        const name = getName(data, appLanguage);
        return name && name.length > 25 && name.length > 31 ?
            `${name.slice(0, 30)}
${name.slice(30)}` : name;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.panelRef && this.panelRef.snapTo) {
            if (this.props.activeStop) {
                this.panelRef.snapTo({index: 0});
            } else {
                this.panelRef.snapTo({index: 1});
            }
        }
    }

    parseDate = (date, translations, appLanguage) => {
        if (AllRoutesStore.routesDateFormat === TimeFormats.MINUTES) {
            const minutesTranslate = translations.ETAModal.minutes;
            let language;
            if (appLanguage === 'ua') {
                language = 'uk';
            } else if (appLanguage === 'en') {
                language = 'en-gb';
            } else {
                language = appLanguage;
            }

            moment.updateLocale(language, {
                relativeTime: {
                    future: "%s",
                    s: `< 1 ${minutesTranslate}`,
                    ss: `< 1 ${minutesTranslate}`,
                    m: `1 ${minutesTranslate}`,
                    mm: `%d ${minutesTranslate}`,
                }
            });
            return moment(date).locale(language).fromNow(true);
        } else {
            return `${moment(date).format(AllRoutesStore.routesDateFormat)}`;
        }
    };
    expandPanel = () => {
        this.panelRef?.snapTo({index: 0});
    };

    collapsePanel = () => {
        this.panelRef?.snapTo({index: 1});
    }

    calculateInterectableViewInitialPosition = () => {
        const compensation = 0;

        return screenHeight
            - clickablePanelHeaderHeight
            - compensation;
    }
    calculateInterectableViewBoundaries = () => {
        return interectableUpperViewBoundary;
    };

    renderVehicle = (route) => {
        const {translations, appLanguage} = this.context;
        return (
            <View key={`${route.id}route`} style={styles.flex1}>
                <Row style={[styles.container, {alignItems: 'center'}]}>
                    <VehicleIcon
                        iconStyle={{width: 30, height: 30}}
                        type={route.vehicleType}
                        platformizedTint="#ABBFD6"
                    />
                    <View style={styles.dataPaddings}>
                        <Text style={{fontSize: 16, fontWeight: '500', minWidth: 41}}>
                            {getRouteAbbrev(route.vehicleType, appLanguage)} {_.get(route, 'name')}
                        </Text>
                    </View>
                    <View style={styles.dataPaddings}>
                        <Image
                            source={Assets.arrowToRightIcon}
                            style={styles.arrowIcon}
                            resizeMode={'contain'}
                        />
                    </View>
                    <Text
                        numberOfLines={2}
                        style={[styles.dataPaddings, styles.nameMaxWidth, {fontSize: 16, flex: 1}]}
                    >
                        {this.getName(route.lastStopStation, appLanguage)}
                    </Text>
                    <View style={styles.dateContainer}>
                        <Text accented numberOfLines={2} style={{color: '#ABBFD6', fontSize: 16, fontWeight: '500'}}>
                            {route.nextETA ?
                                `${this.parseDate(route.nextETA, translations, appLanguage)}`
                                : '-'}
                        </Text>
                    </View>
                </Row>
            </View>
        );
    }

    renderList = (data = this.props.data) => {
        if (!data.id) return (<View/>);
        const {translations, appLanguage} = this.context;
        const favIcon = data.isFavorite ?
            Assets.favActiveIcon : Assets.favInactiveIcon;

        // const maxModalHeight = this.props.itemNumber ? this.props.itemNumber * 25 + 140 : 235;
        const name = getName(data, appLanguage);

        return (
            <View style={[styles.modalContentContainer]} isVisible={this.props.isOpen}>
                <TouchableOpacity style={styles.arrowDown} onPress={this.collapsePanel()}>
                    <Image source={Assets.bottomArrowIcon}/>
                </TouchableOpacity>
                <Row style={styles.contentHeader}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image style={{marginRight: 16, tintColor: '#080202'}} source={Assets.pinIcon}/>
                        <Text
                            style={{
                                fontWeight: '500',
                                fontSize: 20,
                                flex: 1
                            }}
                        >{this.getName(data, appLanguage)}</Text>
                    </View>
                    <ClickableIcon
                        imageStyle={styles.clickableIcon}
                        imageSource={favIcon}
                        onPress={this.props.onSetFavoriteStop}
                    />
                </Row>
                <If condition={!this.props.hideBottomButtons && !this.props.loadingETAs && data.routes}>
                    <Row style={[styles.footer, {paddingLeft: 16, paddingRight: 16, justifyContent: 'space-between'}]}>
                        <Button
                            title={translations.ETAModal.setTo}
                            style={[styles.bottomButtons, styles.toButton]}
                            onPress={() => {
                                this.props.setToPress(name, data.id);
                            }}
                        />
                        <Button
                            title={translations.ETAModal.setFrom}
                            style={[styles.bottomButtons, styles.fromButton]}
                            onPress={() => {
                                this.props.setFromPress(name, data.id);
                            }}
                        />
                    </Row>
                </If>
                <Divider/>
                <Choose>
                    <When condition={this.props.loadingETAs}>
                        <View style={styles.loaderContainer}>
                            <Loader color={black} size={28}/>
                        </View>
                    </When>
                    <When condition={!this.props.loadingETAs}>
                        <FlatList
                            data={data.routes}
                            scrollEventThrottle={16}
                            ItemSeparatorComponent={() => (<Divider/>)}
                            keyExtractor={(__, index) => `ETA ${index}`}
                            renderItem={({item}) => this.renderVehicle(item)}
                            ListEmptyComponent={() => (
                                <Text style={styles.emptyList}>
                                    {translations.emptyLists.routes}
                                </Text>)}
                        />
                    </When>
                </Choose>
            </View>
        );
    }

    render() {
        return (
            <Interactable.View
                ref={(r) => {
                    this.panelRef = r;
                }}
                style={styles.interactableContainer}
                verticalOnly
                snapPoints={[
                    {y: interectableUpperViewBoundary},
                    {y: this.calculateInterectableViewInitialPosition()},
                ]}
                boundaries={{top: interectableUpperViewBoundary}}
                initialPosition={{y: this.calculateInterectableViewInitialPosition()}}
            >
                {this.renderList()}
                <View
                    style={[styles.interactableBottomPad,
                        {height: scrollViewBotttomDummyHeight}]}
                />
            </Interactable.View>
        );
    }
}

ETAModal.defaultProps = {
    itemDisplayCount: 5,
    hideBottomButtons: false,
    activeStop: null,
    loadingETAs: true,
    data: [],
    isOpen: false,
    closeETAModal: () => {
    },
    openETAModal: () => {
    },
    onSetFavoriteStop: () => {
    },
    setFromPress: () => {
    },
    setToPress: () => {
    },
};
