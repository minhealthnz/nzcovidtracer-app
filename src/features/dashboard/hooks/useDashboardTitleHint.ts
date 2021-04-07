import { selectENFAlert } from "@features/enfExposure/selectors";
import { selectMatch } from "@features/exposure/selectors";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export function useDashboardTitleHint() {
  const { t } = useTranslation();

  const exposureMatch = useSelector(selectMatch);
  const enfAlert = useSelector(selectENFAlert);

  const beenInContact = exposureMatch == null ? undefined : "beenInContact";
  const beenInCloseContact = enfAlert ? "beenInCloseContact" : null;
  const doubleExposure = !!beenInContact && !!beenInCloseContact;

  return doubleExposure
    ? t("accessibility:dashboard:notificationTitleHintDouble")
    : beenInCloseContact || beenInContact
    ? t("accessibility:dashboard:notificationTitleHintSingle")
    : undefined;
}
