import { createDiaryEntry, parseBarcode } from "@features/scan/helpers";
import { ScanData } from "@features/scan/types";
import { createLogger } from "@logger/createLogger";
import { nanoid } from "@reduxjs/toolkit";
import { isString } from "lodash";
import moment from "moment";
import { Alert } from "react-native";
import { UrlWithParsedQuery } from "url";

import { LastScannedEntry } from "./reducer";
const { logWarning } = createLogger("LinkScan.tsx");

export const debounceDurationInMinute = 5;
export const nfcDebouncingError = "nfcDebouncingError";

export async function buildEntry(
  url: UrlWithParsedQuery,
  currentUserId: string | undefined,
  lastScannedEntry: LastScannedEntry,
) {
  if (currentUserId == null) {
    logWarning("currentUserId is null");
    return;
  }

  const data = url.hash?.substr(6);
  const newId = nanoid();
  const type = isLink(url) ? "link" : "nfc";

  if (data == null || !isString(data)) {
    logWarning("data is null");
    return;
  }

  const barcodeData = await parseBarcode(data);

  if (barcodeData == null) {
    if (type === "link") {
      logWarning("Invalid link data");
      showError(
        "The link you've tapped is not an official NZ COVID Tracer location link.",
      );
      return;
    } else {
      logWarning("Invalid nfc data");
      showError("This is not an official NZ COVID Tracer NFC tag.");
      return;
    }
  }

  const scanData = (barcodeData as unknown) as ScanData;

  if (type === "nfc") {
    // From NFC
    const isScannedTooEarly =
      moment
        .duration(moment(new Date()).diff(moment(lastScannedEntry.lastScanned)))
        .asMinutes() <= debounceDurationInMinute;

    if (
      !!lastScannedEntry.id &&
      scanData.gln === lastScannedEntry.gln &&
      isScannedTooEarly
    ) {
      logWarning(
        `same gln detected. try again after ${debounceDurationInMinute}`,
      );
      return nfcDebouncingError;
    }
  }

  return createDiaryEntry(scanData, type, newId, currentUserId);
}

export const isLink = (url: UrlWithParsedQuery) =>
  url.query && url.query.source && url.query.source === "url";

const showError = (message: string) => {
  return Alert.alert(
    "We couldn't add a diary entry",
    message,
    [
      {
        text: "Ok",
        onPress() {
          return;
        },
      },
    ],
    {
      cancelable: false,
    },
  );
};
