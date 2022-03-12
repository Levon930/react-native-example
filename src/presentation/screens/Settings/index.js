import React, { useContext, useState, useCallback } from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { LocalizationContext } from 'services';
import { AppRoutes } from 'enums';
import { SafeAreaLayout, Header, Divider, StickyHeader } from 'components';
import { PushNotificationsStore } from 'stores';
import { white } from 'presentation/styles/colors';
import { useFocusEffect } from '@react-navigation/native';
import { ItemSection, SectionHeader } from './components';
import styles from './styles';

export const SettingsScreen = ({ navigation }) => {

  const [isSmallHeaderVisible, setSmallHeaderVisibility] = useState(false);
  const [titleSize] = useState(24);
  const [messagesCounter, setMessagesCounter] = useState(PushNotificationsStore.messagesCounter);
  const { translations } = useContext(LocalizationContext);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (offsetY > 64) setSmallHeaderVisibility(true);
    else if (offsetY < 64) {
      setSmallHeaderVisibility(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setMessagesCounter(PushNotificationsStore.messagesCounter);
      navigation.navigate(AppRoutes.SETTINGS);
    }, [])
  );

  return (
    <SafeAreaLayout style={styles.container}>
      <StatusBar backgroundColor={white} barStyle="dark-content" />
      <StickyHeader
        title={translations.settings.title}
        isSmallHeaderVisible={isSmallHeaderVisible}
      />
      <ScrollView
        scrollEventThrottle={20}
        onScroll={handleScroll}
      >
        <Header
          showStickyHeader
          title={translations.settings.title}
          titleSize={titleSize}
          style={[styles.mainPaddings, styles.header]}
        />
        <SectionHeader
          title={translations.settings.headerSection1}
          style={styles.mainPaddings}
        />
        <Divider />
        <ItemSection
          title={translations.settings.notifications.title}
          style={styles.mainPaddings}
          onPress={() => navigation.navigate(AppRoutes.NOTIFICATIONS)}
          messagesCounter={messagesCounter}
        />
        <Divider />
        <ItemSection
          title={translations.settings.languageTitle}
          style={styles.mainPaddings}
          onPress={() => navigation.navigate(AppRoutes.LANGUAGES)}
        />
        <Divider />
        <ItemSection
          title={translations.settings.arrivalFormat.title}
          style={styles.mainPaddings}
          onPress={() => navigation.navigate(AppRoutes.TIME_FORMATS)}
        />
        <Divider />
        <SectionHeader
          title={translations.settings.headerSection2}
          style={[styles.mainPaddings, { marginTop: 26 }]}
        />
        <Divider />
        <ItemSection
          title={translations.settings.contactUs.title}
          style={styles.mainPaddings}
          onPress={() => navigation.navigate(AppRoutes.CONTACT_SUPPORT)}
        />
        <Divider />
        <ItemSection
          title={translations.settings.aboutApp.title}
          style={styles.mainPaddings}
          onPress={() => navigation.navigate(AppRoutes.ABOUT_APP)}
        />
        <Divider />
        <ItemSection
          title={translations.settings.userAgreement.title}
          style={styles.mainPaddings}
          onPress={() => navigation.navigate(AppRoutes.USER_AGREEMENT)}
        />
        <Divider />
      </ScrollView>
    </SafeAreaLayout>
  );
};
