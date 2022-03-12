import React from 'react';
import { View, Image } from 'react-native';
import { SafeAreaLayout, Button, Text } from 'components';
import { LocalizationContext } from 'services';
import { bigCheckedIcon } from 'assets';
import styles from './styles';

export class ContactSupportSuccessScreen extends React.Component {
  static contextType = LocalizationContext;

  render() {
    const { translations } = this.context;
    return (
      <SafeAreaLayout style={styles.safeArea}>
        <View style={styles.mainContainer}>
          <View style={styles.contentContainer} >
            <Image 
              source={bigCheckedIcon}
            />
            <Text style={styles.textMargins}>
              {translations.settings.contactUs.messageSend}
            </Text>
            <Text>
              {translations.general.thanks}
            </Text>
          </View>
          <Button 
            title={translations.settings.contactUs.super}
            style={styles.cancelButton}
            filled
            onPress={() => this.props.navigation.pop(2)}
          />
        </View>
      </SafeAreaLayout>
    );
  }
}
