import React from 'react';
import { Image, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { busStopIcon, metroStopIcon, activeBusStopIcon } from '../../assets';

export default ({ item, onPress, index, activeId }) => {
  const isActive = item.id === activeId;
  let size = 15;
  if (isActive) size = 24;
  return (
    <Marker
      zIndex={isActive ? 2 : 1}
      key={`stop_key${item.id}${index}`}
      coordinate={{
        latitude: item.geolocation.latitude,
        longitude: item.geolocation.longitude,
      }}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: 0.5 }}
      onPress={onPress}
    >
      <View style={{ padding: 4 }}>
        <Image
          style={{ width: size, height: size, zIndex: isActive ? 2 : 1 }}
          source={item.type === 1 ? metroStopIcon : (isActive ? activeBusStopIcon : busStopIcon)}
        />
      </View>
    </Marker>
  );
};
