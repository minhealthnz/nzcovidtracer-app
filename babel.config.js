module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        extensions: [
          ".ios.ts",
          ".android.ts",
          ".ts",
          ".ios.tsx",
          ".android.tsx",
          ".tsx",
          ".jsx",
          ".js",
          ".json",
          ".png",
        ],
        alias: {
          "@components": "./src/components",
          "@constants": "./src/constants",
          "@domain": "./src/domain",
          "@hooks": "./src/hooks",
          "@lib": "./src/lib",
          "@views": "./src/views",
          "@assets": "./src/assets",
          "@validations": "./src/validations",
          "@features": "./src/features",
          "@db": "./src/db",
          "@utils": "./src/utils",
          "@logger": "./src/logger",
          "@navigation": "./src/navigation",
        },
      },
    ],
  ],
};
