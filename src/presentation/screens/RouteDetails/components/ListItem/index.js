import React, {useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {VehicleTypes} from 'enums';
import {getName, getVehicleColor} from 'utils';
import {Button, Row, Text, VehicleIcon} from '../../../../components';
import * as Assets from '../../../../assets';
import styles from '../../styles';

export default ({
                    data, way, appLanguage, startPoint, endPoint, index, translations, firstItemId, openMapLinkPress,
                }) => {
    const [stopsListOpened, setStopsListOpened] = useState(false);

    const isHandicapped = () => {
        let isHandicated = false;
        if (data && data.length >= (index + 1)) {
            isHandicated = data[index + 1]?.handicapped;
        }
        if(data?.length >= (index - 1) && data?.length === (index + 1)) {
            isHandicated = data[index - 1]?.handicapped;
        }
        return isHandicated;
    }

    const transportItem = () => (
        <Row>
            <View style={styles.transportListInfoContainer}>
                <Row style={{alignItems: 'center'}}>
                    <VehicleIcon type={way.type} platformizedTint={getVehicleColor(way.type)}/>
                    <Text style={{fontWeight: '500', fontSize: 20, marginLeft: 4}}>{way.name}</Text>
                </Row>
                <View
                    style={[styles.transportListLine, {
                        backgroundColor: '#0D0D0D',
                    }]}
                />
            </View>
            <View style={[styles.paddingLeft15, {flex: 1}]}>
                <If condition={way.stopStations.length > 0}>
                    <Text bold style={styles.transportListStopName}>
                        {getName(way.stopStations[0], appLanguage)}
                    </Text>
                </If>
                <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => setStopsListOpened(!stopsListOpened)}
                >
                    <Text h6 style={styles.stopsListHeader}>
                        {translations.home.routeList.stopsTitle}: {way.stopStations.length}
                    </Text>
                    <Image
                        source={Assets.rightArrowIcon}
                        style={
                            stopsListOpened ?
                                [styles.stopsListIcon, {transform: [{rotate: '-90deg'}]}] : styles.stopsListIcon
                        }
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <If condition={stopsListOpened && way.stopStations.length > 0}>
                    <For
                        each='item'
                        of={way.stopStations}
                        index='index'
                    >
                        <Text h6 style={styles.stopsListText} key={index}>
                            {getName(item, appLanguage)}
                        </Text>
                    </For>
                </If>
            </View>
        </Row>
    );

    const startItem = () => (
        <Row>
            <View style={styles.transportListInfoContainer}>
                <Image style={{marginLeft: 3}} source={isHandicapped() ? Assets.humanIconHendicate : Assets.humanIcon}/>
                <View style={styles.dotsContainer}>
                    {
                        [...Array(9)].map((i, arrIndex) => {
                            return (
                                <View
                                    key={arrIndex}
                                    style={styles.smallDot}
                                />
                            );
                        })
                    }
                </View>
            </View>
            <View style={[styles.paddingLeft15, {flex: 1}]}>
                <Text bold style={styles.transportListStopName}>{startPoint}</Text>
                <Text h6 secondary>
                    {translations.home.routeList.onFoot}: {(way.distance * 1000).toFixed(0)}м ({way.time} хв)
                </Text>
                <Button
                    filled
                    style={styles.confirmButton}
                    title={translations.mapLink.buttonTitile}
                    onPress={() => openMapLinkPress(way.startGeolocation, way.endGeolocation)}
                />
            </View>
        </Row>
    );

    const transferItem = () => (
        <Row>
            <View style={styles.transportListInfoContainer}>
                <Image style={{marginLeft: 3}} source={isHandicapped() ? Assets.humanIconHendicate : Assets.humanIcon}/>
                <View style={styles.dotsContainer}>
                    {
                        [...Array(9)].map((i, arrIndex) => {
                            return (
                                <View
                                    key={arrIndex}
                                    style={styles.smallDot}
                                />
                            );
                        })
                    }
                </View>
            </View>
            <View style={[styles.paddingLeft15, {flex: 1}]}>
                <Text bold style={styles.transportListStopName}>
                    {getName(
                        data[index - 1].stopStations[data[index - 1].stopStations.length - 1],
                        appLanguage,
                    )}
                </Text>
                <Text h6 secondary>
                    {translations.home.routeList.onFoot}: {(way.distance * 1000).toFixed(0)}м ({way.time} хв)
                </Text>
                <Button
                    filled
                    style={styles.confirmButton}
                    title={translations.mapLink.buttonTitile}
                    onPress={() => openMapLinkPress(way.startGeolocation, way.endGeolocation)}
                />
            </View>
        </Row>
    );

    const endItem = () => {
        return (
            <View>
                <If condition={way.distance && way.time}>
                    {transferItem()}
                </If>
                <Row>
                    <View style={[styles.transportListInfoContainer, {paddingLeft: 6, paddingTop: 3}]}>
                        <Image source={Assets.endRouteIcon}/>
                    </View>
                    <View style={[styles.paddingLeft15, {flex: 1}]}>
                        <Text bold style={{marginTop: 3}}>{endPoint}</Text>
                    </View>
                </Row>
            </View>

        );
    };


    const ListItem = () => {
        switch (way.type) {
            case VehicleTypes.TRAM:
                return (
                    transportItem(way, appLanguage)
                );

            case VehicleTypes.TROLLEYBUS:
                return (
                    transportItem(way, appLanguage)
                );

            case VehicleTypes.BUS:
                return (
                    transportItem(way, appLanguage)
                );

            case VehicleTypes.METRO:
                return (
                    transportItem(way, appLanguage)
                );

            case VehicleTypes.START:
                return (
                    startItem()
                );

            case VehicleTypes.TRANSFER:
                return (
                    transferItem()
                );

            case VehicleTypes.END:
                return (
                    endItem()
                );

            default:
                return null;
        }
    };

    return (
        <View>
            {ListItem()}
        </View>
    );
};

