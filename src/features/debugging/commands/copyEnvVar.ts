import Clipboard from "@react-native-community/clipboard";
import { maskToken, maskUrl } from "@utils/mask";
import { Alert } from "react-native";

import config from "../../../config";
import { TestCommand } from "../testCommand";

const envMaskTokenList = [
  "ApiClientIdAndroid",
  "ApiClientIdIOS",
  "PinpointApplicationId",
  "CognitoIdentityPoolId",
  "SafetynetKey",
];

const envMaskURLList = [
  "WebAppBaseUrl",
  "WebAppBaseUrlNoScheme",
  "ApiBaseUrl",
  "ExposureEventsBaseUrl",
  "ENFServerUrl",
];

export const copyEnvVar: TestCommand = {
  command: "copyEnvVar",
  title: "Copy env variables",
  run() {
    const text = formatEnv();
    Clipboard.setString(text);
    Alert.alert("Copied to clipboard", text);
  },
};

function maskEnvVariable(key: string, value: string | undefined) {
  if (envMaskTokenList.includes(key)) {
    value = maskToken(value);
  }

  if (envMaskURLList.includes(key)) {
    value = maskUrl(value);
  }
  return value;
}

export const formatEnv = (shouldMask = false) => {
  const copy = {
    ...config,
    Features: Array.from(config.Features).join(","),
  };
  return Object.keys(copy)
    .map((key) => {
      let value = (copy as any)[key];
      if (shouldMask) {
        value = maskEnvVariable(key, value);
      }
      return `${key}=${value}`;
    })
    .join("\n");
};
