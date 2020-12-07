import Axios from "axios";

import config from "../../config";

export interface UpdateLocationHistoryV2 {
  consentCode: string;
  locations: {};
}

export interface LocationItem {
  gln?: string;
  locationName?: string;
  locationType?: string;
  note?: string;
  entryType?: LocationItemType;
  time?: string;
}

export enum LocationItemType {
  Scanned = 0,
  Manual = 1,
}

export const updateLocationHistory = async (
  code: string,
  locations: LocationItem[],
) => {
  const url = `${config.ApiBaseUrl}/v2/user/location-history`;
  const payload: UpdateLocationHistoryV2 = {
    consentCode: code,
    locations,
  };

  await Axios.post(url, payload);
};

export const errors = {
  validation: "urn:errors:validation",
};
