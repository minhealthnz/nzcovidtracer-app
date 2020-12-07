import * as externalLinks from "./externalLinks";

it("externalLinks still have the same content", () => {
  expect(externalLinks).toMatchSnapshot();
});
