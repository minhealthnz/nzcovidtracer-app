import { join } from "path";
import { useCallback, useEffect } from "react";
import { Linking } from "react-native";
import { parse } from "url";

export function useHandleLink(matcher: string, callback: () => void) {
  const handleUrl = useCallback(
    ({ url }) => {
      const parsedUrl = parse(url);

      const path = join(parsedUrl.host ?? "", parsedUrl.path ?? "");

      const isDeepLink = parsedUrl.protocol === "nzcovidtracer:";

      if (isDeepLink && path === matcher) {
        callback();
      }
    },
    [callback, matcher],
  );

  useEffect(() => {
    Linking.addEventListener("url", handleUrl);
    return () => Linking.removeEventListener("url", handleUrl);
  }, [handleUrl]);
}
