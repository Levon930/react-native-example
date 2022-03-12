import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-simple-device-info';
import { getLanguage } from 'utils';
import translations, { DEFAULT_LANGUAGE } from './translations';

const APP_LANGUAGE = 'appLanguage';

export const LocalizationContext = createContext({
  translations,
  setAppLanguage: () => {},
  appLanguage: DEFAULT_LANGUAGE,
  initializeAppLanguage: () => {},
});

export const LocalizationProvider = ({ children }) => {
  const [appLanguage, setAppLanguage] = useState(DEFAULT_LANGUAGE);

  const setLanguage = language => {
    translations.setLanguage(language);
    setAppLanguage(language);
    AsyncStorage.setItem(APP_LANGUAGE, language);
  };

  const initializeAppLanguage = async () => {

    const currentLanguage = await AsyncStorage.getItem(APP_LANGUAGE);
    
    if (!currentLanguage) {
      const deviceLanguage = await DeviceInfo.getDeviceLocale();
      const localeCode = getLanguage(deviceLanguage);
      setLanguage(localeCode);
    } else setLanguage(currentLanguage);
  };

  return (
    <LocalizationContext.Provider
      value={{
        translations,
        setAppLanguage: setLanguage,
        appLanguage,
        initializeAppLanguage,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};
