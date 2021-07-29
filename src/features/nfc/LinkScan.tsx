import { selectUserId } from "@domain/user/selectors";
import { AddDiaryEntry, addEntry } from "@features/diary/reducer";
import { selectHasOnboarded } from "@features/onboarding/selectors";
import { createDiaryEntry, parseBarcode } from "@features/scan/helpers";
import { ScanScreen } from "@features/scan/screens";
import { useAppDispatch } from "@lib/useAppDispatch";
import { useHandleLink } from "@linking/useHandleLink";
import { createLogger } from "@logger/createLogger";
import { navigationRef } from "@navigation/navigation";
import { nanoid, unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import { useCallback } from "react";
import { useSelector } from "react-redux";

const { logWarning } = createLogger("LinkScan.tsx");

import { ScanData } from "@features/scan/types";

import config from "../../config";
import { setLastScannedEntry, setNfcDebounce } from "./reducer";
import { selectLastScannedEntry } from "./selectors";

export function LinkScan() {
  const matcher = new URL("scan", config.WebAppBaseUrl).href;
  const userHasOnboarded = useSelector(selectHasOnboarded);
  const currentUserId = useSelector(selectUserId);
  const newId = nanoid();
  const dispatch = useAppDispatch();
  const lastScannedEntry = useSelector(selectLastScannedEntry);
  //TODO include into build env.
  const debounceDurationInMinute = 5;

  useHandleLink(
    {
      matcher,
    },
    async (url) => {
      if (!userHasOnboarded) {
        logWarning("user hasn't onboarded");
        return;
      }

      const data = url.hash?.substr(6);

      if (data == null || typeof data !== "string") {
        // TODO
        logWarning("data is null");
        return;
      }

      const barcodeData = await parseBarcode(data);
      if (barcodeData == null) {
        // TODO
        logWarning("cannot parse barcode");
        return;
      }

      if (currentUserId == null) {
        logWarning("currentUserId is null");
        return;
      }
      const scanData = (barcodeData as unknown) as ScanData;
      const isScannedTooEarly =
        moment
          .duration(
            moment(new Date()).diff(moment(lastScannedEntry.lastScanned)),
          )
          .asMinutes() <= debounceDurationInMinute;

      if (
        !!lastScannedEntry.id &&
        scanData.gln === lastScannedEntry.gln &&
        isScannedTooEarly
      ) {
        logWarning(
          `same gln detected. try again after ${debounceDurationInMinute}`,
        );
        dispatch(setNfcDebounce(true));
        return;
      }

      const entry = createDiaryEntry(scanData, "nfc", newId, currentUserId);

      saveEntryAsync(entry);
    },
  );

  const saveEntryAsync = useCallback(
    async (entry: AddDiaryEntry) => {
      if (entry.id == null) {
        throw new Error("Entry has no id!");
      }
      try {
        await dispatch(addEntry(entry)).then(unwrapResult);
        await dispatch(setLastScannedEntry(entry));
        navigationRef.current?.navigate(ScanScreen.Recorded, {
          id: entry.id,
        });
        await dispatch(setNfcDebounce(false));
      } catch (err) {
        // TODO Create a nfc tag failure page
        navigationRef.current?.navigate(ScanScreen.ScanNotRecorded);
      }
    },
    [dispatch],
  );

  return null;
}
