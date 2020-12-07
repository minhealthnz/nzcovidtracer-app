import { NativeModules } from "react-native";

import CovidTracerMigration from "../../lib/covidtracer_migration/src";

const migration: CovidTracerMigration = NativeModules.CovidTracerMigration;

export default migration;
