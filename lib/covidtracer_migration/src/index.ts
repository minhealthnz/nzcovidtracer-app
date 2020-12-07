import { NativeModules } from 'react-native';

interface CovidTracerMigration {
  randomBytes?(): Promise<string>;
  fetchData?(
    skipEncryption?: boolean,
    copyUsers?: boolean,
    copyCheckIns?: boolean,
    copyMatches?: boolean
  ): Promise<MigrationData>;
  performMaintenance?(
    skipEncryption?: boolean,
    databaseFilteringString?: string
  ): Promise<void>;
  applyPublicFileProtection?(publicFolderPath: string): Promise<void>;
  findPublicKey?(): Promise<string | undefined>;
  findPrivateKey?(): Promise<string | undefined>;
}

export interface MigrationData {
  users?: UserData[];
  diaryEntries?: DiaryEntryData[];
  matches?: MatchData[];
}

export interface UserData {
  id?: string;
  nhi?: string;
  isActive?: boolean;
}

export interface DiaryEntryData {
  id?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  name?: string;
  address?: string;
  gln?: string;
  hashedGln?: string;
  note?: string;
  type?: number;
}

export interface MatchData {
  id?: string;
  notificationId?: string;
  eventId?: string;
  startDate?: string;
  endDate?: string;
  systemNotificationBody?: string;
  appBannerTitle?: string;
  appBannerBody?: string;
  appBannerLinkLabel?: string;
  appBannerLinkUrl?: string;
  appBannerRequestCallbackEnabled?: boolean;
  callbackRequested?: boolean;
  ack?: boolean;
}

const { CovidTracerMigration } = NativeModules;

export default CovidTracerMigration;
