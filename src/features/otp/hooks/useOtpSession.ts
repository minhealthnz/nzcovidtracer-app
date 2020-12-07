import { useMemo } from "react";
import { useSelector } from "react-redux";

import { selectOTPSessions } from "../selectors";

export function useOtpSession(id: string) {
  const byId = useSelector(selectOTPSessions);
  const session = useMemo(() => byId[id], [byId, id]);

  return session;
}
