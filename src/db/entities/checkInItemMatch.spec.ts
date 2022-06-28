import { hashLocationNumber } from "@db/hashLocationNumber";
import { ExposureEvent } from "@features/exposure/service/types";
import { nanoid } from "@reduxjs/toolkit";

import { createPublic } from "../create";
import {
  addCheckIn as dbAddCheckIn,
  AddCheckInItem,
  CheckInItemType,
} from "./checkInItem";
import {
  acknowledgeOutstandingMatches,
  CheckInItemMatch,
  createMatchesFromEvents,
  getMostRecentUnacknowledgedMatch,
  removeMany,
  setCallbackRequested,
} from "./checkInItemMatch";
import { CheckInItemMatchEntity } from "./entities";

async function addCheckIn(): Promise<AddCheckInItem> {
  const item = {
    id: nanoid(),
    userId: nanoid(),
    startDate: new Date(),
    name: nanoid(),
    address: nanoid(),
    globalLocationNumber: nanoid(),
    note: nanoid(),
    type: CheckInItemType.Scan,
  };

  await dbAddCheckIn(item);

  return item;
}

const buildEvent = (checkIn: AddCheckInItem) => ({
  notificationId: nanoid(),
  eventId: nanoid(),
  start: new Date(checkIn.startDate.getTime() - 1000),
  end: new Date(checkIn.startDate.getTime() + 1000),
  glnHash: hashLocationNumber(checkIn.globalLocationNumber),
  systemNotificationBody: nanoid(),
  appBannerTitle: nanoid(),
  appBannerBody: nanoid(),
  appBannerLinkLabel: nanoid(),
  appBannerLinkUrl: nanoid(),
  appBannerRequestCallbackEnabled: true,
});

function addMs(date: Date, ms: number) {
  return new Date(date.getTime() + ms);
}

it("finds matches", async () => {
  const checkIn = await addCheckIn();
  const event = buildEvent(checkIn);

  const events: ExposureEvent[] = [event];

  await createMatchesFromEvents(events);

  const publicDb = await createPublic();
  const matches = publicDb
    .objects(CheckInItemMatchEntity)
    .filtered("notificationId = $0", event.notificationId)
    .toJSON();

  expect(matches).toHaveLength(1);
  const match = matches[0];

  verifyMatch(match, event);
  publicDb.close();
});

it("doesn't find matches after range", async () => {
  const checkIn = await addCheckIn();
  const event = buildEvent(checkIn);
  event.start = addMs(checkIn.startDate, 1);
  event.end = addMs(checkIn.startDate, 1000);

  const events: ExposureEvent[] = [event];
  const matches = await createMatchesFromEvents(events);

  expect(matches).toHaveLength(0);
});

it("doesn't find matches before range", async () => {
  const checkIn = await addCheckIn();
  const event = buildEvent(checkIn);
  event.start = addMs(checkIn.startDate, -1000);
  event.end = addMs(checkIn.startDate, -1);

  const events: ExposureEvent[] = [event];
  const matches = await createMatchesFromEvents(events);

  expect(matches).toHaveLength(0);
});

it("doesn't find matches at different location", async () => {
  const checkIn = await addCheckIn();
  const event = buildEvent(checkIn);
  event.glnHash = nanoid();

  const events: ExposureEvent[] = [event];
  const matches = await createMatchesFromEvents(events);

  expect(matches).toHaveLength(0);
});

it("gets most recent unacknowledged match", async () => {
  const match = await createMatch();
  const foundMatch = await getMostRecentUnacknowledgedMatch();
  expect(foundMatch).not.toBe(undefined);
  expect(match.id).toEqual(foundMatch!.id);
});

it("doesn't get recent unacknowledged match if already acknowledged", async () => {
  await createMatch();

  await acknowledgeOutstandingMatches();

  const match = await getMostRecentUnacknowledgedMatch();
  expect(match).toBe(undefined);
});

it("updates callback requested", async () => {
  const checkInItemMatch = await createMatch();

  await setCallbackRequested(checkInItemMatch.id);

  const publicDb = await createPublic();
  const updatedMatch: CheckInItemMatch = publicDb
    .objectForPrimaryKey(CheckInItemMatchEntity, checkInItemMatch.id)
    ?.toJSON();

  expect(updatedMatch).toBeTruthy();
  expect(updatedMatch.callbackRequested).toBe(true);
  publicDb.close();
});

it("removes many", async () => {
  const matches = await createMatches(
    10,
    new Date(new Date().getTime() - 10000),
  );
  await removeMany(new Date());
  const db = await createPublic();
  for (const match of matches) {
    const deleted = db.objectForPrimaryKey(CheckInItemMatchEntity, match.id);
    expect(deleted).toEqual(undefined);
  }
  db.close();
});

function verifyMatch(match: CheckInItemMatch, event: ExposureEvent) {
  expect(match.notificationId).toEqual(event.notificationId);
  expect(match.eventId).toEqual(event.eventId);

  expect(match.startDate).toEqual(event.start);
  expect(match.endDate).toEqual(event.end);
  expect(match.globalLocationNumberHash).toEqual(event.glnHash);
  expect(match.systemNotificationBody).toEqual(event.systemNotificationBody);
  expect(match.appBannerTitle).toEqual(event.appBannerTitle);
  expect(match.appBannerBody).toEqual(event.appBannerBody);
  expect(match.appBannerLinkLabel).toEqual(event.appBannerLinkLabel);
  expect(match.appBannerLinkUrl).toEqual(event.appBannerLinkUrl);
  expect(match.appBannerRequestCallbackEnabled).toEqual(
    event.appBannerRequestCallbackEnabled,
  );
  expect(match.callbackRequested).toBe(false);
  expect(match.acknowledged).toBe(false);
}

async function createMatches(
  num: number,
  date: Date,
): Promise<CheckInItemMatch[]> {
  const results = [];
  for (let i = 0; i < num; i++) {
    const match = await createMatch(date);
    results.push(match);
  }
  return results;
}

async function createMatch(date?: Date) {
  const publicDb = await createPublic();

  const checkInItemMatch: CheckInItemMatch = {
    id: nanoid(),
    notificationId: nanoid(),
    eventId: nanoid(),
    startDate: date ?? new Date(),
    endDate: date ?? new Date(),
    globalLocationNumberHash: nanoid(),
    appBannerRequestCallbackEnabled: false,
    callbackRequested: false,
    acknowledged: false,
  };

  publicDb.write(() => {
    publicDb.create(CheckInItemMatchEntity, checkInItemMatch);
  });

  publicDb.close();

  return checkInItemMatch;
}
