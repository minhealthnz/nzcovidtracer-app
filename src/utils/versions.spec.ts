import { parseVersion } from "./versions";

it.each([
  ["12.5", { major: 12, minor: 5 }],
  ["12.5.1", { major: 12, minor: 5 }],
  ["12.6", { major: 12, minor: 6 }],
  ["12.6,1", { major: 12, minor: 6 }],
  ["12", undefined],
  ["foo", undefined],
  [8, { major: 8 }],
])("parses version %s to %s", (version, result) => {
  expect(parseVersion(version)).toEqual(result);
});
