import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import mainResources from "./src/translations/strings";

export const init = (language = "en") => {
  return i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      ns: ["common", "home", "forms", "backend", "validations"],
      defaultNS: "common",
      //TODO: Look for a better way of handling resources.
      resources: {
        en: { ...mainResources.en },
      },
      lng: language,
      fallbackLng: "en",

      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });
};

export default init();
