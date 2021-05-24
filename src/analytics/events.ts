import { AnnouncementEvents } from "@features/announcement/events";
import { DeviceEventPayloads, DeviceEvents } from "@features/device/events";
import { ENFEvent, ENFEventPayloads } from "@features/enfExposure/events";
import {
  ExposureEventPayloads,
  ExposureEvents,
} from "@features/exposure/events";
import { LinkingEventPayloads, LinkingEvents } from "@linking/events";

/**
 * TODO Move to smaller files, divided by feature.
 * This file breaks the interface-segregation principle and would just keep growing
 */
const Events = {
  Scan: "scan",
  ScanEdit: "scan_edit",
  ScanNoteAdded: "scan_note_added",
  Manual: "manual",
  ManualEdit: "manual_edit",
  ManualNoteAdded: "manual_note_added",
  EntryPass: "entry_pass",
  EntryPassManual: "entry_pass_manual",
  EntryPassFailure: "entry_pass_failure",
  EntryComplete: "entry_complete",
  RegistrationLegal: "registration_legal",
  RegistrationCreate: "registration_create",
  RegistrationVerify: "registration_verify",
  RegistrationDetails: "registration_details",
  RegistrationComplete: "registration_complete",
  Dashboard: "dashboard",
  AddNhi: "addNHI",
  EditNhi: "editNHI",
  ViewNHIFromMyProfile: "viewNHIFromMyProfile",
  ViewNHIFromDashboard: "viewNHIFromDashboard",
  ENFSupportRetrySuccess: "enfSupportRetrySuccess",
} as const;

const AnalyticsEvent = {
  ...Events,
  ...ENFEvent,
  ...ExposureEvents,
  ...AnnouncementEvents,
  ...DeviceEvents,
  ...LinkingEvents,
} as const;

export type EventPayloads = ENFEventPayloads &
  ExposureEventPayloads &
  DeviceEventPayloads &
  LinkingEventPayloads;

export { AnalyticsEvent };
