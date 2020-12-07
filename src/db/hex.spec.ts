import { hexToBase64 } from "./hex";

it("parse hex to base64", () => {
  const result = hexToBase64(
    "6a93c17fd396228bd8d4790701d010ad5d4017c80d9966ee4c9bbc5055987c9e153dc18674388d3b2c15832dd984e694",
  );
  expect(result).toEqual(
    "apPBf9OWIovY1HkHAdAQrV1AF8gNmWbuTJu8UFWYfJ4VPcGGdDiNOywVgy3ZhOaU",
  );
});
