import { TestScope } from "cavy";

import { clearState } from "./clearState";

export function DiarySpec(spec: TestScope) {
  spec.beforeEach(async () => {
    await clearState({
      clearDb: false,
    });
  });
  spec.it("Share diary", async () => {
    await spec.press("tab.profile");
    await spec.press("profile:shareDiary");
    await spec.fillIn("confirmDetails:firstName", "abc");
    await spec.fillIn("confirmDetails:middleName", "def");
    await spec.fillIn("confirmDetails:lastName", "ghi");
    await spec.pause(500);
    await spec.press("confirmDetails:continue");
    await spec.fillIn("shareDiary:dataRequestCode", "12345");
    await spec.press("shareDiary:share");
    await spec.exists("screens:diaryShared");
    await spec.press("diaryShared:done");
    await spec.exists("screens:profile");
  });
}
