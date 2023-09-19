import moment from 'moment';
import { langMode, localKey } from './index';

const arrBreakTime = [
  { timeBreak: 'minute', abbreviateChar: { en: 'm', vi: ' phút' } },
  { timeBreak: 'minutes', abbreviateChar: { en: 'm', vi: ' phút' } },
  { timeBreak: 'hours', abbreviateChar: { en: 'h', vi: ' giờ' } },
  { timeBreak: 'hour', abbreviateChar: { en: 'h', vi: ' giờ' } },
  { timeBreak: 'days', abbreviateChar: { en: 'd', vi: ' ngày' } },
  { timeBreak: 'day', abbreviateChar: { en: 'd', vi: ' ngày' } },
  { timeBreak: 'years', abbreviateChar: { en: 'y', vi: ' năm' } },
  { timeBreak: 'year', abbreviateChar: { en: 'y', vi: ' năm' } },
];

const arrBreakNumbers = [
  { breakNumber: 9, abbreviateChar: { en: 'B', vi: 'T' } },
  { breakNumber: 6, abbreviateChar: { en: 'M', vi: 'Tr' } },
  { breakNumber: 3, abbreviateChar: { en: 'K', vi: 'N' } },
];
export const handleNumber = (number: number) => {
  const lang = localStorage.getItem(localKey.lng);
  let result: string | number = number;
  for (let index = 0; index < arrBreakNumbers.length; index++) {
    const { breakNumber, abbreviateChar } = arrBreakNumbers[index];
    const breakExponentialNumber = Math.pow(10, breakNumber);

    if (number > breakExponentialNumber) {
      result = `${Math.round((number * 10) / breakExponentialNumber) / 10}${
        lang === langMode.en ? abbreviateChar.en : abbreviateChar.vi
      }`;
      break;
    }
  }

  return result;
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  return moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
};

const dayOfWeek = [
  { en: 'Sunday', vi: 'Chủ nhật' },
  { en: 'Monday', vi: 'Thứ hai' },
  { en: 'Tuesday', vi: 'Thứ ba' },
  { en: 'Wednesday', vi: 'Thứ tư' },
  { en: 'Thursday', vi: 'Thứ năm' },
  { en: 'Friday', vi: 'Thứ sáu' },
  { en: 'Saturday', vi: 'Thứ bảy' },
];

export const getCurrentTime = () => {
  const currentDate = new Date();
  const lang = localStorage.getItem(localKey.lng);
  const time = moment(currentDate).format('dddd, DD/MM/YYYY - HH:mm');
  const timeSplit = time.split(', ');
  let dd: any = timeSplit[0].trim();
  const dayObject = dayOfWeek.find((day) => day.en === dd);
  if (dayObject && lang === langMode.vi) {
    dd = dayObject.vi;
  } else if (dayObject && lang === 'en') {
    dd = dayObject.en;
  }
  return `${dd}, ${timeSplit[1]}`;
};

export const findMax = (arr: number[]) => {
  if (arr.length === 0) {
    return 0;
  }
  return arr.reduce(
    (max: number, current: number) => (current > max ? current : max),
    arr[0]
  );
};

export const findSum = (data: any, field: any) => {
  return data.reduce((total: number, item:any) => {
    const value = parseInt(item[field], 10);
    if (!isNaN(value)) {
      return total + value;
    }
    return total;
  }, 0);
};

export const findStep = (num: number) => {
  const numberOfDigits =
    num === 0 ? 1 : Math.floor(Math.log10(Math.abs(num))) + 1;
  if (numberOfDigits === 1) {
    return 1;
  } else if (numberOfDigits === 2) {
    return num < 50 ? 5 : 10;
  } else {
    return num < 5 * numberOfDigits
      ? 5 * 10 ** (numberOfDigits - 3)
      : 10 * 10 ** (numberOfDigits - 3);
  }
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
) => {
  let timer: NodeJS.Timeout | null;
  return function (this: T, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(this, args);
    }, delay);
  } as T;
};
