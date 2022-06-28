import useDeepMemo from "@hooks/useDeepMemo";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { useExposure } from "react-native-exposure-notification-service";
import { useDispatch, useSelector } from "react-redux";

import { processENFContacts } from "../reducer";
import {
  selectENFNotificationConfig,
  selectLastEnfAlertDismissDate,
} from "../selectors";

export function useProcessEnfContacts() {
  const dispatch = useDispatch();
  const { contacts, getCloseContacts } = useExposure();
  const lastEnfAlertDismissDate = useSelector(selectLastEnfAlertDismissDate);
  const notificationConfig = useSelector(selectENFNotificationConfig);

  const memoizedContacts = useDeepMemo(contacts);
  const memoizedConfig = useDeepMemo(notificationConfig);

  // This side effect might be redundant. It is just intended to force exposure.contants update when user opens Dashboard.
  // When we use simulateExposure, it does not produce exposure event and do not trigger exposure.contacts update
  // however, contacts are updated on the service side, we just need to nudge plug-in to update it (and getCloseContacts does it)
  // So if you remove it, plz make sure you use "Display all close contacts" command in the Dev Menu after you trigger Simulate exposure.
  //
  // I guess (I didn't test), in production it is not needed, and contacts will be eventually updated as the service
  // checks for exposure and do background updates. However, it won't do any harm if left. Just overly defensive update.
  // Also, if you decide to remove it, please test contact TTL. When 14 days (or what ever TTL we configure) passed and
  // the contact is auto removed, does the plug-in update exposure.contacts?

  useFocusEffect(
    useCallback(() => {
      const updateContacts = async () => {
        await getCloseContacts();
      };
      updateContacts();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []), // it is intended to disable eslint rule  here!
  );

  useEffect(() => {
    if (memoizedContacts !== undefined && memoizedContacts.length > 0) {
      dispatch(processENFContacts(memoizedContacts));
    }
  }, [memoizedContacts, lastEnfAlertDismissDate, memoizedConfig, dispatch]);
}
