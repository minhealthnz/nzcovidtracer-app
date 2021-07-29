import { createPrivate } from "@db/create";
import { Location as DbLocation, queryLocations } from "@db/entities/location";
import { createLogger } from "@logger/createLogger";
import { useCallback, useEffect, useRef, useState } from "react";

import { mapLocation } from "../mappers";
import { Location } from "../types";

interface LocationsOptions {
  isFavourite?: boolean;
  sortBy?: "name" | "lastVisited";
  id?: string;
  textSearch?: string;
  hasDiaryEntry?: boolean;
}

const { logInfo } = createLogger("useLocations");

/**
 * Hook for paginating locations
 */
export function useLocations(options: LocationsOptions) {
  const [db, setDb] = useState<Realm>();
  const index = useRef(0);
  const pageSize = 12;
  const [query, setQuery] = useState<
    Realm.Results<Realm.Object & DbLocation>
  >();
  const [refreshing, setRefreshing] = useState(true);
  const [displayLocations, setDisplayLocations] = useState<Location[]>([]);
  const locations = useRef<Location[]>([]);

  useEffect(() => {
    if (query == null) {
      return;
    }

    const listener: Realm.CollectionChangeCallback<Realm.Object & Location> = (
      collection,
      changes,
    ) => {
      for (const insertion of changes.insertions) {
        const item = collection[insertion].toJSON();
        locations.current.splice(insertion, 0, mapLocation(item));
      }
      for (const modification of changes.modifications) {
        locations.current[modification] = collection[modification].toJSON();
      }
      for (const deletions of changes.deletions) {
        locations.current.splice(deletions, 1);
      }
      setDisplayLocations([...locations.current]);
    };

    query.addListener(listener);

    return () => {
      query.removeListener(listener);
    };
  }, [query]);

  // Create db connection
  useEffect(() => {
    createPrivate().then((result) => {
      setDb(result);
      logInfo("db created");
    });
  }, []);

  // Clean up db connection
  useEffect(() => {
    return () => {
      logInfo("db close");
      db?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recreate query when needed
  useEffect(() => {
    if (db == null) {
      return;
    }
    setQuery(
      queryLocations(db, {
        isFavourite: options.isFavourite,
        sortBy: options.sortBy,
        textSearch: options.textSearch,
        id: options.id,
        hasDiaryEntry: options.hasDiaryEntry,
      }),
    );
    logInfo("query created");
  }, [
    db,
    options.isFavourite,
    options.sortBy,
    options.textSearch,
    options.id,
    options.hasDiaryEntry,
  ]);

  const loadMore = useCallback(async () => {
    if (query == null) {
      return;
    }
    const slice = query.slice(index.current, index.current + pageSize);
    if (slice.length > 0) {
      const newLocations = slice.map(mapLocation);
      logInfo(`loaded ${locations.current.length} ${newLocations.length}`);
      locations.current.push(...newLocations);
      setDisplayLocations([...locations.current]);
      index.current += pageSize;
    }
    setRefreshing(false);
  }, [query]);

  // Load initial, when query changes
  useEffect(() => {
    logInfo("initial load");
    index.current = 0;
    locations.current = [];
    setDisplayLocations([]);
    loadMore();
  }, [loadMore]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    index.current = 0;
    locations.current = [];
    setDisplayLocations([]);
    loadMore();
  }, [loadMore]);

  return {
    loadMore,
    refresh,
    locations: displayLocations,
    refreshing,
  };
}
