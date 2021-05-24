import React, { createContext, ReactNode } from "react";

import config from "../../config";

interface AssetFilterContextValue {
  assetWhitelist: "*" | string[];
}

export const AssetFilterContext = createContext<AssetFilterContextValue>({
  assetWhitelist: "*",
});

export interface AssetFilterProps {
  children: ReactNode;
}

export function AssetFilter({ children }: AssetFilterProps) {
  return (
    <AssetFilterContext.Provider
      value={{
        assetWhitelist: config.AssetWhitelist,
      }}
    >
      {children}
    </AssetFilterContext.Provider>
  );
}
