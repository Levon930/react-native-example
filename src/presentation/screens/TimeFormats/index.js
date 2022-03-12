import React from 'react';
import { StatusBar, View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaLayout, Header, Text, Divider } from 'components';
import { LocalizationContext } from 'services';
import { dateFormat } from 'utils';
import { observer } from 'mobx-react';
import { TimeFormats } from 'enums';
import * as Colors from 'presentation/styles/colors';
import { checkIcon } from 'assets';
import ViewModel from './viewModel';
import styles from './styles';

@observer
export class TimeFormatsScreen extends React.Component {
  static contextType = LocalizationContext;

  dateFormats = [
    { format: TimeFormats.MINUTES },
    { format: TimeFormats.HOURS },
  ];

  viewModel = new ViewModel(this);

  render() {
    const { translations } = this.context;
    return (
      <SafeAreaLayout style={styles.container}>
        <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
        <Header
          title={translations.settings.arrivalFormat.title2}
          withBackButton
          onBackPress={this.props.navigation.goBack}
        />
        {this.dateFormats.map((item, index) => (
          <View key={index}>
            <Divider />
            <TouchableOpacity
              style={styles.item}
              onPress={() => this.viewModel.setFormat(item.format)}
            >
              <Text>{dateFormat(item.format, translations)}</Text>
              <Image source={checkIcon} style={[styles.icon, { opacity: this.viewModel.activeFormat && item.format === this.viewModel.activeFormat ? 1 : 0 }]} />
            </TouchableOpacity>
          </View>
        ))}
        <Divider />
      </SafeAreaLayout>
    );
  }
}
