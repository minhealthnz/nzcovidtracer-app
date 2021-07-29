import { setFavourite } from "@db/entities/location";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface RemoveFavourite {
  locationId: string;
}

export const removeFavourite = createAsyncThunk(
  "locations/removeFavourite",
  async (payload: RemoveFavourite) => {
    await setFavourite(payload.locationId, false);
    return payload.locationId;
  },
);
