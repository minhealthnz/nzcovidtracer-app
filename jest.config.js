module.exports = {
  setupFiles: ["<rootDir>/jestSetup.js"],
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "identity-obj-proxy",
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "index.test.js",
    "specs",
    "getPrivateDbKey.ios.ts",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native" +
      "|@react-native" +
      "|react-native-securerandom" +
      "|react-native-google-safetynet" +
      "|react-native-ios11-devicecheck" +
      ")/)",
  ],
};
