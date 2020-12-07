import { TestCommand } from "../testCommand";

export const createCrash: TestCommand = {
  command: "createCrash",
  title: "Create a crash",
  run() {
    throw new Error("This is a test javascript crash!");
  },
};
