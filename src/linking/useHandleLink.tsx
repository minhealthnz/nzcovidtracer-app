import { createLogger } from "@logger/createLogger";
import { debounce } from "lodash";
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

  const debouncedHandleUrl = debounce(handleUrl, 500, {
    leading: true,
    trailing: false,
  });

  // handles opening link from closed state
  useEffect(() => {
    // only handle once on start
    if (!isInitialised.current) {
      isInitialised.current = true;
      Linking.getInitialURL()
        .then((initialURL) => {
          if (initialURL) {
            debouncedHandleUrl({
              url: initialURL,
            });
          }
        })
        .catch(logError);
    }

    // handles foreground / background
    const subscription = Linking.addEventListener("url", debouncedHandleUrl);
    return () => {
      subscription.remove();
    };
  }, [debouncedHandleUrl, isInitialised]);
}

export function matchUrl(url: string, { matcher }: LinkOptions) {
  return url.startsWith(matcher);
}
