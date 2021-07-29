import { Location } from "../types";
import { useLocations } from "./useLocations";

export function useLocation(locationId: string): Location | undefined {
  const { locations } = useLocations({
    id: locationId,
  });
  return locations[0];
}
