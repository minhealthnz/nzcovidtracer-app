import { LinkDashboard } from "@features/dashboard/components/LinkDashboard";
import { LinkScan } from "@features/nfc/LinkScan";
import { LinkNHI } from "@features/nhi/components.ts/LinkNHI";
import React from "react";

import config, { Feature } from "../config";

/**
 * Component to host manual links,
 * note react navigation links are preferred.
 * Only extend this if you require custom logic.
 * See @navigation/linking.ts.
 */
export function ManualLinks() {
  return (
    <>
      <LinkDashboard />
      <LinkNHI />
      {config.Features.has(Feature.NFC) && <LinkScan />}
    </>
  );
}
