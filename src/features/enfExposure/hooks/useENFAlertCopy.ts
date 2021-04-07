import moment from "moment";
import pupa from "pupa";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import useEnfAlertDates from "./useEnfAlertDates";

export default function useENFAlertCopy() {
  const { t } = useTranslation();
  const enfAlertDates = useEnfAlertDates();

  const lastExposedDate = moment(enfAlertDates?.displayExposureDate).format(
    "dddd DD MMM",
  );

  return useMemo(() => {
    if (enfAlertDates === null) {
      return undefined;
    }
    const daysTemplate =
      enfAlertDates?.daySinceLastExposure <= 1
        ? t("screens:dashboard:beenInCloseContact:day")
        : t("screens:dashboard:beenInCloseContact:days");

    const daysText = pupa(
      t("screens:dashboard:beenInCloseContact:daySinceLastExposure"),
      [enfAlertDates?.daySinceLastExposure, daysTemplate],
    );

    if (enfAlertDates.isRecentExposure) {
      return t("screens:dashboard:beenInCloseContact:lastExposed1");
    }

    return pupa(t("screens:dashboard:beenInCloseContact:lastExposed2"), [
      lastExposedDate,
      daysText,
    ]);
  }, [enfAlertDates, lastExposedDate, t]);
}
