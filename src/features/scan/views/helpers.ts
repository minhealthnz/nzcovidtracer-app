import { DiaryEntry, DiaryEntryType } from "@features/diary/types";
import base64 from "crypto-js/enc-base64";
import sha384 from "crypto-js/sha384";

import { QRScanData } from "./Scan";

// Move this to reducer
export function createDiaryEntry(
  qrScanData: QRScanData,
  type: DiaryEntryType,
  id: string,
  userId: string,
) {
  const sha384GLN = sha384(qrScanData.gln);
  const base64GLN = base64.stringify(sha384GLN);

  const diaryEntry: DiaryEntry = {
    id,
    userId,
    type,
    startDate: new Date().getTime(),
    name: qrScanData.opn,
    address: qrScanData.adr,
    globalLocationNumber: qrScanData.gln,
    globalLocationNumberHash: base64GLN,
  };

  return diaryEntry;
}
