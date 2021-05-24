import { useCallback } from "react";
import { Linking } from "react-native";

import { recordOpenDeepLink, recordOpenExternalLink } from "./analytics";

export function useLinking() {
  const openExternalLink = useCallback((link: string) => {
    Linking.openURL(link);
    recordOpenExternalLink(link);
  }, []);

  const openDeepLink = useCallback((link: string) => {
    Linking.openURL(link);
    recordOpenDeepLink(link);
  }, []);

  return { openExternalLink, openDeepLink };
}
