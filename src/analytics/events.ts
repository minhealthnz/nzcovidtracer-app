import { AnnouncementEvents } from "@features/announcement/events";
import { DeviceEventPayloads, DeviceEvents } from "@features/device/events";
import { DiaryEvent, DiaryEventPayloads } from "@features/diary/events";
import { ENFEvent, ENFEventPayloads } from "@features/enfExposure/events";
import {
  ExposureEventPayloads,
  ExposureEvents,
} from "@features/exposure/events";
import { LocationEventPayloads } from "@features/locations/events";
import {
  ReminderEventPayloads,
  ReminderEvents,
} from "@features/reminder/events";
import { LinkingEventPayloads, LinkingEvents } from "@linking/events";

/**
 * TODO Move to smaller files, divided by feature.
 * This file breaks the interface-segregation principle and would just keep growing
 */
export const Events = {
  EntryPass: "entry_pass",
  EntryPassManual: "entry_pass_manual",
  EntryComplete: "entry_complete",
  RegistrationLegal: "registration_legal",
  RegistrationCreate: "registration_create",
  RegistrationVerify: "registration_verify",
  RegistrationDetails: "registration_details",
  RegistrationComplete: "registration_complete",
  AddNhi: "addNHI",
  EditNhi: "editNHI",
  ViewNHIFromMyProfile: "viewNHIFromMyProfile",
  ENFSupportRetrySuccess: "enfSupportRetrySuccess",
  EasterEggTriggered: "easter_egg_triggered",
} as const;

const AnalyticsEvent = {
  ...Events,
  ...ENFEvent,
  ...DiaryEvent,
  ...ExposureEvents,
  ...AnnouncementEvents,
  ...DeviceEvents,
  ...LinkingEvents,
  ...ReminderEvents,
} as const;

export type EventPayloads = ENFEventPayloads &
  ExposureEventPayloads &
  DeviceEventPayloads &
  LinkingEventPayloads &
  DiaryEventPayloads &
  ReminderEventPayloads &
  LocationEventPayloads;

export { AnalyticsEvent };
