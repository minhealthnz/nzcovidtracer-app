import { selectENFAlert } from "@features/enfExposure/selectors";
import moment from "moment-timezone";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import { ENFAlertData } from "../reducer";
import useCurrentDate from "./useCurrentDate";

export const calculateExposureDate = (
  currentDate: Date,
  enfAlert: ENFAlertData,
) => {
  /*
  ENF framework returns the UTC day rounded down.
  padding the exposure date (local) by 1 to give the most recent potential exposure date
  */
  const displayExposureDate = moment(enfAlert.exposureDate).add(1, "day");
  return {
    displayExposureDate,
    daySinceLastExposure: moment(currentDate).diff(displayExposureDate, "days"),
    isRecentExposure:
      moment(currentDate).diff(moment(enfAlert.exposureDate), "days") <= 1,
  };
};

export default function useEnfAlertDates() {
  //TODO use selectCurrentDate selector
  const currentDate = useCurrentDate();
  const enfAlert = useSelector(selectENFAlert);

  return useMemo(() => {
    if (enfAlert == null) {
      return null;
    }
    return calculateExposureDate(currentDate, enfAlert);
  }, [currentDate, enfAlert]);
}
