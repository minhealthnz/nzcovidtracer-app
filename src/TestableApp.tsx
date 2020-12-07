import { Tester, TestHookStore } from "cavy";
import { Component } from "react";
import React from "react";

import { DiarySpec } from "../specs/diarySpec";
import { NHISpec } from "../specs/nhiSpec";
import { ScanSpec } from "../specs/scanSpec";
import { setDisableAnimations } from "../src/config";
import { App } from "./App";

setDisableAnimations(true);

const testHookStore = new TestHookStore();

export class TestableApp extends Component {
  render() {
    return (
      <Tester
        specs={[ScanSpec, DiarySpec, NHISpec]}
        store={testHookStore}
        waitTime={2000}
      >
        <App />
      </Tester>
    );
  }
}
