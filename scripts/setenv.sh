#!/usr/bin/env bash
# Creates an .env from ENV variables for use with react-native-config

printf "Creating .env:\n"

echo "DbEncryptionKey=${DbEncryptionKey}" >>.env
echo "GeneratePrivateDbEncryptionKey=${GeneratePrivateDbEncryptionKey}" >>.env
echo "PrivateDbEncryptionKeyService=${PrivateDbEncryptionKeyService}" >>.env
echo "WebAppBaseUrl=${WebAppBaseUrl}" >>.env
echo "HelpPageUrl=${HelpPageUrl}" >>.env
echo "AboutBluetoothLink=${AboutBluetoothLink}" >>.env
echo "ContactUsPageUrl=${ContactUsPageUrl}" >>.env
echo "ContactAlertsUrl=${ContactAlertsUrl}" >>.env
echo "FeedbackEmailLink=${FeedbackEmailLink}" >>.env
echo "IsDev=${IsDev}" >>.env
echo "ApiBaseUrl=${ApiBaseUrl}" >>.env
echo "ExposureEventsBaseUrl=${ExposureEventsBaseUrl}" >>.env
echo "ApiClientIdAndroid=${ApiClientIdAndroid}" >>.env
echo "ApiClientIdIOS=${ApiClientIdIOS}" >>.env
echo "Features=${Features}" >>.env
echo "PinpointApplicationId=${PinpointApplicationId}" >>.env
echo "CognitoIdentityPoolId=${CognitoIdentityPoolId}" >>.env
echo "CognitoUserPoolRegion=${CognitoUserPoolRegion}" >>.env
echo "APP_VERSION=${APP_VERSION}" >>.env
echo "APPCENTER_BUILD_ID=${APPCENTER_BUILD_ID}" >>.env
echo "ENFServerUrl=${ENFServerUrl}" >>.env
echo "SafetynetKey=${SafetynetKey}" >>.env
echo "ENFCheckInterval=${ENFCheckInterval}" >>.env
echo "CovidStatsUrl=${CovidStatsUrl}" >>.env
echo "ResourcesUrl=${ResourcesUrl}" >>.env
echo "AssetWhitelist=${AssetWhitelist}" >>.env
echo "ANDROID_VERSION_CODE_OFFSET=${ANDROID_VERSION_CODE_OFFSET}" >>.env

printf "\n.env created with contents:\n"
cat .env
