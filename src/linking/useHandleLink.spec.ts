import { matchUrl } from "./useHandleLink";

it("matches urls", () => {
  const universalLinkHost = "https://foo.com";
  const url = `${universalLinkHost}/scan?data=bar`;
  const result = matchUrl(url, {
    matcher: `${universalLinkHost}/scan`,
  });

  expect(result).toBe(true);
});

it("matches deep links", () => {
  const customScheme = "foo:";
  const url = `${customScheme}//scan`;
  const result = matchUrl(url, { matcher: `${customScheme}//scan` });

  expect(result).toBe(true);
});
