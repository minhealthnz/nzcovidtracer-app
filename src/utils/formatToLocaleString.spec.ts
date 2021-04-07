import { formatToLocaleString } from "./formatToLocaleString";

it.each([
  [999, "999"],
  [0, "0"],
  [1000, "1,000"],
  ["1234 new", "1,234 new"],
])("convert %s to %s", (input, output) => {
  const commaSeperatedNumber = formatToLocaleString(input);

  expect(commaSeperatedNumber).toEqual(output);
});
