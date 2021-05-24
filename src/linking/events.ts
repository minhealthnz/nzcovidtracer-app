export const LinkingEvents = {
  OpenExternalLink: "openExternalLink",
  OpenDeepLink: "openDeepLink",
} as const;

export type LinkingEventPayloads = {
  [LinkingEvents.OpenExternalLink]: {
    attributes: {
      link: string;
    };
  };
  [LinkingEvents.OpenDeepLink]: {
    attributes: {
      link: string;
    };
  };
};
