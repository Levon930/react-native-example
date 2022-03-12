import React from 'react';
import { View, Image } from 'react-native';
import { SafeAreaLayout, Text, Button } from 'components';
import { LocalizationContext } from 'services';
import * as Assets from 'assets';
import Swiper from 'react-native-swiper';
import { activeToBlue } from 'presentation/styles/colors';
import { StopsStore } from 'stores';
import styles from './styles';
import { resetInitRouteAndNavigate } from '../../navigation/HomeNavigator';
import { AppRoutes } from '../../../enums';

export class OnboardingScreen extends React.Component {
  static contextType = LocalizationContext;

  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
    };

    StopsStore.setStops();
  }


  skipScreen = () => {
    // eslint-disable-next-line react/no-string-refs
    this.refs.swiper.scrollBy(1);
  };

  navigateToHomeScreen = () => {
    resetInitRouteAndNavigate(AppRoutes.HOME, this.props.navigation, null);
  }

  renderBottomButton = () => {
    const { translations } = this.context;
    if (this.state.pageIndex < 3) {
      return (
        <View
          style={styles.skipButton}
        >
          <Text
            onPress={this.skipScreen}
            style={styles.skipButtonText}
            center
          >
            {translations.general.skip}
          </Text>
        </View>
      );
    } else {
      return (
        <Button
          filled
          title={translations.onboarding.letsStart}
          onPress={this.navigateToHomeScreen}
          style={styles.startButton}
        />
      );
    }
  }

  render() {
    const { translations } = this.context;

    return (
      <SafeAreaLayout style={{ flex: 1 }}>
        <Swiper
          ref='swiper'
          onIndexChanged={index => this.setState({ pageIndex: index })}
          loop={false}
          activeDotColor='#0F0F4D'
          dotColor={activeToBlue}
          paginationStyle={{ bottom: 40 }}
        >
          <View style={styles.pageContainer}>
            <Image source={Assets.onboarding1} />
            <Text bold center style={styles.text}>
              {translations.onboarding.onboarding1}
            </Text>
          </View>
          <View style={styles.pageContainer}>
            <Image source={Assets.onboarding2} />
            <Text bold center style={styles.text}>
              {translations.onboarding['onboarding2-1']}{"\n"}
              {translations.onboarding['onboarding2-2']}
            </Text>
          </View>
          <View style={styles.pageContainer}>
            <Image source={Assets.onboarding3} />
            <Text bold center style={styles.text}>
              {translations.onboarding.onboarding3}
            </Text>
          </View>
          <View style={styles.pageContainer}>
            <Image source={Assets.onboarding4} />
            <Text bold center style={styles.text}>
              {translations.onboarding.onboarding4}
            </Text>
          </View>
        </Swiper>
        {this.renderBottomButton()}
      </SafeAreaLayout>
    );
  }
}
