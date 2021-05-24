import { RemoteSectionListData } from "@components/types";
import { resourcesLink } from "@constants";
import { selectTestLocationsLink } from "@features/dashboard/selectors";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export function useDefaultSections() {
  const { t } = useTranslation();

  const testLocationsLink = useSelector(selectTestLocationsLink);

  const defaultSections: RemoteSectionListData = {
    sections: [
      {
        title: t("screens:dashboard:sections:advice"),
        data: [
          {
            component: "Card",
            icon: require("@features/dashboard/assets/icons/test.png"),
            title: t("screens:dashboard:cards:test:title"),
            body: t("screens:dashboard:cards:test:description"),
            externalLink: testLocationsLink,
          },
          {
            component: "Card",
            icon: require("@features/dashboard/assets/icons/information.png"),
            title: t("screens:dashboard:cards:moreInfo:title"),
            body: t("screens:dashboard:cards:moreInfo:description"),
            externalLink: resourcesLink,
          },
          {
            component: "Card",
            icon: require("@features/dashboard/assets/icons/be-kind.png"),
            title: t("screens:dashboard:cards:unite:title"),
            body: t("screens:dashboard:cards:unite:description"),
            action: "share-app",
          },
          {
            component: "InfoBlock",
            icon: require("@features/dashboard/assets/icons/wash-your-hands.png"),
            title: t("screens:dashboard:footer:title"),
            body: t("screens:dashboard:footer:detail"),
          },
        ],
      },
    ],
  };

  return defaultSections;
}
