import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { AnimatedVehicle } from '../';
import * as Assets from '../../assets';
import styles from './styles';
import { mapStyle } from './mapStyle';

export default class Map extends React.Component {

  // markers rotation in case if rotation will be enebled on the map
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     rotationHeading: new Animated.Value(0),
  //   };
  // }

  animateToRegion = (region) => {
    // eslint-disable-next-line react/no-string-refs
    this.refs.mapView.animateToRegion(region, 500);
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          {...this.props}
          moveOnMarkerPress={false}
          ref='mapView'
          showsCompass={false}
          customMapStyle={mapStyle}
          style={[styles.map, this.props.style]}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
          showsMyLocationButton={false}
          rotateEnabled={false}
          // onRegionChange={() => {  // markers rotation in case if rotation will be enebled on the map
          //   this.refs.mapView.getCamera()
          //     .then((info) => {
          //       Animated.spring(this.state.rotationHeading, { toValue: info.heading }).start();
          //     });
          // }}
        >
          {!!this.props.renderPolyLines && this.props.renderPolyLines}
          {!!this.props.renderForwardPolyline && this.props.renderForwardPolyline}
          {!!this.props.renderBackwardPolyline && this.props.renderBackwardPolyline}
          {!!this.props.renderStops && this.props.renderStops}
          {!!this.props.renderMarkers && this.props.renderMarkers}
          <If condition={this.props.animatedVehicles && this.props.animatedVehicles.length}>
            <For
              each="item"
              of={this.props.animatedVehicles}
              index="index"
            >
              <AnimatedVehicle
                key={`${item.bort_number}${index}_AnimatedVehicle`}
                item={item}
                showHandicapped={this.props.showHandicappedMarkers}
                // heading={this.state.rotationHeading}
              />
            </For>
          </If>
        </MapView>
        <View style={styles.overlayContainer}>
          <If condition={this.props.withGps}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.props.animateToUserLocation}
            >
              <Image source={Assets.gpsIcon} />
            </TouchableOpacity>
          </If>
          <TouchableOpacity
            style={[styles.buttonContainer, styles.plusButton]}
            onPress={this.props.zoomInMap}
          >
            <Image source={Assets.plusIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonContainer, styles.minusButton, this.props.minusButtonStyle]}
            onPress={this.props.zoomOutMap}
          >
            <Image source={Assets.minusIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
