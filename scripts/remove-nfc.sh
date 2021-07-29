#!/bin/sh

if [[ $Features == *"NFC"* ]]; then
  echo "NFC feature flag detected."
  exit 0
fi

echo "Removing NFC permission and intents from Android Manifest"
NFC_PERMISSION_STRING="<uses-permission android:name=\"android.permission.NFC\" />"
sed -i '' -e "s|$NFC_PERMISSION_STRING||g" "./android/app/src/main/AndroidManifest.xml"
tr '\n' '`' <"./android/app/src/main/AndroidManifest.xml" >"./android/app/src/main/AndroidManifest_temp.xml"
sed -i '' -e "s/<intent-filter>/{/g" "./android/app/src/main/AndroidManifest_temp.xml"
sed -i '' -e "s/<\/intent-filter>/}/g" "./android/app/src/main/AndroidManifest_temp.xml"
sed -i '' -e "s/{[^{]*NDEF_DISCOVERED[^}]*}//g" "./android/app/src/main/AndroidManifest_temp.xml"
sed -i '' -e "s/{/<intent-filter>/g" "./android/app/src/main/AndroidManifest_temp.xml"
sed -i '' -e "s/}/<\/intent-filter>/g" "./android/app/src/main/AndroidManifest_temp.xml"
tr '`' '\n' <"./android/app/src/main/AndroidManifest_temp.xml" >"./android/app/src/main/AndroidManifest.xml"

cat "./android/app/src/main/AndroidManifest.xml"

rm "./android/app/src/main/AndroidManifest_temp.xml"