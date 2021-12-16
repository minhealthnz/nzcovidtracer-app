import { nanoid } from "@reduxjs/toolkit";
import { parse } from "url";

import { buildEntry } from "./universalLinkHelper";

const cases = [
  [
    "https://develop--tracing-app-c03c63136ec0-bb2f4f2091bb.netlify.app/scan?source=url#data=NZCOVIDTRACER:eyJnbG4iOiI3MDAwMDAwMjQzOTUwIiwidmVyIjoiYzE5OjEiLCJ0eXAiOiJlbnRyeSIsIm9wbiI6IkJsdWUgU3RvbmUgVGFibGUgMSIsImFkciI6IlVuaXQgMSwgNTQ3IFdhaWtpbWloaWEgUm9hZFxuUkQgMi9EdW5zYW5kZWxcbkxlZXN0b24ifQ==",
    "link",
  ],
  [
    "https://develop--tracing-app-c03c63136ec0-bb2f4f2091bb.netlify.app/scan#data=NZCOVIDTRACER:eyJnbG4iOiI3MDAwMDAwMjQzOTUwIiwidmVyIjoiYzE5OjEiLCJ0eXAiOiJlbnRyeSIsIm9wbiI6IkJsdWUgU3RvbmUgVGFibGUgMSIsImFkciI6IlVuaXQgMSwgNTQ3IFdhaWtpbWloaWEgUm9hZFxuUkQgMi9EdW5zYW5kZWxcbkxlZXN0b24ifQ==",
    "nfc",
  ],
];

describe("#buildEntry", () => {
  it.each(cases)(
    "%s should create an entry with diary type of %s",
    async (url, diaryType) => {
      const currentUserId = nanoid();
      const matcher = new URL(url).href;
      const parsedUrl = parse(matcher, true);

      const lastScannedEntry = {
        gln: "abc",
        lastScanned: new Date(),
        id: "foo",
        type: undefined,
        name: "boo",
      };
      const entry = await buildEntry(
        parsedUrl,
        currentUserId,
        lastScannedEntry,
      );

      if (typeof entry !== "string" && entry != null) {
        expect(entry.type).toEqual(diaryType);
      }
    },
  );

  it("returns nfcDebouncingError when lastScannedEntry has the same gln and lastScanned date", async () => {
    const url =
      "https://develop--tracing-app-c03c63136ec0-bb2f4f2091bb.netlify.app/scan#data=NZCOVIDTRACER:eyJnbG4iOiI3MDAwMDAwMjQzOTUwIiwidmVyIjoiYzE5OjEiLCJ0eXAiOiJlbnRyeSIsIm9wbiI6IkJsdWUgU3RvbmUgVGFibGUgMSIsImFkciI6IlVuaXQgMSwgNTQ3IFdhaWtpbWloaWEgUm9hZFxuUkQgMi9EdW5zYW5kZWxcbkxlZXN0b24ifQ==";
    const currentUserId = nanoid();
    const matcher = new URL(url).href;
    const parsedUrl = parse(matcher, true);

    const lastScannedEntry = {
      gln: "7000000243950",
      lastScanned: new Date(),
      id: "foo",
      type: undefined,
      name: "boo",
    };
    const entry = await buildEntry(parsedUrl, currentUserId, lastScannedEntry);

    expect(entry).toEqual("nfcDebouncingError");
  });

  it("returns undefined when url is malformed", async () => {
    const url = "https://foo";
    const currentUserId = nanoid();
    const matcher = new URL(url).href;
    const parsedUrl = parse(matcher, true);

    const lastScannedEntry = {
      gln: "abc",
      lastScanned: new Date(),
      id: "foo",
      type: undefined,
      name: "boo",
    };
    const entry = await buildEntry(parsedUrl, currentUserId, lastScannedEntry);

    expect(entry).toEqual(undefined);
  });

  it("returns undefined when data is null", async () => {
    const url =
      "https://develop--tracing-app-c03c63136ec0-bb2f4f2091bb.netlify.app/scan#data=NZCOVIDTRACER:foo";
    const currentUserId = nanoid();
    const matcher = new URL(url).href;
    const parsedUrl = parse(matcher, true);

    const lastScannedEntry = {
      gln: "abc",
      lastScanned: new Date(),
      id: "foo",
      type: undefined,
      name: "boo",
    };
    const entry = await buildEntry(parsedUrl, currentUserId, lastScannedEntry);

    expect(entry).toEqual(undefined);
  });
});
