import { nanoid } from "@reduxjs/toolkit";

import {
  _reducer as reducer,
  DashboardState,
  getCovidStatistics,
} from "./reducer";
import { Statistics } from "./types";

export default describe("Dashboard/reducer", () => {
  const stats = {
    dashboardItems: [
      { test: "test" },
      [],
      [
        {
          value: "460",
          dailyChange: -100,
          dailyChangeIsGood: false,
          icon:
            "https://covid-stats-cranky-albattani-f8ba11.netlify.app/mask.png",
          subtitle: "Total active cases",
          backgroundColor: "#FFEB9A",
          url: "https://healthline.govt.nz/statistics/active-cases",
        },
        {
          value: "3",
          dailyChange: 1,
          dailyChangeIsGood: false,
          icon:
            "https://covid-stats-cranky-albattani-f8ba11.netlify.app/distancing.png",
          subtitle: "Community cases",
        },
      ],
      [
        {
          icon:
            "https://covid-stats-cranky-albattani-f8ba11.netlify.app/scan.png",
          backgroundColor: "#DEEAF7",
        },
      ],
      [
        {
          value: "15,234",
          icon:
            "https://covid-stats-cranky-albattani-f8ba11.netlify.app/scan.png",
          subtitle: "Total scans last 7 days",
          backgroundColor: "#DEEAF7",
        },
      ],
    ],
  };

  const statsBroken = {
    dashboardItems: { test: "test" },
  };

  const cleanedStats: Statistics = {
    title: "Latest updates",
    sourceUrl: "https://systems.jhu.edu/",
    sourceDisplay: "JHU CSSE COVID-19 Data",
    dashboardItems: [
      [
        {
          value: "460",
          dailyChange: -100,
          dailyChangeIsGood: false,
          icon:
            "https://covid-stats-cranky-albattani-f8ba11.netlify.app/mask.png",
          subtitle: "Total active cases",
          backgroundColor: "#FFEB9A",
          url: "https://healthline.govt.nz/statistics/active-cases",
        },
        {
          value: "3",
          dailyChange: 1,
          dailyChangeIsGood: false,
          icon:
            "https://covid-stats-cranky-albattani-f8ba11.netlify.app/distancing.png",
          subtitle: "Community cases",
        },
      ],
      [
        {
          value: "15,234",
          icon:
            "https://covid-stats-cranky-albattani-f8ba11.netlify.app/scan.png",
          subtitle: "Total scans last 7 days",
          backgroundColor: "#DEEAF7",
        },
      ],
    ],
  };

  const initialState: DashboardState = {
    expires: 0,
    lastFetched: new Date().getTime(),
    statsAreLoading: false,
    statsError: undefined,
    testLocationsLink: "",
    statsEmpty: false,
    hasSeenVaccinePassInfo: false,
  };

  describe("getCovidStatistics.fulfilled", () => {
    const payload = {
      stats: (stats as unknown) as Statistics,
      expires: "",
    };
    const newState = reducer(
      initialState,
      getCovidStatistics.fulfilled(payload, nanoid(), true),
    );

    it("should have cleaned up the stats", () => {
      expect(newState.stats).toEqual(cleanedStats);
    });
  });

  describe("getCovidStatistics.fulfilled on broken stats", () => {
    const payload = {
      stats: (stats as unknown) as Statistics,
      expires: "",
    };
    const newState = reducer(
      initialState,
      getCovidStatistics.fulfilled(
        { ...payload, stats: (statsBroken as unknown) as Statistics },
        nanoid(),
        true,
      ),
    );

    it("should show error", () => {
      expect(newState.stats).toEqual(undefined);
      expect(newState.statsError).toEqual("Could not parse statistics.");
    });
  });
});
