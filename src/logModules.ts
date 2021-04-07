import { createLogger } from "@logger/createLogger";

import config from "./config";

const { logInfo } = createLogger("logModules");

export const logModules = () => {
  if (!config.DevLogModules) {
    return;
  }

  // @ts-ignore
  const modules = require.getModules();
  const moduleIds = Object.keys(modules);
  const loadedModuleNames = moduleIds
    .filter((moduleId) => modules[moduleId].isInitialized)
    .map((moduleId) => modules[moduleId].verboseName);
  const waitingModuleNames = moduleIds
    .filter((moduleId) => !modules[moduleId].isInitialized)
    .map((moduleId) => modules[moduleId].verboseName);

  // make sure that the modules you expect to be waiting are actually waiting
  logInfo(
    [
      "loaded:",
      loadedModuleNames.length,
      "waiting:",
      waitingModuleNames.length,
    ].join(" "),
  );

  // grab this text blob, and put it in a file named packager/modulePaths.js
  logInfo(
    `module.exports = ${JSON.stringify(loadedModuleNames.sort(), null, 2)};`,
  );
};
