import React from 'react';
import { StatusBar, ScrollView } from 'react-native';
import { SafeAreaLayout, Header, Text } from 'components';
import { LocalizationContext } from 'services';
import * as Colors from 'presentation/styles/colors';
import styles from './styles';

export class UserAgreementScreen extends React.Component {
  static contextType = LocalizationContext;

  render() {
    const { translations } = this.context;
    return (
      <SafeAreaLayout style={styles.container}>
        <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
        <Header
          title={translations.settings.userAgreement.title}
          withBackButton
          onBackPress={this.props.navigation.goBack}
        />
        <ScrollView>
          <Text style={styles.contentText}>
            {translations.settings.userAgreement.content}
          </Text>
        </ScrollView>
      </SafeAreaLayout>
    );
  }
}
