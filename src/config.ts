import Config from "react-native-config";

export interface AppConfigRaw {
  APIServiceAddress?: string;
  AppAddress?: string;
  CognitoIdentityPoolId?: string;
  CognitoUserPoolPoolId?: string;
  CognitoUserPoolAppClientId?: string;
  CognitoUserPoolRegion?: string;
  PinpointApplicationId?: string;
  PinpointRegion?: string;
  DbEncryptionKey?: string;
  GeneratePrivateDbEncryptionKey?: string;
  PrivateDbEncryptionKeyService?: string;
  WebAppBaseUrl?: string;
  ApiDomain?: string;
  ApiBaseUrl?: string;
  ApiClientIdAndroid?: string;
  ApiClientIdIOS?: string;
  AboutBluetoothLink?: string;
  HelpPageUrl?: string;
  ContactUsPageUrl?: string;
  ContactAlertsUrl?: string;
  FeedbackEmailLink?: string;
  SupportPhoneLink?: string;
  IsDev?: string;
  MaxCheckInDays?: string;
  Features?: string;
  ExposureEventsBaseUrl?: string;
  APP_VERSION?: string;
  APPCENTER_BUILD_ID?: string;
  ANDROID_VERSION_CODE_OFFSET?: string;
  ENFServerUrl?: string;
  SafetynetKey?: string;
}

export interface AppConfig {
  APIServiceAddress: string;
  AppAddress: string;
  CognitoIdentityPoolId: string;
  CognitoUserPoolPoolId: string;
  CognitoUserPoolAppClientId: string;
  CognitoUserPoolRegion: string;
  PinpointApplicationId: string;
  PinpointRegion: string;
  DbEncryptionKey?: string;
  GeneratePrivateDbEncryptionKey: boolean;
  PrivateDbEncryptionKeyService: string;
  WebAppBaseUrl: string;
  ApiDomain: string;
  ApiBaseUrl: string;
  ApiClientIdAndroid: string;
  ApiClientIdIOS: string;
  AboutBluetoothLink: string;
  HelpPageUrl: string;
  ContactUsPageUrl: string;
  ContactAlertsUrl: string;
  FeedbackEmailLink: string;
  SupportPhoneLink: string;
  IsDev: boolean;
  MaxCheckInDays: number;
  Features: Set<Feature>;
  ExposureEventsBaseUrl: string;
  APP_VERSION: string;
  APPCENTER_BUILD_ID: string;
  ENFServerUrl: string;
  SafetynetKey: string;
}

export let disableAnimations = false;

export function setDisableAnimations(value: boolean) {
  disableAnimations = value;
}

const raw = (Config as unknown) as AppConfigRaw;

const defaultMaxCheckInDays = 60;

function getMaxCheckInDays() {
  if (raw.MaxCheckInDays == null) {
    return defaultMaxCheckInDays;
  }

  const days = parseInt(raw.MaxCheckInDays, 10);
  if (isNaN(days)) {
    return defaultMaxCheckInDays;
  }

  return days;
}

export enum Feature {
  OnboardingNew = "OnboardingNew",
  PollEvents = "PollEvents",
}

const features = (raw.Features ?? "").split(",").filter((a) =>
  Object.values(Feature)
    .map((b) => b as string)
    .includes(a),
) as Feature[];

const buildUrl = (override: string, domain: string, subdomain: string) => {
  if (override) {
    return override;
  }
  return `https://${subdomain}.${domain}`;
};

export const getBuildId = (offset?: string, buildId?: string) => {
  const defaultBuildNumber = 1;
  const buildIdNumber =
    (buildId ? parseInt(buildId) : defaultBuildNumber) || defaultBuildNumber;
  const offsetNumber = (offset ? parseInt(offset) : 0) || 0;

  return (buildIdNumber + offsetNumber).toString();
};

export { buildUrl as _buildUrl };

const config: AppConfig = {
  APIServiceAddress: raw.APIServiceAddress || "",
  AppAddress: raw.AppAddress || "",
  CognitoIdentityPoolId: raw.CognitoIdentityPoolId || "",
  CognitoUserPoolPoolId: raw.CognitoUserPoolPoolId || "",
  CognitoUserPoolAppClientId: raw.CognitoUserPoolAppClientId || "",
  CognitoUserPoolRegion: raw.CognitoUserPoolRegion || "",
  PinpointApplicationId: raw.PinpointApplicationId || "",
  PinpointRegion: raw.PinpointRegion || raw.CognitoUserPoolRegion || "",
  DbEncryptionKey: raw.DbEncryptionKey || "",
  GeneratePrivateDbEncryptionKey: raw.GeneratePrivateDbEncryptionKey === "1",
  PrivateDbEncryptionKeyService:
    raw.PrivateDbEncryptionKeyService ||
    "unite-app-react-native-private-db-key",
  WebAppBaseUrl: raw.WebAppBaseUrl || "",
  ApiDomain: raw.ApiDomain || "",
  ApiBaseUrl: buildUrl(raw.ApiBaseUrl || "", raw.ApiDomain || "", "api"),
  ExposureEventsBaseUrl: buildUrl(
    raw.ExposureEventsBaseUrl || "",
    raw.ApiDomain || "",
    "exposure-events",
  ),
  ApiClientIdAndroid: raw.ApiClientIdAndroid || "",
  ApiClientIdIOS: raw.ApiClientIdIOS || "",
  AboutBluetoothLink:
    raw.AboutBluetoothLink ||
    "https://www.health.govt.nz/nz-covid-tracer-about-bt",
  HelpPageUrl:
    raw.HelpPageUrl ||
    "https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-novel-coronavirus-resources-and-tools/nz-covid-tracer-app/questions-and-answers-nz-covid-tracer",
  ContactUsPageUrl:
    raw.ContactUsPageUrl ||
    "https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-resources-and-tools/nz-covid-tracer-app/contact-nz-covid-tracer",
  ContactAlertsUrl:
    raw.ContactAlertsUrl ||
    "https://www.health.govt.nz/nz-covid-tracer-contact-alerts",
  FeedbackEmailLink:
    raw.FeedbackEmailLink ||
    "mailto:help@covidtracer.min.health.nz?subject=NZ COVID Tracer App Feedback",
  IsDev: raw.IsDev === "1" || __DEV__,
  MaxCheckInDays: getMaxCheckInDays(),
  Features: new Set(features),
  SupportPhoneLink: raw.SupportPhoneLink || "tel:0800800606",
  APP_VERSION: raw.APP_VERSION || "999.0.0",
  APPCENTER_BUILD_ID: getBuildId(
    raw.ANDROID_VERSION_CODE_OFFSET,
    raw.APPCENTER_BUILD_ID,
  ),
  ENFServerUrl: raw.ENFServerUrl || "",
  SafetynetKey: raw.SafetynetKey || "",
};

export default config;
