import React from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { SaveAreaInset } from '../../../enums';
import { appBackground } from '../../../presentation/styles/colors';

export const SafeAreaLayout = (props) => {
  const safeAreaInsets = useSafeArea();
  const { insets, style, ...layoutProps } = props;

  const toStyleProp = (inset) => {
    switch (inset) {
      case SaveAreaInset.BOTTOM: return { paddingBottom: safeAreaInsets.bottom };
      case SaveAreaInset.TOP: return { paddingTop: safeAreaInsets.top };
      default: return { paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom };
    }
  };

  const createInsets = () => {
    if (!insets) return toStyleProp();
    else return React.Children.map(insets, toStyleProp);
  };

  return (
    <View
      {...layoutProps}
      style={[{ backgroundColor: appBackground }, style, createInsets()]}
    />
  );
};
