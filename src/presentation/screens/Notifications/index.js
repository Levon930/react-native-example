import React from 'react';
import { FlatList, StatusBar } from 'react-native';
import { observer } from 'mobx-react';
import { LocalizationContext } from 'services';
import { SafeAreaLayout, Header } from 'components';
import { getMessageTranslation } from 'utils';
import { PushNotificationsStore } from 'stores';
import { white } from 'presentation/styles/colors';
import ViewModel from './viewModel';
import { MessageItem } from './components';
import styles from './styles';

@observer
export class NotificationsScreen extends React.Component {
  static contextType = LocalizationContext;

  componentDidMount = () => {
    PushNotificationsStore.registerDevice(this.context.appLanguage);
  }

  viewModel = new ViewModel(this);

  render() {
    const { translations } = this.context;
    return (
      <SafeAreaLayout style={styles.container}>
        <StatusBar backgroundColor={white} barStyle="dark-content" />
        <Header
          title={translations.settings.notifications.title}
          style={styles.mainPaddings}
          withBackButton
          onBackPress={this.props.navigation.goBack}
        />
        <FlatList
          data={this.viewModel.messages}
          scrollEventThrottle={20}
          onScroll={this.handleScroll}
          renderItem={({ item }) =>
            <MessageItem
              translations={translations}
              message={getMessageTranslation(item, this.context.appLanguage)}
              date={item.startDate}
              isActive={!item.isReaden}
            />
          }
          keyExtractor={item => item.id}
        />
      </SafeAreaLayout>
    );
  }
}
