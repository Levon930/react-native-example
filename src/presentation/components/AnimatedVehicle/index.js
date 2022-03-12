import React, { useContext } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Overlay, Text } from '../';
import { LocalizationContext } from '../../../services';
import {getRouteAbbrev, getVehicleColor} from '../../../utils';

export default ({ item, showHandicapped }) => {
  const { appLanguage } = useContext(LocalizationContext);
  return (
    <If condition={(showHandicapped && item.handicapped) || (!showHandicapped)}>
      <Marker.Animated
        key={item.bort_number}
        ref={item.ref}
        coordinate={item.coordinate}
        deg={item.deg}
        tracksViewChanges={false}
        anchor={{ x: 0.5, y: 0.5 }}
        flat
        // style={{ // markers rotation in case if rotation will be enebled on the map
        //   transform: [{
        //     rotate: heading.interpolate({
        //       inputRange: [0, 360], outputRange: ['0deg', '360deg'],
        //     }),
        //   }],
        // }}
      >
        <Text bold style={styles.transportBortNumber}>
          {getRouteAbbrev(item.vehicleType, appLanguage)}{' '}{item.number}
        </Text>
        <Text style={styles.hidden}>{item.deg._value}</Text>
        <Image
          source={(item.icon)}
          style={styles.transportIcon}
        />
        <If condition={item.deg}>
          <Overlay style={styles.transportArrowWrapper}>
            <If condition={item.deg._value !== 0}>
              <Animated.View
                style={[{
                  transform: [{
                    rotate: item.deg.interpolate({
                      inputRange: [0, 360], outputRange: ['0deg', '360deg'],
                    }),
                  }],
                },
                styles.transportArrow]}
              >
                <View
                  style={[styles.directionIcon, {borderBottomColor: getVehicleColor(item.vehicleType)}]}
                />
              </Animated.View>
            </If>
          </Overlay>
        </If>
      </Marker.Animated>
    </If>
  );
};

const styles = StyleSheet.create({
  directionIcon: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    // borderBottomColor: '#3D4763',
  },
  transportArrowWrapper: {
    paddingBottom: -100,
  },
  transportArrow: {
    alignItems: 'center',
    height: 40,
    width: 40,
    margin: 15,
  },
  transportBortNumber: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  transportIcon: {
    height: 50,
    width: 50,
    margin: 10,
  },
  hidden: {
    position: 'absolute',
    opacity: 0,
  },
});
