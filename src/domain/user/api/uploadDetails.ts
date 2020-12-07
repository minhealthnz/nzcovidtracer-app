import Axios from "axios";

import config from "../../../config";

export interface UploadDetails {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  ethnicity?: {
    selected?: string[];
    other?: string;
  };
}

export const uploadDetails = async (token: string, payload: UploadDetails) => {
  await Axios.patch(`${config.ApiBaseUrl}/user/details`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
