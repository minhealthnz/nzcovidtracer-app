import { setFavourite } from "@db/entities/location";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface AddFavourite {
  locationId: string;
}

export const addFavourite = createAsyncThunk(
  "locations/addFavourite",
  async (payload: AddFavourite) => {
    await setFavourite(payload.locationId, true);
    return payload.locationId;
  },
);
