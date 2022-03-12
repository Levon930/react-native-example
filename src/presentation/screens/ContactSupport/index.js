import React from 'react';
import { observer } from 'mobx-react';
import { View, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaLayout, TextInput, Header } from 'components';
import { LocalizationContext } from 'services';
import * as Colors from 'presentation/styles/colors';
import { AppRoutes } from 'enums';
import { sendMessageUnactive, sendMessageActive } from 'assets';
import Toast from 'react-native-easy-toast';
import { getErrorMessage } from 'utils';
import ViewModel from './viewModel';
import styles from './styles';
@observer
export class ContactSupportScreen extends React.Component {
  static contextType = LocalizationContext;

  viewModel = new ViewModel(this);

  sendMessage = async () => {
    const { translations } = this.context;

    await this.viewModel.validateEmail();
    if (!this.viewModel.emailValidation) {
      this.refs.emailTextInput.trigerValidation();
      this.refs.toast.show(translations.errors.validEmail, 1500);
    } else if (!this.viewModel.validateMessage) {
      this.refs.toast.show(translations.errors.validMessage, 1500);
    } else {
      this.viewModel.contactSupport()
        .then(() => this.props.navigation.navigate(AppRoutes.CONTACT_SUPPORT_SUCCESS))
        .catch((e) => {
          this.refs.toast.show(getErrorMessage(e, translations), 1500);
        });
    }
  }

  render() {
    const { translations } = this.context;
    return (
      <SafeAreaLayout style={styles.safeArea}>
        <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.mainContainer}>
            <Header 
              title={translations.settings.contactUs.title}
              withBackButton
              onBackPress={this.props.navigation.goBack}
              rightIcon={this.viewModel.disabledButton ? sendMessageUnactive : sendMessageActive}
              rightIconDisabled={this.viewModel.disabledButton}
              onRightIconPress={this.sendMessage}
            />
            <TextInput
              ref="emailTextInput" 
              placeholder={translations.settings.contactUs.emailTextInput}
              autoCompleteType='email'
              autoCapitalize='none'
              keyboardType='email-address'
              value={this.viewModel.email}
              onChangeText={this.viewModel.setEmail}
            />
            <TextInput 
              placeholder={translations.settings.contactUs.messageTextInput} 
              style={styles.messageTextInput}
              multiline
              value={this.viewModel.message}
              onChangeText={this.viewModel.setMessage}
            />
            <View style={styles.footer} /> 
          </View>
        </TouchableWithoutFeedback>
        <Toast 
          ref="toast" 
          position="center"
        />
      </SafeAreaLayout>
    );
  }
}
