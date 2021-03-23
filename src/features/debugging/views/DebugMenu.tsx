import { VerticalSpacing } from "@components/atoms";
import { selectOTPSessions } from "@features/otp/selectors";
import { createLogger } from "@logger/createLogger";
import _ from "lodash";
import React, { useMemo } from "react";
import { useExposure } from "react-native-exposure-notification-service";
import { useSelector } from "react-redux";
import styled from "styled-components/native";

import { tableBackgroundColor } from "../colors";
import { buildAddCheckIns } from "../commands/addCheckIns";
import { createAddLegacyUser } from "../commands/addLegacyUser";
import { clearAliases } from "../commands/clearAliases";
import { clearAsyncStorage } from "../commands/clearAsyncStorage";
import { clearDb } from "../commands/clearDb";
import { copyDatabase } from "../commands/copyDatabase";
import { copyEnvVar } from "../commands/copyEnvVar";
import { copyMessagingToken } from "../commands/copyMessagingToken";
import { copySessionLog } from "../commands/copySessionLog";
import { createCrash } from "../commands/createCrash";
import { buildCreateExposureEvent } from "../commands/createExposureEvent";
import { enfCheckExposure } from "../commands/enfCheckExposure";
import { enfDeleteExposure } from "../commands/enfDeleteExposure";
import { enfGetLogData } from "../commands/enfGetLogData";
import { enfInfo } from "../commands/enfInfo";
import { enfSimulateExposure } from "../commands/enfSimulateExposure";
import { injectInsertError } from "../commands/injectInsertError";
import { injectMfaError } from "../commands/injectMfaError";
import { notifyDeviceRegistered } from "../commands/notifyDeviceRegistered";
import { resetENFAlert } from "../commands/resetENFAlert";
import { showSubscription } from "../commands/showSubscription";
import {
  disable as disablePolling,
  enable as enablePolling,
} from "../commands/togglePolling";
import { TestCommand } from "../testCommand";
import { MenuItem } from "./MenuItem";
import { MenuItemGroup } from "./MenuItemGroup";

const { logError } = createLogger("DebugMenu.tsx");

const ScrollView = styled.ScrollView`
  background-color: ${tableBackgroundColor};
`;

export const ScreenDebugMenu = "DebugMenu";

interface Group {
  title: string;
  commands: TestCommand[];
}

export function DebugMenu() {
  const sessions = useSelector(selectOTPSessions);
  const exposure = useExposure();

  const legacyUsersFromOtp = useMemo(
    () =>
      _(sessions)
        .filter((x) => x.userId != null && x.email != null)
        .uniqBy((x) => x.userId)
        .map((x) => ({ userId: x.userId!, email: x.email! }))
        .map((x) => createAddLegacyUser(x.userId, x.email))
        .value(),
    [sessions],
  );

  const groups: Group[] = useMemo(
    () => [
      {
        title: "VISITS",
        commands: [buildAddCheckIns(10), buildAddCheckIns(1000)],
      },
      {
        title: "DATABASE",
        commands: [
          clearDb,
          clearAsyncStorage,
          copyDatabase,
          createAddLegacyUser(),
          ...legacyUsersFromOtp,
          clearAliases,
          injectInsertError,
        ],
      },
      {
        title: "ALERTS",
        commands: [
          buildCreateExposureEvent(false),
          buildCreateExposureEvent(true),
          notifyDeviceRegistered,
        ],
      },
      {
        title: "NOTIFICATIONS",
        commands: [
          copyMessagingToken,
          showSubscription,
          disablePolling,
          enablePolling,
        ],
      },
      {
        title: "MISC",
        commands: [createCrash, copyEnvVar, injectMfaError, copySessionLog],
      },
      {
        title: "ENF",
        commands: [
          enfInfo(exposure),
          resetENFAlert,
          enfSimulateExposure(exposure),
          enfCheckExposure(exposure),
          enfGetLogData(exposure),
          enfDeleteExposure(exposure),
        ],
      },
    ],
    [legacyUsersFromOtp, exposure],
  );

  return (
    <ScrollView>
      <VerticalSpacing height={16} />
      {groups.map((group, groupIndex) => {
        return (
          <MenuItemGroup key={groupIndex} title={group.title}>
            {group.commands.map((command, commandIndex) => {
              return (
                <MenuItem
                  key={commandIndex}
                  title={command.title}
                  detail={command.description}
                  isFirst={commandIndex === 0}
                  isLast={commandIndex === group.commands.length - 1}
                  onPress={() => {
                    const result = command.run();
                    if (result instanceof Promise) {
                      result.catch(logError);
                    }
                  }}
                />
              );
            })}
          </MenuItemGroup>
        );
      })}
    </ScrollView>
  );
}
