import { useSelector } from "react-redux";

import { selectShareDiary } from "../selectors";

export function useShareDiaryRequest(requestId?: string) {
  const shareDiary = useSelector(selectShareDiary);

  return requestId == null || shareDiary.requestId === requestId
    ? shareDiary
    : undefined;
}
