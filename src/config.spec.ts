import config, { getBuildId, readHostWhitelist } from "./config";

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
  ])("reads host white list %s %s", (conf, hostWhitelist) => {
    expect(readHostWhitelist(conf)).toEqual(hostWhitelist);
  });
});
