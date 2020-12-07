import strings from "./strings";

it("strings still have the same content", () => {
  expect(strings).toMatchSnapshot();
});
