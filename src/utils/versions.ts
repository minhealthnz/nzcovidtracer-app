import { Platform } from "react-native";

export interface Version {
  major: number;
  minor?: number;
}

export const parseVersion = (version: string | number): Version | undefined => {
  if (typeof version === "number") {
    return {
      major: version,
    };
  }
  const components = version.split(".");
  if (components.length < 2) {
    return undefined;
  }

  const major = parseInt(components[0]);
  const minor = parseInt(components[1]);

  if (isNaN(major) || isNaN(minor)) {
    return undefined;
  }

  return {
    major,
    minor,
  };
};

const platform = Platform.OS;
const version = parseVersion(Platform.Version || "");

export const iOS12EnfSupported =
  platform === "ios" &&
  version != null &&
  version.major === 12 &&
  version.minor != null &&
  version.minor >= 5;
