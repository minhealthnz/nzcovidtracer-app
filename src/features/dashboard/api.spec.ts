import { parseStats } from "./api";

const buildStats = (statItem: any) => {
  return {
    dashboardItems: [
      [
        {
          value: "abc",
          dailyChange: "foo",
          dailyChangeIsGood: true,
          icon: "https://foo",
          subtitle: "bar",
          ...statItem,
        },
      ],
    ],
  };
};

export default describe("dashboard/api", () => {
  describe("parse stats payload", () => {
    it.each([
      [{ value: 41 }, { value: "41" }],
      [{ dailyChangeIsGood: "true" }, { dailyChangeIsGood: true }],
      [{ dailyChange: "25" }, { dailyChange: "25" }],
      [{ dailyChange: 25 }, { dailyChange: 25 }],
    ])("casts %s to %s", (input, output) => {
      const stats = parseStats(buildStats(input));
      const statsItem = stats.dashboardItems![0][0];

      expect(statsItem).toMatchObject(output);
    });

    it("should return empty object if the payload is empty object", () => {
      expect(parseStats({})).toEqual({});
    });

    it("should return empty object Error if the payload is empty string", () => {
      expect(parseStats("")).toEqual({});
    });

    it("should Throw Error if the dashboardItem is not array", () => {
      expect(() => parseStats({ dashboardItems: "" })).toThrowError();
    });
  });
});
