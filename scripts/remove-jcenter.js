const isAndroid = Boolean(process.env.APPCENTER_ANDROID_VARIANT);
if (!isAndroid) {
  console.log("Not running in AppCenter Android, aborting script");
  process.exit(0);
}

const replace = require("replace-in-file");
const path = "../**/node_modules/**/android/build.gradle";
const optionA = {
  files: path,
  from: /jcenter/g,
  to: "mavenCentral",
};

const optionB = {
  files: path,
  from: /implementation \'com\.facebook\.react\:react-native\:\+\'/g,
  to:
    "implementation 'com.facebook.fbjni:fbjni-java-only:0.0.4'\n  implementation('com.facebook.react:react-native:+') {\n    exclude group: 'com.facebook.fbjni', module: 'fbjni-java-only'\n    exclude group: 'com.facebook.yoga', module: 'proguard-annotations'\n  }",
};

const optionC = {
  files: path,
  from: /implementation \"com\.facebook\.react\:react-native\:\+\"/g,
  to:
    "implementation 'com.facebook.fbjni:fbjni-java-only:0.0.4'\n  implementation('com.facebook.react:react-native:+') {\n    exclude group: 'com.facebook.fbjni', module: 'fbjni-java-only'\n    exclude group: 'com.facebook.yoga', module: 'proguard-annotations'\n  }",
};

replace(optionA)
  .then((results) => {
    // console.log('Replacement results:', results);
    replace(optionB)
      .then((resultsB) => {
        // console.log('Replacement resultsB:', resultsB);
        replace(optionC)
          .then((resultsC) => {
            // console.log('Replacement resultsC:', resultsC);
          })
          .catch((error) => {
            console.error("Error occurred:", error);
          });
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  })
  .catch((error) => {
    console.error("Error occurred:", error);
  });
