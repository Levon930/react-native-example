import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import * as Assets from '../../assets';
import { Text, ClickableIcon, Row, VehicleIcon } from '../';
import styles from './styles';
import { getVehicleColor } from '../../../utils';

export default ({
  type, number, onSubscribe, forwardFrom,
  forwardTo, onSetFavorite, onItemPress, isFavorite, isFollowed, message, key,
}) => (
  <TouchableOpacity onPress={onItemPress} key={key}>
    <View style={styles.innerContainer}>
      <Row style={styles.firstRow}>
        <Row>
          <VehicleIcon type={type} iconStyle={{ marginRight: 11 }} platformizedTint={getVehicleColor(type)}/>
          <Text bold h3>{number && number.trim()}</Text>
          { message && <Image source={Assets.warningIcon} style={styles.warningIcon} />}
        </Row>
        <View style={[styles.btnsContainer, { marginBottom: -40 }]}>
          {/*<ClickableIcon*/}
          {/*  imageStyle={styles.clickableIcon}*/}
          {/*  imageSource={isFollowed ? Assets.followActiveIcon : Assets.followInactiveIcon}*/}
          {/*  onPress={onSubscribe}*/}
          {/*/>*/}
          <ClickableIcon
            imageStyle={styles.clickableIcon}
            imageSource={isFavorite ? Assets.favActiveIcon : Assets.favInactiveIcon}
            onPress={onSetFavorite}
          />
        </View>
      </Row>
      <Row>
        <Image style={{marginTop: 3, marginLeft: 4}} source={Assets.routeIcon}/>
        <View style={styles.placeTextWrap}>
          <Text style={styles.placeText}>
            {forwardFrom}
          </Text>
          <Text style={styles.placeText}>
            {forwardTo}
          </Text>
        </View>
      </Row>
    </View>
  </TouchableOpacity>
);
