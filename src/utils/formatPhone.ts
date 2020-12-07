import {
  CountryCode as CountryCode2,
  parsePhoneNumber,
} from "libphonenumber-js";
import { CountryCode } from "react-native-country-picker-modal";

export function formatPhone(phone: string, countryCode: CountryCode) {
  try {
    const phoneNumber = parsePhoneNumber(phone, countryCode as CountryCode2);
    return phoneNumber?.formatInternational();
  } catch (err) {
    return "";
  }
}
