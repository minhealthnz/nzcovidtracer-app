import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface LocationOptions {
  isFavourite?: boolean;
  locationType: "manual" | "scan";
}

export function useLocationAccessibility(options: LocationOptions) {
  const { isFavourite, locationType } = options;
  const savedManualEntry = locationType === "manual" && isFavourite;
  const unSavedManualEntry = locationType === "manual" && !isFavourite;
  const savedScannedLocation = locationType === "scan" && isFavourite;
  const { t } = useTranslation();

  const locationIconAccessibilityLabel = useMemo(() => {
    if (savedManualEntry) {
      return [
        t("components:locationIcon:saved"),
        t("components:locationIcon:manualEntry"),
      ].join(" ");
    } else if (unSavedManualEntry) {
      return t("components:locationIcon:manualEntry");
    } else if (savedScannedLocation) {
      return [
        t("components:locationIcon:saved"),
        t("components:locationIcon:scannedLocation"),
      ].join(" ");
    } else {
      return t("components:locationIcon:scannedLocation");
    }
  }, [savedManualEntry, unSavedManualEntry, savedScannedLocation, t]);

  return { locationIconAccessibilityLabel };
}
