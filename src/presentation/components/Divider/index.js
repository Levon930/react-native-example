import React from 'react';
import { View } from 'react-native';
import { lightGrey } from '../../../presentation/styles/colors';

export default ({ style }) => {
  return (
    <View style={[{ height: 1, backgroundColor: lightGrey }, style]} />
  );
};
