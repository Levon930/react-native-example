import LocalizedStrings from 'react-native-localization';
import { Languages } from 'enums';
import en from './strings/en.json';
import ua from './strings/ua.json';
import ru from './strings/ru.json';

export const DEFAULT_LANGUAGE = Languages.EN;

const translations = {
  ua,
  ru,
  en,
};

export default new LocalizedStrings(translations);
