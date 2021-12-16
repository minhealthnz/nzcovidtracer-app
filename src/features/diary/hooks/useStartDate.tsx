import { getOffsetInMins, isOutsideNZ } from "@lib/helpers";
import { useCallback, useState } from "react";

export function useStartDate(date: number, isEdit: boolean = false) {
  date = getTime(date, isEdit, true);
  const [startDate, setStartDate] = useState<number>(date);

  const setDate = useCallback((time: number) => {
    const changedTime = getTime(time);
    setStartDate(changedTime);
  }, []);

  return [startDate, setDate] as const;
}

const getTime = (
  time: number,
  reverse: boolean = false,
  initial: boolean = false,
) => {
  if (isOutsideNZ()) {
    const offset = getOffsetInMins() * 60000;
    time = reverse ? time - offset : initial ? time : time + offset;
  }

  return time;
};
