import React, { useContext } from 'react';
import { View, Image, TouchableOpacity, FlatList } from 'react-native';
import { Text, Row, VehicleIcon } from 'components';
import { getRouteAbbrev } from 'utils';
import { arrowToRightIcon, disabillityIconGreen } from 'assets';
import * as Colors from 'presentation/styles/colors';
import { LocalizationContext } from 'services';
import { VehicleTypes, AppRoutes } from 'enums';
import styles from './styles';

export default ({
  data, disabled, cheapest, navigation,
  startPoint, endPoint, initialCoords,
  handicappedFilter,
}) => {
  const cardCornerColor = (item) => {
    if (cheapest || cheapest && disabled) {
      if (item.totalPrice <= data[0].totalPrice * 1.5) {
        return Colors.recommendedRoute;
      } else if (item.totalPrice <= data[0].totalPrice + data[0].totalPrice) {
        return Colors.mediumRecommendedRoute;
      } else {
        return Colors.unrecommendedRoute;
      }
    } else if (disabled || !disabled && !cheapest) {
      if (item.totalTime <= data[0].totalTime * 1.5) {
        return Colors.recommendedRoute;
      } else if (item.totalTime <= data[0].totalTime + data[0].totalTime) {
        return Colors.mediumRecommendedRoute;
      } else {
        return Colors.unrecommendedRoute;
      }
    }
  };

  const { translations, appLanguage } = useContext(LocalizationContext);

  const renderItem = (item, index) => {
    const firstItem = item.ways.find(
      way => way.type === VehicleTypes.TRAM || way.type === VehicleTypes.TROLLEYBUS
        || way.type === VehicleTypes.BUS || way.type === VehicleTypes.METRO
    );
    const secondItem = item.ways.find(
      way => ((way.type === VehicleTypes.TRAM || way.type === VehicleTypes.TROLLEYBUS
        || way.type === VehicleTypes.BUS || way.type === VehicleTypes.METRO)
        && (way.routeId !== firstItem.routeId)));

    return (
      <TouchableOpacity
        style={styles.mainContainer}
        key={index}
        onPress={() => navigation.navigate(AppRoutes.ROUTES_DETAILS, {
          routeItem: item, startPoint, endPoint, initialCoords, handicappedFilter,
        })}
      >
        <Row>
          <View style={styles.transportInfoContainer}>
            <Row>
              <VehicleIcon type={firstItem.type} platformizedTint='black' />
              <Text bold style={styles.titleText}>
                {getRouteAbbrev(firstItem.type, appLanguage)} {firstItem.name}
              </Text>
              <View style={styles.stopsCountContainer}>
                <Text bold inverted center style={[styles.secondaryText, styles.stopsCount]}>
                  {firstItem.stopStations.length} {translations.home.routeList.stops}
                </Text>
              </View>
              <If condition={firstItem.handicapped}>
                <Image source={disabillityIconGreen} style={styles.disabledIcon} />
              </If>
              <If condition={!!secondItem}>
                <Image source={arrowToRightIcon} style={styles.arrowIcon} />
                <VehicleIcon type={secondItem.type} platformizedTint='black' />
                <Text bold style={styles.titleText}>
                  {getRouteAbbrev(secondItem.type, appLanguage)} {secondItem.name}
                </Text>
                <View style={styles.stopsCountContainer}>
                  <Text bold inverted style={[styles.secondaryText, styles.stopsCount]}>
                    {!!secondItem.stopStations
                    && secondItem.stopStations.length} {translations.home.routeList.stops}
                  </Text>
                </View>
                <If condition={secondItem.handicapped}>
                  <Image source={disabillityIconGreen} style={styles.disabledIcon} />
                </If>
              </If>
            </Row>
            <Row>
              <View style={styles.distanceInfoContainer}>
                <Text h6 secondary bold style={styles.secondaryText}>
                  {translations.home.routeList.distance}:
                </Text>
                <Text bold>
                  {item.totalDistance.toFixed(2)} {translations.home.routeList.kilometres}
                </Text>
              </View>
              <View>
                <Text h6 secondary style={styles.secondaryText}>
                  {translations.home.routeList.totalFare}:
                </Text>
                <Text style={styles.secondaryTextValue}>
                  {item.totalPrice} {translations.home.routeList.UAH}
                </Text>
              </View>
            </Row>
          </View>
          <View>
            <View
              style={[
                styles.cornerTriangle, { borderBottomColor: cardCornerColor(item) },
              ]}
            />
            <Text h6 style={styles.timeEstimationText}>
              {translations.home.routeList.inTheWay}:
            </Text>
            <Text bold style={[styles.titleText, styles.estimatedTime]}>
              {item.totalTime} {translations.home.routeList.minutes}
            </Text>
          </View>
        </Row>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      style={styles.touchableContainer}
      scrollEventThrottle={20}
      keyExtractor={(item, index) => `list ${index} ${item.type}`}
      renderItem={({ item, index }) => renderItem(item, index)}
    />
  );
};

