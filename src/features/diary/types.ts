import { SerializedError } from "@reduxjs/toolkit";

export type DiaryEntryType = "scan" | "manual";

export interface DiaryEntry {
  id: string;
  userId: string;
  startDate: number;
  endDate?: number;
  name: string;
  address?: string;
  globalLocationNumber?: string;
  globalLocationNumberHash?: string;
  details?: string;
  type: DiaryEntryType;
  updatedAt?: number;
}

export interface DiaryPaginationSession {
  querying: boolean;
  allIds: string[];
  userIds: string[];
}

export interface ErrorState {
  message: string;
  isToast?: boolean;
}

export interface DiaryState {
  byId: { [id: string]: DiaryEntry };
  hasSeenScanTutorial: boolean;
  userIds: string[];
  sessions: { [id: string]: DiaryPaginationSession };
  shareDiary: {
    requestId?: string;
    pending: boolean;
    error?: ErrorState;
    fulfilled: boolean;
  };
  previewDiary: {
    pending: boolean;
    userId?: string;
    email?: string;
    isOnboarding?: boolean;
    error?: SerializedError;
  };
  copyDiary: {
    requestId?: string;
    pending: boolean;
    fulfilled: boolean;
    userId?: string;
    email?: string;
    isOnboarding?: boolean;
    error?: SerializedError;
  };
  count: { [userId: string]: number };
  countedOldDiaries: boolean;
  debugging: {
    insertError: boolean;
  };
}

export const errors = {
  previewDiary: {
    userNotFound: "errorCodes:diary:previewDiary:userNotFound",
    generic: "errorCodes:diary:previewDiary:generic",
  },
};
