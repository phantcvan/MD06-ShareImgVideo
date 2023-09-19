import { notification } from 'antd';
import { PATH } from "../services/list-path"

// breakpoint responsive
export const bp = {
  xs: 480,
  sm: 768,
  md: 1024,
  lg: 1440
}
// key localStorage
export const localKey = {
  lng: "lngDefault",
  theme: "theme",
  token: "access_token",
}
// theme Mode
export const themeMode = {
  dark: "Dark",
  light: "Light",
}
// language Mode
export const langMode = {
  en: "en",
  vi: "vi",
}


export const locations = [ PATH.LOGIN, PATH.REGISTER]

