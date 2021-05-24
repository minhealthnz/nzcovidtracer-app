import config, { _buildUrl, getBuildId, readHostWhitelist } from "./config";

it("constructs url from subdomain", () => {
  expect(_buildUrl("", "example.com", "api")).toEqual(
    "https://api.example.com",
  );
});

it("uses overrides if available", () => {
  expect(_buildUrl("http://custom.example.com", "example.com", "api")).toEqual(
    "http://custom.example.com",
  );
});

it("still have the same content", () => {
  expect(config).toMatchSnapshot();
});

describe("#getBuildId", () => {
  const cases = [
    [undefined, undefined, "1"],
    ["1000", undefined, "1001"],
    [undefined, "1", "1"],
    ["1000", "2", "1002"],
    ["foo", "1", "1"],
    ["1000", "foo", "1001"],
  ];
  it.each(cases)("constructs build id %s %s", (offset, buildId, result) => {
    expect(getBuildId(offset, buildId)).toEqual(result);
  });
});

describe("#readHostWhitelist", () => {
  it.each([
    ["*", "*"],
    ["", "*"],
    ["foo.com,bar.com", ["foo.com", "bar.com"]],
    ["foo.com", ["foo.com"]],
  ])("reads host white list %s %s", (config, hostWhitelist) => {
    expect(readHostWhitelist(config)).toEqual(hostWhitelist);
  });
});
