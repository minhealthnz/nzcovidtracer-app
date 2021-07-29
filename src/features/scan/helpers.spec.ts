import { parseBarcode } from "./helpers";

it("parses barcode", async () => {
  const data =
    "NZCOVIDTRACER:eyJnbG4iOiI3MDAwMDAwMjQzOTUwIiwidmVyIjoiYzE5OjEiLCJ0eXAiOiJlbnRyeSIsIm9wbiI6IkJsdWUgU3RvbmUgVGFibGUgMSIsImFkciI6IlVuaXQgMSwgNTQ3IFdhaWtpbWloaWEgUm9hZFxuUkQgMi9EdW5zYW5kZWxcbkxlZXN0b24ifQ";
  const result = await parseBarcode(data);
  expect(result).toEqual({
    gln: "7000000243950",
    ver: "c19:1",
    typ: "entry",
    opn: "Blue Stone Table 1",
    adr: "Unit 1, 547 Waikimihia Road\nRD 2/Dunsandel\nLeeston",
  });
});
