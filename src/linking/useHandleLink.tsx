import { createLogger } from "@logger/createLogger";
import { useCallback, useEffect, useRef } from "react";
import { Linking } from "react-native";
import { parse, UrlWithParsedQuery } from "url";

export interface LinkOptions {
  matcher: string;
}

const { logError } = createLogger("useHandleLink");

export function useHandleLink(
  options: LinkOptions,
  callback: (url: UrlWithParsedQuery) => void,
) {
  const isInitialised = useRef(false);

  const handleUrl = useCallback(
    ({ url }) => {
      if (!matchUrl(url, options)) {
        return;
      }

      const parsedUrl = parse(url, true);

      callback(parsedUrl);
    },
    [callback, options],
  );

  // handles opening link from closed state
  useEffect(() => {
    // only handle once on start
    if (isInitialised.current) {
      return;
    }
    isInitialised.current = true;
    Linking.getInitialURL()
      .then((initialURL) => {
        if (initialURL) {
          handleUrl({
            url: initialURL,
          });
        }
      })
      .catch(logError);
  }, [handleUrl, isInitialised]);

  // handles foreground / background
  useEffect(() => {
    Linking.addEventListener("url", handleUrl);
    return () => Linking.removeEventListener("url", handleUrl);
  }, [handleUrl]);
}

export function matchUrl(url: string, { matcher }: LinkOptions) {
  return url.startsWith(matcher);
}
