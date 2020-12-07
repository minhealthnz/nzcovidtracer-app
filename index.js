import "react";
import "./setup";

import { AppRegistry } from "react-native";

import { name as appName } from "./app";
import { HeadlessCheck } from "./src/HeadlessCheck";

AppRegistry.registerComponent(appName, () => HeadlessCheck);
