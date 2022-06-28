import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules, Platform } from "react-native";
import Reactotron from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";
import sagaPlugin from "reactotron-redux-saga";

let scriptHostname;
if (__DEV__) {
  const scriptURL = NativeModules.SourceCode.scriptURL;
  scriptHostname = scriptURL.split("://")[1].split(":")[0];
}

const reactotron = Reactotron.setAsyncStorageHandler!(AsyncStorage)
  .configure(
    scriptHostname !== undefined && Platform.OS === "ios"
      ? { host: scriptHostname }
      : undefined,
  )
  .use(sagaPlugin({}))
  .useReactNative()
  .use(reactotronRedux())
  .connect();

export default reactotron;
