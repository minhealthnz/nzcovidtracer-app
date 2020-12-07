import "./setup";

import { AppRegistry } from "react-native";

import { name as appName } from "./app";
import { TestableApp } from "./src/TestableApp";

AppRegistry.registerComponent(appName, () => TestableApp);
