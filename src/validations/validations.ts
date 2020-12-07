import { calcCheckInMinDate } from "@utils/checkInDate";
import { CountryCode, parsePhoneNumber } from "libphonenumber-js/min";
import * as yup from "yup";

const isDatePast = (value: number | null | undefined) => {
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 0);
  const then = value || 0;
  return endOfToday.getTime() >= then;
};

const checkInMinDate = (value: number | null | undefined) => {
  return (value || 0) >= calcCheckInMinDate().getTime();
};

const noNumbersOrSymbolsRegex = /^[-.'A-Za-zĀ-ŌÀ-ÖØ-öø-ÿŠŽā-ɏ ]*$/;
const codeRegex = /^\d{6}$/;
const dataRequestCodeRegex = /^[a-zA-Z\d]{6}$/;

export const placeOrActivityValidation = yup
  .string()
  .trim()
  .max(140, "validations:placeOrActivity:tooLong")
  .required("validations:placeOrActivity:required");

export const startDateValidation = yup
  .number()
  .test("no future", "validations:startDate:noFutureDate", isDatePast)
  .test(
    "no older than 60 days",
    "validations:startDate:noOlderThan60Days",
    checkInMinDate,
  )
  .required("validations:startDate:required");

export const detailsValidation = yup
  .string()
  .max(255, "validations:details:tooLong")
  .notRequired();

export const firstNameValidation = yup
  .string()
  .max(50, "validations:firstName:tooLong")
  .matches(noNumbersOrSymbolsRegex, "validations:firstName:noNumbersOrSymbols")
  .required("validations:firstName:required");

export const middleNameValidation = yup
  .string()
  .max(100, "validations:middleName:tooLong")
  .matches(noNumbersOrSymbolsRegex, "validations:middleName:noNumbersOrSymbols")
  .notRequired();

export const lastNameValidation = yup
  .string()
  .max(50, "validations:lastName:tooLong")
  .matches(noNumbersOrSymbolsRegex, "validations:lastName:noNumbersOrSymbols")
  .required("validations:lastName:required");

export const dateOfBirthValidation = yup
  .number()
  .test("no future", "validations:dateOfBirth:noFutureDate", isDatePast)
  .required("validations:startDate:required");

export const dataRequestCodeValidation = yup
  .string()
  .required("validations:dataRequestCode:required")
  .matches(dataRequestCodeRegex, "validations:dataRequestCode:invalidFormat");

export const enfRequestCodeValidation = yup
  .string()
  .required("validations:enfRequestCode:required")
  .matches(codeRegex, "validations:enfRequestCode:invalidFormat");

export const emailValidation = yup
  .string()
  .email("validations:email:notValid")
  .required("validations:email:required");

export const codeValidation = yup
  .string()
  .matches(codeRegex, "validations:code:notValid")
  .required("validations:code:required");

function validPhone(phone: (string | undefined)[] | null | undefined) {
  if (phone == null || phone[0] == null || phone[1] == null) {
    return false;
  }
  const countryCode = phone[1] as CountryCode;
  try {
    const parsed = parsePhoneNumber(phone[0], countryCode);
    if (parsed == null) {
      return false;
    }
    return parsed.isValid();
  } catch {
    return false;
  }
}

function phoneNotEmpty(phone: (string | undefined)[] | null | undefined) {
  return phone != null && !!phone[0] && !!phone[1];
}

export const phoneValidation = yup
  .array()
  .of(yup.string())
  .test("valid phone", "validations:phone:invalid", validPhone)
  .test("valid phone", "validations:phone:required", phoneNotEmpty);
