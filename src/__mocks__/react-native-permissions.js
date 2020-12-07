jest.mock("react-native-permissions", () => ({
  checkNotifications: () => Promise.resolve(true),
}));
