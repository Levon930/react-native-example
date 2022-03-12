import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import * as Assets from 'assets';
import * as _ from 'lodash';
import { getRouteAbbrev, getVehicleColor } from 'utils';
import { Text, ClickableIcon, Row, VehicleIcon } from 'components';
import styles from './styles';

export default ({ name, onSetFavorite, isFavorite, item, onPress, appLanguage }) => {
  const routes = _.groupBy(item.routes, 'vehicleType');
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Row style={styles.headingContainer}>
        <Text bold style={styles.name}>
          {name && name.length > 25 ? `${name.slice(0, 25)}...` : name}
        </Text>
        <View style={styles.iconContainer}>
          <ClickableIcon
            imageStyle={styles.clickableIcon}
            imageSource={isFavorite ? Assets.favActiveIcon : Assets.favInactiveIcon}
            onPress={onSetFavorite}
          />
        </View>
      </Row>
      <Choose>
        <When condition={item.routes && item.routes.length > 0}>
          <For each="route" of={Object.keys(routes)} index="index">
            <Row style={styles.routeContainer}>
              <VehicleIcon type={route} platformizedTint={getVehicleColor(route)}/>
              <Row style={{flexWrap: 'wrap'}}>
                <For each="route" of={routes[route]} index="index">
                  <View style={styles.routeItem} key={`favorite_route${route.id}_${index}`}>
                    <Text style={styles.routeName} secondary>
                      {route.name}
                    </Text>
                  </View>
                </For>
              </Row>
            </Row>
          </For>
        </When>
      </Choose>
    </TouchableOpacity>
  );
};
