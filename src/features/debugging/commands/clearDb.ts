import { createPrivate, createPublic } from "@db/create";

import { TestCommand } from "../testCommand";

export const clearDb: TestCommand = {
  title: "Clear databases",
  command: "clearDb",
  async run() {
    const privateDb = await createPrivate();
    privateDb.write(() => privateDb.deleteAll());
    privateDb.close();
    const publicDb = await createPublic();
    publicDb.write(() => publicDb.deleteAll());
    publicDb.close();
  },
};
