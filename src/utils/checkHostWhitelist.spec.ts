import { checkHostWhitelist } from "./checkHostWhitelist";

const data: [string | undefined, "*" | string[], boolean][] = [
  ["http://foo.com/assets/image.png", "*", true],
  ["http://foo.com/assets/image.png", ["http://foo.com"], true],
  ["https://foo.com/assets/image.png", ["http://foo.com"], false],
  ["http://foo.com/assets/image.png", ["http://bar.com"], false],
  ["invalid", "*", false],
  [undefined, "*", false],
];

describe("#checkHostWhitelist", () => {
  it.each(data)(
    "filters image url with white list %s %s",
    (imageUrl: string | undefined, whitelist, filtered) => {
      expect(checkHostWhitelist(imageUrl, whitelist)).toEqual(filtered);
    },
  );
});
