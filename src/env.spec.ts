import fs from "fs";

import config from "./config";

describe("scripts/setenv.sh", () => {
  it("injects env variables", async () => {
    const configKeys = Object.keys(config);
    const setEnvScript = fs.readFileSync("scripts/setenv.sh", "utf8");
    const regex = /echo \"(.*?)=\$\{(.*?)\}" >>.env/g;
    const envInjected = new Set<string>();

    let results;
    while ((results = regex.exec(setEnvScript)) != null) {
      const key = results[1];
      const value = results[2];
      // Keys injected doesn't match
      expect(key).toEqual(value);
      envInjected.add(key);
    }

    for (const key of configKeys) {
      // All config keys should be injected by the script
      expect(envInjected).toContain(key);
    }
  });
});
