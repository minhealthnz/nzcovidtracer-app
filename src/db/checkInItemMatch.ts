import { ExposureEvent } from "@features/exposure/service/types";
import { nanoid } from "@reduxjs/toolkit";
import { UpdateMode } from "realm";

import { CheckInItemPublic } from "./checkInItem";
import { createPublic } from "./create";
import { CheckInItemMatchEntity, CheckInItemPublicEntity } from "./entities";

export interface CheckInItemMatch {
  id: string;
  notificationId: string;
  eventId: string;
  startDate: Date;
  checkInStartDate?: Date;
  endDate: Date;
  globalLocationNumberHash: string;
  systemNotificationBody?: string;
  appBannerTitle?: string;
  appBannerBody?: string;
  appBannerLinkLabel?: string;
  appBannerLinkUrl?: string;
  appBannerRequestCallbackEnabled: boolean;
  callbackRequested: boolean;
  acknowledged: boolean;
}

export interface UpsertCheckInItemMatch {
  id: string;
  notificationId: string;
  eventId: string;
  startDate: Date;
  endDate: Date;
  globalLocationNumberHash: string;
  systemNotificationBody?: string;
  appBannerTitle?: string;
  appBannerBody?: string;
  appBannerLinkLabel?: string;
  appBannerLinkUrl?: string;
  appBannerRequestCallbackEnabled: boolean;
  callbackRequested: boolean;
  acknowledged: boolean;
}

export const upsertMany = async (items: UpsertCheckInItemMatch[]) => {
  const publicDb = await createPublic();

  publicDb.write(() => {
    for (const item of items) {
      publicDb.create<CheckInItemMatch>(
        CheckInItemMatchEntity,
        item,
        UpdateMode.Modified,
      );
    }
  });

  publicDb.close();
};

// TODO prevent processing exposure events multiple times
export const createMatchesFromEvents = async (
  exposureEvents: ExposureEvent[],
): Promise<CheckInItemMatch[]> => {
  if (exposureEvents.length === 0) {
    return [];
  }

  const publicDb = await createPublic();

  const matches: CheckInItemMatch[] = [];

  for (const event of exposureEvents) {
    const checkIns = publicDb
      .objects(CheckInItemPublicEntity)
      .filtered(
        "startDate > $0 AND startDate < $1 AND globalLocationNumberHash == $2",
        event.start,
        event.end,
        event.glnHash,
      )
      .sorted("startDate", true);

    if (checkIns.length === 0) {
      continue;
    }

    const checkIn: CheckInItemPublic = checkIns[0].toJSON();

    const match: CheckInItemMatch = {
      id: nanoid(),
      notificationId: event.notificationId,
      eventId: event.eventId,
      startDate: event.start,
      checkInStartDate: checkIn.startDate,
      endDate: event.end,
      globalLocationNumberHash: event.glnHash,
      systemNotificationBody: event.systemNotificationBody,
      appBannerTitle: event.appBannerTitle,
      appBannerBody: event.appBannerBody,
      appBannerLinkLabel: event.appBannerLinkLabel,
      appBannerLinkUrl: event.appBannerLinkUrl,
      appBannerRequestCallbackEnabled: event.appBannerRequestCallbackEnabled,
      acknowledged: false,
      callbackRequested: false,
    };

    matches.push(match);
  }

  const existingMatches: CheckInItemMatch[] = publicDb
    .objects(CheckInItemMatchEntity)
    .toJSON();

  const newMatches = matches.filter(
    (match) =>
      !existingMatches.some(
        (existingMatch) => existingMatch.eventId === match.eventId,
      ),
  );

  publicDb.write(() => {
    for (const newMatch of newMatches) {
      publicDb.create<CheckInItemMatch>(CheckInItemMatchEntity, newMatch);
    }
  });

  publicDb.close();

  return newMatches;
};

export const getMostRecentUnacknowledgedMatch = async (): Promise<
  CheckInItemMatch | undefined
> => {
  const publicDb = await createPublic();
  const matches = publicDb
    .objects(CheckInItemMatchEntity)
    .filtered("acknowledged == false")
    .sorted("startDate", true)
    .slice(0, 1)
    .map((x) => x.toJSON());

  publicDb.close();

  return matches[0];
};

export const acknowledgeOutstandingMatches = async () => {
  const publicDb = await createPublic();
  const matches = publicDb
    .objects(CheckInItemMatchEntity)
    .filtered("acknowledged == false");

  publicDb.write(() => {
    for (const match of matches) {
      ((match as unknown) as CheckInItemMatch).acknowledged = true;
    }
  });

  publicDb.close();
};

export const setCallbackRequested = async (id: string) => {
  const publicDb = await createPublic();
  const match: CheckInItemMatch | undefined = publicDb.objectForPrimaryKey(
    CheckInItemMatchEntity,
    id,
  );

  if (match == null) {
    publicDb.close();
    throw new Error(`Match with id ${id} not found`);
  }

  publicDb.write(() => {
    match.callbackRequested = true;
  });

  publicDb.close();
};

export const removeMany = async (maxDate: Date) => {
  const publicDb = await createPublic();
  const publicCheckIns = publicDb
    .objects(CheckInItemMatchEntity)
    .filtered("startDate < $0", maxDate);
  publicDb.write(() => {
    publicDb.delete(publicCheckIns);
  });
  publicDb.close();
};
