import config from "../config";

export const customScheme = "nzcovidtracer:";

export function matchDeeplink(path: string) {
  return `${customScheme}//${path}`;
}

export function matchUniversalLink(path: string) {
  return `${config.WebAppBaseUrl}/${path}`;
}
