import {
  CheckInItemEntity,
  CheckInItemMatchEntity,
  CheckInItemPublicEntity,
  LocationEntity,
  UserEntity,
} from "./entities";

export const CheckInItemSchema = {
  name: CheckInItemEntity,
  primaryKey: "id",
  properties: {
    id: "string",
    userId: "string",
    startDate: { type: "date", indexed: true },
    endDate: "date?",
    note: "string?",
    type: "int",
    location: { type: LocationEntity, optional: true },
  },
};

export const CheckInItemPublicSchema = {
  name: CheckInItemPublicEntity,
  primaryKey: "id",
  properties: {
    id: "string",
    startDate: { type: "date", indexed: true },
    endDate: "date?",
    globalLocationNumberHash: { type: "string", indexed: true },
  },
};

export const CheckInItemMatchSchema = {
  name: CheckInItemMatchEntity,
  primaryKey: "id",
  properties: {
    id: "string",
    notificationId: "string",
    eventId: "string",
    startDate: "date",
    checkInStartDate: "date?",
    endDate: "date",
    // Not used
    globalLocationNumberHash: "string",
    systemNotificationBody: "string?",
    appBannerTitle: "string?",
    appBannerBody: "string?",
    appBannerLinkLabel: "string?",
    appBannerLinkUrl: "string?",
    appBannerRequestCallbackEnabled: "bool",
    callbackRequested: "bool",
    acknowledged: "bool",
  },
};

export const UserSchema = {
  name: UserEntity,
  primaryKey: "id",
  properties: {
    id: "string?",
    nhi: "string?",
    isAnonymous: { type: "bool?", indexed: true },
    alias: { type: "string?", indexed: true },
    email: { type: "string?", indexed: true },
    firstName: "string?",
    middleName: "string?",
    lastName: "string?",
    phone: "string?",
    dateOfBirth: "date?",
  },
};

export const LocationSchema = {
  name: LocationEntity,
  primaryKey: "id",
  properties: {
    id: "string",
    name: { type: "string", indexed: true },
    address: { type: "string", indexed: true },
    globalLocationNumber: { type: "string", indexed: true },
    globalLocationNumberHash: { type: "string", indexed: true },
    isFavourite: { type: "bool", indexed: true, default: false },
    hasDiaryEntry: { type: "bool", indexed: true, default: true },
    lastVisited: { type: "date?", indexed: true },
    type: { type: "int", indexed: true },
  },
};
