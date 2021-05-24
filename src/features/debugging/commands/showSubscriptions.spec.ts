import { formatStatus } from "./showSubscription";

it("formats status", () => {
  const status = formatStatus("granted", {
    foo: {
      fullfilled: true,
    },
    bar: {
      fullfilled: false,
    },
  });

  expect(status).toEqual(
    "[permission=granted] [foo=subscribed] [bar=not subscribed]",
  );
});
