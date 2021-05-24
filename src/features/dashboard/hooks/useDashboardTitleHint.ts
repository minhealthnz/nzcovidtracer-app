import { selectENFAlert } from "@features/enfExposure/selectors";
import { selectMatch } from "@features/exposure/selectors";
import pupa from "pupa";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export function useDashboardTitleHint(index: number, numberOfTabs: number) {
  const { t } = useTranslation();

  const exposureMatch = useSelector(selectMatch);
  const enfAlert = useSelector(selectENFAlert);

  const beenInContact = exposureMatch == null ? undefined : "beenInContact";
  const beenInCloseContact = enfAlert ? "beenInCloseContact" : null;
  const doubleExposure = !!beenInContact && !!beenInCloseContact;

  const hint = useMemo(() => {
    if (index === 0) {
      return t("topTabs:todayAccessibilityHint");
    } else {
      return t("topTabs:resourcesAccessibilityHint");
    }
  }, [t, index]);

  const exposureHint = useMemo(() => {
    if (index === 0) {
      return doubleExposure
        ? t("accessibility:dashboard:notificationTitleHintDouble")
        : beenInCloseContact || beenInContact
        ? t("accessibility:dashboard:notificationTitleHintSingle")
        : "";
    } else {
      return "";
    }
  }, [beenInCloseContact, beenInContact, doubleExposure, t, index]);

  const tabAccessibilityLabel = useMemo(() => {
    return pupa(t("topTabs:tabAccessibilityLabel"), [index + 1, numberOfTabs]);
  }, [index, numberOfTabs, t]);

  const titleAccessibilityLabel = useMemo(() => {
    if (index === 0) {
      return t("topTabs:todayAccessibilityLabel");
    } else {
      return t("topTabs:resourcesAccessibilityLabel");
    }
  }, [t, index]);

  const accessibilityLabel = [
    titleAccessibilityLabel,
    tabAccessibilityLabel,
  ].join(", ");

  const accessibilityHint = [hint, exposureHint].join(". ");

  return { accessibilityLabel, accessibilityHint };
}
