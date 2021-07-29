import { nanoid } from "@reduxjs/toolkit";

import { createAnonymousUser, find, update } from "./user";

it("updates user", async () => {
  const nhi = nanoid();
  const { id } = await createAnonymousUser();

  await update(id, (user) => {
    user.nhi = nhi;
  });

  const user = await find(id);

  expect(user).not.toBe(undefined);
  expect(user!.nhi).toBe(nhi);
});

it("creates anonymous user once", async () => {
  const a = await createAnonymousUser();
  const b = await createAnonymousUser();
  expect(a).toEqual(b);
});
