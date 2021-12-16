import { selectUserId } from "@domain/user/selectors";
import { AddDiaryEntry, addEntry } from "@features/diary/reducer";
import { selectHasOnboarded } from "@features/onboarding/selectors";
import { ScanScreen } from "@features/scan/screens";
import { useAppDispatch } from "@lib/useAppDispatch";
import { useHandleLink } from "@linking/useHandleLink";
import { createLogger } from "@logger/createLogger";
import { navigationRef } from "@navigation/navigation";
import { unwrapResult } from "@reduxjs/toolkit";
import { isString } from "lodash";
import { useCallback } from "react";
import { useSelector } from "react-redux";

const { logWarning } = createLogger("LinkScan.tsx");

import config from "../../config";
import { setLastScannedEntry, setNfcDebounce } from "./reducer";
import { selectLastScannedEntry } from "./selectors";
import { buildEntry, nfcDebouncingError } from "./universalLinkHelper";

export function LinkScan() {
  const matcher = new URL("scan", config.WebAppBaseUrl).href;
  const userHasOnboarded = useSelector(selectHasOnboarded);
  const currentUserId = useSelector(selectUserId);
  const dispatch = useAppDispatch();
  const lastScannedEntry = useSelector(selectLastScannedEntry);

  useHandleLink(
    {
      matcher,
    },
    async (url) => {
      if (!userHasOnboarded) {
        logWarning("user hasn't onboarded");
        return;
      }

      const entry = await buildEntry(url, currentUserId, lastScannedEntry);

      if (entry == null) {
        return;
      }

      if (isString(entry) && entry === nfcDebouncingError) {
        dispatch(setNfcDebounce(true));
        return;
      } else {
        saveEntryAsync(entry);
      }
    },
  );

  const saveEntryAsync = useCallback(
    async (entry: AddDiaryEntry) => {
      if (entry.id == null) {
        throw new Error("Entry has no id!");
      }
      try {
        await dispatch(addEntry(entry)).then(unwrapResult);

        if (entry.type === "nfc") {
          await dispatch(setLastScannedEntry(entry));
          await dispatch(setNfcDebounce(false));
        }

        navigationRef.current?.navigate(ScanScreen.Recorded, {
          id: entry.id,
        });
      } catch (err) {
        // TODO Create a nfc tag failure page
        navigationRef.current?.navigate(ScanScreen.ScanNotRecorded);
      }
    },
    [dispatch],
  );

  return null;
}
