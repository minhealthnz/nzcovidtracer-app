import { notifyRegisterDeviceRetrySuccess } from "@features/verification/service/notifyRegisterDeviceRetrySuccess";

import { TestCommand } from "../testCommand";

export const notifyDeviceRegistered: TestCommand = {
  title: "Simulate device registered",
  command: "notifyDeviceRegistered",
  async run() {
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
    await notifyRegisterDeviceRetrySuccess();
  },
};
