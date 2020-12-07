import { fromByteArray } from "base64-js";

export function parseHexString(str: string) {
  var bytes = [];
  for (let i = 0; i < str.length; i += 2) {
    const byte = parseInt(str.substring(i, i + 2), 16);
    bytes.push(byte);
  }

  return new Uint8Array(bytes);
}

export function hexToBase64(hex: string) {
  const bytes = parseHexString(hex);
  return fromByteArray(bytes);
}
