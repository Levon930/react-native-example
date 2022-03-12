import React from 'react';
import { StatusBar, View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaLayout, Header, Text, Divider } from 'components';
import { LocalizationContext } from 'services';
import { Languages } from 'enums';
import { PushNotificationsStore } from 'stores';
import * as Colors from 'presentation/styles/colors';
import { checkIcon } from 'assets';
import styles from './styles';

export class LanguagesScreen extends React.Component {
  static contextType = LocalizationContext;

  handleSetLanguage = async language => {
    this.context.setAppLanguage(language);
    PushNotificationsStore.registerDevice(language);
  };

  pickText = (item) => {
    switch (item) {
      case Languages.UA:
        return this.context.translations.settings.languages.ua;
      case Languages.RU:
        return this.context.translations.settings.languages.ru;
      case Languages.EN:
        return this.context.translations.settings.languages.en;
    }
  }

  render() {
    const { translations, appLanguage } = this.context;
    return (
      <SafeAreaLayout style={styles.container}>
        <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
        <Header 
          title={translations.settings.languages.title}
          withBackButton
          onBackPress={this.props.navigation.goBack}
        />
        {translations.getAvailableLanguages().map(item => (
          <View key={item}>
            <Divider />
            <TouchableOpacity
              style={styles.languageItem}
              onPress={() => this.handleSetLanguage(item)}
            >
              <Text>{this.pickText(item)}</Text>
              <If condition={appLanguage === item}>
                <Image source={checkIcon} style={styles.icon} />
              </If>
            </TouchableOpacity>
          </View>
        ))}
        <Divider />
      </SafeAreaLayout>
    );
  }
}
