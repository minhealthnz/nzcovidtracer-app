/*
 * This file expects an environment variables in the following format:
 *
 * export PINNED_CERTS='["<cert1>", "<cert1>", "<cert1>"]'
 *
 * I.e. it's a JavaScript array where elements are base64-encoded DER certificates.
 * The script will exit without making any changes unless running in AppCenter, i.e. when APPCENTER_XCODE_SCHEME environment variable is set.
 * IMPORTANT: this script assumes that the scheme passed via APPCENTER_XCODE_SCHEME uses a target with the same name.
 */

const isIOS = Boolean(process.env.APPCENTER_XCODE_SCHEME);
const isAndroid = Boolean(process.env.APPCENTER_ANDROID_VARIANT);
const isAppcenter = isIOS || isAndroid;

if (!isAppcenter) {
  console.log("Not running in AppCenter, aborting script");
  process.exit(0);
}

const xcode = require('xcode');
const path = require('path');
const fs = require('fs');

let certsDestFolder;
if (isIOS) {
  certsDestFolder = path.resolve(__dirname, '..', 'ios', 'UniteAppRN');
} else if (isAndroid) {
  certsDestFolder = path.resolve(__dirname, '..', 'android', 'app', 'src', 'main', 'assets');
}

const projectFilePath = path.resolve(__dirname, '..', 'ios', 'UniteAppRN.xcodeproj', 'project.pbxproj');
const project = xcode.project(projectFilePath).parseSync();

const pinnedCertsPayload = process.env.PINNED_CERTS;
if (!pinnedCertsPayload) {
  throw new Error('PINNED_CERTS environment variable is not set');
}

let certs = [];
try {
  // This is necessary to make it work in AppCenter due to how it does escaping
  const unescapedPinnedCertsPayload = pinnedCertsPayload.replace(/\\"/g, '"');
  certs = JSON.parse(unescapedPinnedCertsPayload);
} catch (e) {
  console.error(e);
  console.log('Supplied value of PINNED_CERTS:', pinnedCertsPayload)
  throw new Error('Unable to parse PINNED_CERTS');
}

if (!Array.isArray(certs)) {
    throw new Error('PINNED_CERTS did not contain a JavaScript array');
}

if (certs.length === 0) {
  throw new Error('PINNED_CERTS environment variable did not contain any certificates');
}

const targetKey = project.findTargetKey(process.env.APPCENTER_XCODE_SCHEME) ||
  project.findTargetKey(`"${process.env.APPCENTER_XCODE_SCHEME}"`);

if (isIOS && !targetKey) {
  throw new Error(`Target ${process.env.APPCENTER_XCODE_SCHEME} is not found`);
}

const groupKey = project.findPBXGroupKeyAndType({ name: 'UniteAppRN' }, 'PBXGroup');

for (let i = 0; i < certs.length; i++) {
  const certFileName = `cert${i + 1}.cer`;
  const certDestFilePath = path.resolve(certsDestFolder, certFileName);
  console.log(`Writing file ${certDestFilePath}`);
  const certContent = Buffer.from(certs[i], 'base64');
  fs.writeFileSync(certDestFilePath, certContent);

  if (isIOS) {
    console.log(`Adding ${certFileName} to target ${process.env.APPCENTER_XCODE_SCHEME}`);
    project.addResourceFile(certDestFilePath, { target: targetKey }, groupKey);
  }
}

if (isIOS) {
  fs.writeFileSync(projectFilePath, project.writeSync());
}