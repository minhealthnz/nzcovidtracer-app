import { recordAnalyticEvent } from "../analytics";
import { LinkingEvents } from "./events";

export const recordOpenDeepLink = (link: string) => {
  recordAnalyticEvent(LinkingEvents.OpenDeepLink, {
    attributes: {
      link,
    },
  });
};

export const recordOpenExternalLink = (link: string) => {
  recordAnalyticEvent(LinkingEvents.OpenExternalLink, {
    attributes: {
      link,
    },
  });
};
