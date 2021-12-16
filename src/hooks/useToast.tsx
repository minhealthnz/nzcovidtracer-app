import { useEffect, useState } from "react";

export function useToast(duration: number = 5000, callBack?: () => void) {
  const [toastMessage, setToastMessage] = useState<string | undefined>();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (toastMessage) {
        setToastMessage(undefined);
        !!callBack && callBack();
      }
    }, duration);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [toastMessage, setToastMessage, duration, callBack]);

  return [toastMessage, setToastMessage] as const;
}
