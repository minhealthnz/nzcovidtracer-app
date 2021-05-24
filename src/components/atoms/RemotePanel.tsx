import { Panel } from "@components/molecules/Panel";
import { RemotePanelData } from "@components/types";
import React from "react";

export interface RemotePanelProps {
  data: RemotePanelData;
}

export function RemotePanel({ data }: RemotePanelProps) {
  return (
    <Panel
      title={data.title}
      body={data.body}
      backgroundColor={data.backgroundColor}
      buttons={data.buttons}
    />
  );
}
