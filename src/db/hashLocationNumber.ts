import base64 from "crypto-js/enc-base64";
import sha384 from "crypto-js/sha384";

/**
 * Hash a location number,
 * If location number is empty, return an empty string
 */
export const hashLocationNumber = (locationNumber: string) => {
  if (locationNumber.length === 0) {
    return "";
  }
  const sha384GLN = sha384(locationNumber);
  return base64.stringify(sha384GLN);
};
