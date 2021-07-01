import { createLogger } from "@logger/createLogger";
import { Base64 } from "js-base64";

import { ScanData, ScanDataSurprise } from "./types";

function isQRScanDataValid(qrScanData: ScanData): boolean {
  const isInvalid =
    qrScanData.typ == null ||
    typeof qrScanData.typ !== "string" ||
    qrScanData.gln == null ||
    typeof qrScanData.gln !== "string" ||
    qrScanData.opn == null ||
    typeof qrScanData.opn !== "string" ||
    qrScanData.adr == null ||
    typeof qrScanData.adr !== "string" ||
    qrScanData.ver == null ||
    typeof qrScanData.ver !== "string";

  return !isInvalid;
}

function isQRScanSurpriseValid(data: ScanDataSurprise): boolean {
  const isInvalid =
    data.data == null ||
    data.data === undefined ||
    !Array.isArray(data.data) ||
    data.data.length === 0;
  return !isInvalid;
}

const { logError } = createLogger("parseBarcode");

export async function parseBarcode(
  data: string,
): Promise<ScanData | ScanDataSurprise | null> {
  if (!data) {
    return null;
  }
  if (data.startsWith("NZCOVIDTRACER")) {
    try {
      const base64String = data.substr(14);
      const decodedString = Base64.decode(base64String);
      const qrScanData: ScanData = JSON.parse(decodedString);

      const valid = isQRScanDataValid(qrScanData);

      return valid ? qrScanData : null;
    } catch (err) {
      logError(err);
      return null;
    }
  } else if (data.startsWith("RECARTDIVOCZN")) {
    try {
      const base64String = data.substr(14);
      const parts = base64String.split(".");
      if (parts.length !== 3) {
        throw new Error(
          "Unexpected QR code format for RECARTDIVOCZN" + JSON.stringify(parts),
        );
      }
      const decodedString = Base64.decode(parts[1]);
      const qrScanData: ScanDataSurprise = JSON.parse(decodedString);

      const valid = isQRScanSurpriseValid(qrScanData);

      return valid ? qrScanData : null;
    } catch (err) {
      logError(err);
      return null;
    }
  }
  return null;
}
