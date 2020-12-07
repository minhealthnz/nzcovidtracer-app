import { createLogger } from "@logger/createLogger";
import { Reactotron } from "reactotron-core-client";
import { ReactotronReactNative } from "reactotron-react-native";

import { addCheckIns } from "./commands/addCheckIns";
import { createAddLegacyUser } from "./commands/addLegacyUser";
import { clearAsyncStorage } from "./commands/clearAsyncStorage";
import { clearDb } from "./commands/clearDb";
import { buildCreateExposureEvent } from "./commands/createExposureEvent";
import { injectMfaError } from "./commands/injectMfaError";
import { TestCommand } from "./testCommand";

const { logError } = createLogger("addCommand");

const commands = [
  addCheckIns,
  buildCreateExposureEvent(false),
  buildCreateExposureEvent(true),
  clearAsyncStorage,
  clearDb,
  createAddLegacyUser(),
  injectMfaError,
];

export function addCommands(
  reactotron: Reactotron<ReactotronReactNative> & ReactotronReactNative,
) {
  for (const command of commands) {
    reactotron.onCustomCommand(mapCommand(command));
  }
}

function mapCommand(command: TestCommand) {
  return {
    ...command,
    handler: () => {
      const result = command.run();
      if (result instanceof Promise) {
        result.catch(logError);
      }
    },
  };
}
