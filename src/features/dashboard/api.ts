import { createLogger } from "@logger/createLogger";
import Axios from "axios";
import _ from "lodash";
import * as yup from "yup";

import config from "../../config";
import { Statistics, StatItem } from "./types";

const { logError } = createLogger("stats/api");

const statItemSchema = yup.object<StatItem>().shape({
  value: yup.string().required(),
  dailyChange: yup.lazy((value) =>
    typeof value === "number"
      ? yup.number().optional()
      : yup.string().optional(),
  ),
  dailyChangeIsGood: yup.boolean().optional(),
  icon: yup.string().required(),
  subtitle: yup.string().required(),
  backgroundColor: yup.string().optional(),
  url: yup.string().optional(),
});

const statItemsSchema = yup.array().of(yup.array().of(statItemSchema));

export const statisticSchema = yup.object<Statistics>().shape({
  title: yup.string().required(),
  dashboardItems: statItemsSchema,
  sourceUrl: yup.string().required(),
  sourceDisplay: yup.string().required(),
});

export async function getStats(
  isManualRefresh?: boolean,
): Promise<{ stats: Partial<Statistics>; expires: string }> {
  try {
    const response = await Axios.get(config.CovidStatsUrl, {
      headers: isManualRefresh
        ? {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          }
        : {},
    });
    return {
      stats: parseStats(response.data),
      expires: response.headers.expires,
    };
  } catch (error) {
    logError("Failed to load stats", error);
    return Promise.reject(error);
  }
}

export const parseStats = (payload: unknown): Partial<Statistics> => {
  if (_.isEmpty(payload)) {
    return {};
  }

  const stats = statisticSchema.cast(payload);

  const dashboardItems =
    stats?.dashboardItems == null
      ? undefined
      : _.compact(stats.dashboardItems).map((group) => _.compact(group));

  return {
    ...stats,
    dashboardItems,
  };
};
