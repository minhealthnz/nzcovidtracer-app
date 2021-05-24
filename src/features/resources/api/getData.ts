import { RemoteSectionListData } from "@components/types";
import axios, { AxiosInstance, AxiosResponse } from "axios";

import config from "../../../config";

export interface CachedResponse<T> {
  data?: T;
  notModified: boolean;
  etag?: string;
  expires?: Date;
}

export const getData = async (
  etag?: string,
  client: AxiosInstance = axios,
): Promise<CachedResponse<RemoteSectionListData>> => {
  try {
    const response = await client.get(config.ResourcesUrl, {
      headers: {
        "if-none-match": etag == null ? undefined : `${etag}`,
        "cache-control": "no-cache",
      },
    });

    const expires = calcExpiry(response);

    return {
      data: response.data,
      notModified: false,
      etag: response.headers.etag,
      expires,
    };
  } catch (err) {
    if (err.isAxiosError) {
      if (err.response?.status === 304) {
        return {
          notModified: true,
          expires: calcExpiry(err.response),
        };
      }
    }
    throw err;
  }
};

function calcExpiry(response: AxiosResponse<any>) {
  return response.headers?.expires == null
    ? undefined
    : new Date(response.headers.expires);
}
