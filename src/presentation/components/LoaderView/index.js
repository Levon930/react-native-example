import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import loader from './loader.json';

export default (props) => (
  <View style={styles.container}>
    <LottieView source={loader} style={props.style} autoPlay loop />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
});
