import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HOME_VI from './vi/home.json';
import LOGIN_VI from './vi/login.json';
import FOOTER_VI from './vi/footer.json';
import REGISTER_VI from './vi/register.json';
import PROFILE_VI from './vi/profile.json';
import HOME_EN from './en/home.json';
import LOGIN_EN from './en/login.json';
import FOOTER_EN from './en/footer.json';
import REGISTER_EN from './en/register.json';
import PROFILE_EN from './en/profile.json';
import MESSAGE_VI from './vi/message.json';
import MESSAGE_EN from './en/message.json';
import POST_VI from './vi/post.json';
import POST_EN from './en/post.json';
import ADMIN_VI from './vi/admin.json';
import ADMIN_EN from './en/admin.json';
import { localKey } from '../constants';

const lngDefault = localStorage.getItem(localKey.lng) || 'en';
export const locales = {
  en: 'English',
  vi: 'Tiếng Việt',
};
const resources = {
  vi: {
    home: HOME_VI,
    login: LOGIN_VI,
    footer: FOOTER_VI,
    register: REGISTER_VI,
    profile: PROFILE_VI,
    message: MESSAGE_VI,
    post: POST_VI,
    admin: ADMIN_VI,
  },
  en: {
    home: HOME_EN,
    login: LOGIN_EN,
    footer: FOOTER_EN,
    register: REGISTER_EN,
    profile: PROFILE_EN,
    message: MESSAGE_EN,
    post: POST_EN,
    admin: ADMIN_EN,
  },
};
i18n.use(initReactI18next).init({
  resources,
  lng: lngDefault,
  ns: ['home', 'login', 'footer', 'register', 'profile', 'message', 'post'],
  fallbackLng: lngDefault,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
