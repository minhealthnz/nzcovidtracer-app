import { RemoteInfoBlockData } from "@components/types";
import React from "react";

import InfoBlock from "./InfoBlock";

interface RemoteInfoBlockProps {
  data: RemoteInfoBlockData;
}

export function RemoteInfoBlock({ data }: RemoteInfoBlockProps) {
  return (
    <InfoBlock
      icon={data.icon}
      heading={data.title}
      body={data.body}
      backgroundColor={data.backgroundColor}
    />
  );
}
