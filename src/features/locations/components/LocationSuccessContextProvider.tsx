import { getLocationById } from "@db/entities/location";
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import config from "../../../config";
import { mapLocation } from "../mappers";
import { Location } from "../types";

interface LocationSuccessContextValue {
  location: Location | undefined;
  setLocationId: (id: string | undefined) => void;
}

export const LocationSuccessContext = createContext<
  LocationSuccessContextValue
>({
  location: undefined,
  setLocationId: () => {},
});

interface LocationSuccessContextProviderProps {
  children: React.ReactNode;
}

export function LocationSuccessContextProvider(
  props: LocationSuccessContextProviderProps,
) {
  const [addedLocation, setAddedLocation] = useState<Location | undefined>(
    undefined,
  );

  const timeOut = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!addedLocation) {
      timeOut.current && clearTimeout(timeOut.current);
    }
    if (addedLocation) {
      timeOut.current && clearTimeout(timeOut.current);
      timeOut.current = setTimeout(() => {
        setAddedLocation(undefined);
      }, config.SuccessBannerDuration);
    }
    return () => timeOut.current && clearTimeout(timeOut.current);
  }, [addedLocation]);

  const setAddedLocationFromId = useCallback(
    (id: string | undefined) => {
      if (!id) {
        setAddedLocation(undefined);
        return;
      }
      getLocationById(id).then((locationDB) => {
        if (!locationDB) {
          setAddedLocation(undefined);
          return;
        }
        setAddedLocation(mapLocation(locationDB));
      });
    },
    [setAddedLocation],
  );

  return (
    <LocationSuccessContext.Provider
      value={{
        location: addedLocation,
        setLocationId: setAddedLocationFromId,
      }}
    >
      {props.children}
    </LocationSuccessContext.Provider>
  );
}
