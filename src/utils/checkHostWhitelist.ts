import libUrl from "url";

export function checkHostWhitelist(
  url: string | undefined,
  hostWhitelist: "*" | string[],
) {
  if (url == null) {
    return false;
  }

  const urlObj = libUrl.parse(url);

  if (urlObj.host == null) {
    return false;
  }

  const host = `${urlObj.protocol ?? ""}//${urlObj.host ?? ""}`;

  if (hostWhitelist === "*") {
    return true;
  }

  return hostWhitelist.includes(host);
}
