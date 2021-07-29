import { hashLocationNumber } from "./hashLocationNumber";

it("hashes location number", () => {
  expect(hashLocationNumber("1234567890001")).toEqual(
    "apPBf9OWIovY1HkHAdAQrV1AF8gNmWbuTJu8UFWYfJ4VPcGGdDiNOywVgy3ZhOaU",
  );
});
