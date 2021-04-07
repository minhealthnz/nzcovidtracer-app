import { createAction } from "@reduxjs/toolkit";

import { ENFNotificationSettings } from "./api";

export const setTestLocationsLink = createAction<string>(
  "enfExposure/setTestLocationsLink",
);

export const retrievedSettings = createAction<ENFNotificationSettings>(
  "enfExposure/retrievedSettings",
);
