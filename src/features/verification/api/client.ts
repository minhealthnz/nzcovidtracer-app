import Axios from "axios";

import config from "../../../config";

export const UnauthenticatedENFClient = Axios.create({
  baseURL: config.ENFServerUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
