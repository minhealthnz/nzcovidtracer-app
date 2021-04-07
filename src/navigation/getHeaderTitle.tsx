import { createLogger } from "@logger/createLogger";
import { TabScreen } from "@views/screens";
import { TFunction } from "i18next";

const { logWarning } = createLogger("getTabHeaderOptions");

export function getHeaderTitle(
  initialTab: TabScreen.Home | TabScreen.RecordVisit,
  routeName: string | undefined,
  t: TFunction,
) {
  const tabs: string[] = [
    TabScreen.RecordVisit,
    TabScreen.Home,
    TabScreen.MyData,
  ];
  routeName = routeName || initialTab;
  routeName = tabs.includes(routeName) ? routeName : initialTab;

  switch (routeName) {
    case TabScreen.RecordVisit:
      return t("screenTitles:recordAVisit");
    case TabScreen.Home:
      return t("screenTitles:dashboard");
    case TabScreen.MyData:
      return t("screenTitles:myProfile");
    default:
      logWarning(`Header not found for route name: ${routeName}`);
      return undefined;
  }
}
