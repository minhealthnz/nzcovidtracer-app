import { useEffect, useState } from "react";

export function useToast(duration: number = 5000) {
  const [toastError, setToastError] = useState<string | undefined>();
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (toastError) {
        setToastError(undefined);
      }
    }, duration);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [toastError, setToastError, duration]);

  return [toastError, setToastError] as const;
}
