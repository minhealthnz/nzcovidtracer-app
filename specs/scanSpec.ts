import { nanoid } from "@reduxjs/toolkit";
import { TestScope } from "cavy";
import expect from "expect";
import { Text } from "react-native";

import { clearState } from "./clearState";

export function ScanSpec(spec: TestScope) {
  spec.beforeEach(async () => {
    await clearState({
      clearDb: false,
    });
  });
  spec.describe("Scan", function () {
    spec.it("Add manual entry", async () => {
      await spec.press("tab.scan");
      await spec.press("tutorial.close");
      await spec.press("scan:addManualEntry");
      const insertedTitle = `Test location ${nanoid()}`;
      spec.fillIn("addManualDiaryEntry:placeOrActivity", insertedTitle);
      spec.fillIn("addManualDiaryEntry:addANote", "Test details");
      await spec.pause(500);
      spec.press("addManualDiaryEntry:save");
      const heading = (await spec.findComponent(
        "screen:recordedManually:heading",
      )) as Text;
      expect(heading.props.children).toEqual(insertedTitle);
    });
    spec.it("Edit manual entry", async () => {
      await spec.press("tab.scan");
      await spec.press("tutorial.close");
      await spec.press("goToHistory");
      await spec.press("diary.list.0");
      await spec.press("diaryEntry:edit");
      const insertedDetail = `Detail ${nanoid()}`;
      await spec.fillIn("editDiaryEntry:details", insertedDetail);
      await spec.pause(500);
      await spec.press("editDiaryEntry:save");
      const detail = (await spec.findComponent("diaryEntry:details")).props
        .children;
      expect(detail).toEqual(insertedDetail);
    });
    spec.it("Scan a qr code", async () => {
      await spec.press("tab.scan");
      await spec.press("tutorial.close");
      const camera = (await spec.findComponent("camera")) as any;
      camera?.props.onBarCodeRead({
        data: "NZCOVIDTRACER:eyJnbG4iOiI3MDAwMDAwMjQzOTUwIiwidmVyIjoiYzE5OjEiLCJ0eXAiOiJlbnRyeSIsIm9wbiI6IkJsdWUgU3RvbmUgVGFibGUgMSIsImFkciI6IlVuaXQgMSwgNTQ3IFdhaWtpbWloaWEgUm9hZFxuUkQgMi9EdW5zYW5kZWxcbkxlZXN0b24ifQ==",
        type: "qr",
      });
      await spec.exists("screens:visitRecorded");
      const component = (await spec.findComponent(
        "visitRecorded:name",
      )) as Text;
      expect(component.props.children).toEqual("Blue Stone Table 1");
    });
  });
}
