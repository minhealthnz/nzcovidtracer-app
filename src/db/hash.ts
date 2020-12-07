import base64 from "crypto-js/enc-base64";
import sha384 from "crypto-js/sha384";

export const hashLocationNumber = (locationNumber: string) => {
  const sha384GLN = sha384(locationNumber);
  return base64.stringify(sha384GLN);
};
