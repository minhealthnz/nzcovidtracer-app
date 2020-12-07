import { TestScope } from "cavy";

import { clearState } from "./clearState";

export function NHISpec(spec: TestScope) {
  spec.beforeEach(async () => {
    await clearState();
  });
  spec.describe("NHI", () => {
    spec.it("Adds nhi", async () => {
      await spec.pause(500);
      await spec.press("tab.profile");
      await spec.press("profile:nhi");
      await spec.fillIn("addNhi:input", "ZZZ1234");
      await spec.press("addNhi:next");
      await spec.press("nhiAdded:done");
    });
  });
}
