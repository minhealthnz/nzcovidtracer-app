import Realm from "./__mocks__/mockRealm";
import { CheckInItemV6 } from "./entities/checkInItem";
import { CheckInItemEntity } from "./entities/entities";
import { Location } from "./entities/location";
import { mapLocationFromOldRealm } from "./migrate";

describe("#mapLocationFromOldRealm", () => {
  const cases: [string, CheckInItemV6[], number][] = [
    [
      "a single scanned entry",
      [
        {
          id: "JVaa3Uj648SUCT3QWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:21:27.448Z"),
          endDate: undefined,
          name: "Test Location",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115170",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM8",
          note: undefined,
          type: 0,
        },
      ],
      1,
    ],
    [
      "a single manual entry",
      [
        {
          id: "OVZ9KXSESu6F78rvwecwecWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:20:00.000Z"),
          endDate: undefined,
          name: "Test Location",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
      ],
      1,
    ],
    [
      "multiple scanned entries for different locations",
      [
        {
          id: "JVaa3Ujrtjrjuytk648SUCT3QWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:21:27.448Z"),
          endDate: undefined,
          name: "Test Location 0",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115170",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM80",
          note: undefined,
          type: 0,
        },
        {
          id: "JVaa3Uj648SiuykuiuiUCT3QWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:22:27.448Z"),
          endDate: undefined,
          name: "Test Location 1",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115171",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM81",
          note: undefined,
          type: 0,
        },
        {
          id: "JVaa3Uj648SUCTegeth3QWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:23:27.448Z"),
          endDate: undefined,
          name: "Test Location 2",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115172",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM82",
          note: undefined,
          type: 0,
        },
      ],
      3,
    ],
    [
      "multiple manual entries for different locations",
      [
        {
          id: "OVZ9KXSrtynjrtyESu6F78rvwecwecWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-12T05:20:00.000Z"),
          endDate: undefined,
          name: "Test Location 1",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "OVZ9KXSESu6F78rvrtewrgwecwecWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-13T05:20:00.000Z"),
          endDate: undefined,
          name: "Test Location 0",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "OVZ9KXSESu6F78rvwecwecfgfjhrtjhWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:21:00.000Z"),
          endDate: undefined,
          name: "Test Location 1",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "OVZ9KXSESu6F78rvwecwecWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:22:00.000Z"),
          endDate: undefined,
          name: "Test Location 2",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
      ],
      3,
    ],
    [
      "multiple scanned entries for the same location",
      [
        {
          id: "JVaa3Uj6werwer48SUCT3QerWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:21:27.448Z"),
          endDate: undefined,
          name: "Test Location",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115170",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM80",
          note: undefined,
          type: 0,
        },
        {
          id: "JVaa3Uj64fbdfb8SUCT3weQWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:22:27.448Z"),
          endDate: undefined,
          name: "Test Location",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115170",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM81",
          note: undefined,
          type: 0,
        },
        {
          id: "JVaa3Ujjl648SUfgjghkCT3QWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:23:27.448Z"),
          endDate: undefined,
          name: "Test Location",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115170",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM82",
          note: undefined,
          type: 0,
        },
      ],
      1,
    ],
    [
      "multiple scanned entries for the same location if the name changed somehow",
      [
        {
          id: "JVaa3Uj648SUCT3QWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:21:27.448Z"),
          endDate: undefined,
          name: "Test Location",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115170",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM80",
          note: undefined,
          type: 0,
        },
        {
          id: "JVaa3Uj648SUCT3QWO287werwer",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:22:27.448Z"),
          endDate: undefined,
          name: "Test Location 2",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115170",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM81",
          note: undefined,
          type: 0,
        },
        {
          id: "JVaa3Uj64wveretwv8SUevCT3QWerO28q7",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:23:27.448Z"),
          endDate: undefined,
          name: "Test Location",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115170",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM82",
          note: undefined,
          type: 0,
        },
      ],
      1,
    ],
    [
      "a single manual entry and then a single scanned entry",
      [
        {
          id: "OVZ9KXSESu6F78rvwecwecWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:20:00.000Z"),
          endDate: undefined,
          name: "Manual entry",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "JVaa3Uj648SUCT3QWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:21:27.448Z"),
          endDate: undefined,
          name: "Scanned entry",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115170",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM8",
          note: undefined,
          type: 0,
        },
      ],
      2,
    ],
    [
      "a single scanned entry and then a single manual entry",
      [
        {
          id: "JVaa3Uj648SUCT3QWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:20:00.000Z"),
          endDate: undefined,
          name: "Scanned entry",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115170",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM8",
          note: undefined,
          type: 0,
        },
        {
          id: "OVZ9KXSESu6F78rvwecwecWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:21:00.000Z"),
          endDate: undefined,
          name: "Manual entry",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
      ],
      2,
    ],
    [
      "a scanned entry and a manual entry in the same minute",
      [
        {
          id: "JVaa3Uj648SUCT3QWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:20:00.000Z"),
          endDate: undefined,
          name: "Scanned entry",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115170",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM8",
          note: undefined,
          type: 0,
        },
        {
          id: "OVZ9KXSESu6F78rvwecwecWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:20:10.000Z"),
          endDate: undefined,
          name: "Manual entry",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
      ],
      2,
    ],
    [
      "two different manual entries in the same minute",
      [
        {
          id: "OVZ9KXSESu6F78rvwecwecWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:20:10.000Z"),
          endDate: undefined,
          name: "Manual entry",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "OVZ9KXSESu6F78rvwecwecWLwzOfwefwcwefwefW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:20:10.000Z"),
          endDate: undefined,
          name: "Manual entry 2",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
      ],
      2,
    ],
    [
      "multiple scanned entries for different locations with the same name",
      [
        {
          id: "JVaa3Uj6werwer48SUCT3QerWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:21:27.448Z"),
          endDate: undefined,
          name: "Test Location",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115170",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM80",
          note: undefined,
          type: 0,
        },
        {
          id: "JVaa3Uj64fbdfb8SUCT3weQWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:22:27.448Z"),
          endDate: undefined,
          name: "Test Location",
          address: "3 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115171",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM81",
          note: undefined,
          type: 0,
        },
        {
          id: "JVaa3Ujjl648SUfgjghkCT3QWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:23:27.448Z"),
          endDate: undefined,
          name: "Test Location",
          address: "4 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115173",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM82",
          note: undefined,
          type: 0,
        },
      ],
      3,
    ],
    [
      "multiple scanned entries for the same location with various posters",
      [
        {
          id: "JVaa3Uj6werwer48SUCT3QerWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:21:27.448Z"),
          endDate: undefined,
          name: "Test Location",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115170",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM80",
          note: undefined,
          type: 0,
        },
        {
          id: "JVaa3Uj64fbdfb8SUCT3weQWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:22:27.448Z"),
          endDate: undefined,
          name: "Test Location",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115171",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM81",
          note: undefined,
          type: 0,
        },
        {
          id: "JVaa3Ujjl648SUfgjghkCT3QWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:23:27.448Z"),
          endDate: undefined,
          name: "Test Location",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115173",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM82",
          note: undefined,
          type: 0,
        },
      ],
      3,
    ],
    [
      "a manual entry, then a scanned entry, then a manual entry, all with the same name (Patrick's case)",
      [
        {
          id: "OVZ9KXSESu6F78rvwecwecWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:20:00.000Z"),
          endDate: undefined,
          name: "Test Location",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "JVaa3Uj648SUCT3QWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:21:27.448Z"),
          endDate: undefined,
          name: "Test Location",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115170",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM8",
          note: undefined,
          type: 0,
        },
        {
          id: "OVZ9KXSESu6F78rWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:22:00.000Z"),
          endDate: undefined,
          name: "Test Location",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
      ],
      2,
    ],
    [
      "manual, scan A, manual, scan B, all with the same name",
      [
        {
          id: "OVZ9KXSESu6F78rvwecwecWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:20:00.000Z"),
          endDate: undefined,
          name: "Test Location",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "JVaa3Uj648SUCT3QWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:21:27.448Z"),
          endDate: undefined,
          name: "Test Location",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115170",
          globalLocationNumberHash:
            "De3FfNX5XgLkHoEV4ScaWR2dszTus2R032Zvymm6+pwyCMprb7cRDQCBBaCtCAM8",
          note: undefined,
          type: 0,
        },
        {
          id: "OVZ9KXSEsdfsdfSu6F78rWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:22:00.000Z"),
          endDate: undefined,
          name: "Test Location",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "yJHsDDMELF84asefweLHzx0JCcO",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:23:23.564Z"),
          endDate: undefined,
          name: "Test Location",
          address: "4 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115217",
          globalLocationNumberHash:
            "1WVAnLuiUfSYn+Q2Fv2mjB/vbtxiOFOYq74hvBg4FA3aXZhm14q3NgO0CdEj6RMW",
          note: undefined,
          type: 0,
        },
      ],
      3,
    ],
    [
      "multiple manual entries, then a single scanned entry with the same name",
      [
        {
          id: "OVZ9KXSESu6F78rvwecwecWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:20:00.000Z"),
          endDate: undefined,
          name: "Test Location",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "OVZ9KXSESu6F78rWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:22:00.000Z"),
          endDate: undefined,
          name: "Test Location",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "yJHsDDMELF84LHzx0JCcO",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:23:23.564Z"),
          endDate: undefined,
          name: "Test Location",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115217",
          globalLocationNumberHash:
            "1WVAnLuiUfSYn+Q2Fv2mjB/vbtxiOFOYq74hvBg4FA3aXZhm14q3NgO0CdEj6RMW",
          note: undefined,
          type: 0,
        },
      ],
      2,
    ],
    [
      "a random assortment of entries across mutliple locations and names on different days",
      [
        {
          id: "OVZ9KXSESu6F78rvwecwecWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:20:00.000Z"),
          endDate: undefined,
          name: "Some place",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "yJHsDDMELF8sdfsdf4LHzx0JCcO",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-11T05:23:23.564Z"),
          endDate: undefined,
          name: "Another place",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "942912354217",
          globalLocationNumberHash:
            "1WVAnLuiUfSYn+Q2Fv2mjB/vbtxiOFOYq74hvBg4FA3aXZhm14q3NgO0CdEj6RMW",
          note: undefined,
          type: 0,
        },
        {
          id: "OVZ9KXSESu6F78rWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:22:00.000Z"),
          endDate: undefined,
          name: "This place",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "yJHsDDMELF84LHzx0JCcO",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:23:23.564Z"),
          endDate: undefined,
          name: "That place",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115218",
          globalLocationNumberHash:
            "1WVAnLuiUfSYn+Q2Fv2mjB/vbtxiOFOYq74hvBg4FA3aXZhm14q3NgO0CdEj6RMW",
          note: undefined,
          type: 0,
        },
        {
          id: "OVZ9KXSEsfgsdsgdSu6F78rWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-19T05:22:00.000Z"),
          endDate: undefined,
          name: "This place",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "yJHsfdfDDMELF84LHzx0JCcO",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-21T05:23:23.564Z"),
          endDate: undefined,
          name: "That place",
          address: "2 Masterton Road\nRothesay Bay\nAuckland",
          globalLocationNumber: "9429306115218",
          globalLocationNumberHash:
            "1WVAnLuiUfSYn+Q2Fv2mjB/vbtxiOFOYq74hvBg4FA3aXZhm14q3NgO0CdEj6RMW",
          note: undefined,
          type: 0,
        },
      ],
      4,
    ],
    [
      "multiple manual entries for the same location and a manual entry for differnt location",
      [
        {
          id: "OVZ9KXSESu6F78rvwecwecWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-12T05:20:00.000Z"),
          endDate: undefined,
          name: "Test Location",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "OVZ9KXSESu6F78rvwecwewewercWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-13T05:21:00.000Z"),
          endDate: undefined,
          name: "Test Location",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "OVZ9KXSEwevsdSu6F78rvwecwecWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:22:00.000Z"),
          endDate: undefined,
          name: "Test Location",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
        {
          id: "OVZ9KXSESu6F78rvwecwfsdhfsoecWLwzOW",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:22:00.000Z"),
          endDate: undefined,
          name: "Test Location 2",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: "",
          type: 1,
        },
      ],
      2,
    ],
    [
      "multiple manual entries with the same emoji",
      [
        {
          id: "JVaa3Uj64bgdbgd8SUCT3QWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:21:27.448Z"),
          endDate: undefined,
          name: "😀",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: undefined,
          type: 1,
        },
        {
          id: "JVaa3Uj64bgdfdfddbgd8SUCT3QWO287",
          userId: "4t7aRQW336pnZyeadBEgI",
          startDate: new Date("2021-07-14T05:21:27.448Z"),
          endDate: undefined,
          name: "😀",
          address: "",
          globalLocationNumber: "",
          globalLocationNumberHash: "",
          note: undefined,
          type: 1,
        },
      ],
      1,
    ],
  ];

  it.each(cases)(
    "creates location and checkIn entities from old DB when diary has %s",
    async (_testCase, data, numberOfUniqueLocations) => {
      const locationsById = new Map<string, Location>();
      const checkInLocationIds = new Map<string, string>();
      const oldDb = new Realm({
        schema: [CheckInItemEntity],
        data: data,
      });
      updateDb(oldDb, data);
      mapLocationFromOldRealm(
        oldDb.objects(CheckInItemEntity),
        locationsById,
        checkInLocationIds,
      );
      expect(Array.from(locationsById.keys()).length).toEqual(
        numberOfUniqueLocations,
      );
      expect(Array.from(checkInLocationIds.keys()).length).toEqual(data.length);
    },
  );

  it.each(cases)(
    "update lastVisted to the most recent date when location has multiple visits",
    async (_testCase, data, _numberOfUniqueLocations) => {
      const locationsById = new Map<string, Location>();
      const checkInLocationIds = new Map<string, string>();
      const dataSortedByStartDate = data.sort(
        (a: any, b: any) => b.startDate - a.startDate,
      );

      const oldDb = new Realm({
        schema: [CheckInItemEntity],
        data: [],
      });
      updateDb(oldDb, dataSortedByStartDate);
      mapLocationFromOldRealm(
        oldDb.objects(CheckInItemEntity),
        locationsById,
        checkInLocationIds,
      );

      Array.from(locationsById.values()).forEach((location) => {
        expect(
          findTheLatestStartDate(
            dataSortedByStartDate,
            location.name,
            location.globalLocationNumber,
          ),
        ).toEqual(location.lastVisited);
      });
    },
  );
});

const updateDb = (oldDb: Realm, checkInItemData: any) => {
  oldDb.write(() => {
    for (const data of checkInItemData) {
      oldDb.create(CheckInItemEntity, {
        id: data.id,
        startDate: new Date(data.startDate),
        endDate: undefined,
        name: data.name,
        address: data.address,
        globalLocationNumber: data.globalLocationNumber,
        globalLocationNumberHash: data.globalLocationNumberHash,
        userId: data.userId,
        type: data.type,
      });
    }
  });
};

const findTheLatestStartDate = (
  data: CheckInItemV6[],
  name: string,
  gln?: string,
) => {
  if (gln == null) {
    return data
      .filter((item) => name === item.name && !item.globalLocationNumber)
      .map((item) => item.startDate)
      .sort((a: any, b: any) => b - a)[0];
  }
  return data
    .filter((item) => name === item.name && gln === item.globalLocationNumber)
    .map((item) => item.startDate)
    .sort((a: any, b: any) => b - a)[0];
};
