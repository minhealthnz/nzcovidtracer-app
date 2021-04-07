export const DeviceEvents = {
  Launch: "launch",
} as const;

export type DeviceEventPayloads = {
  [DeviceEvents.Launch]: {
    metrics: {
      jsLaunchTime: number;
    };
  };
};
