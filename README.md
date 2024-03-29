# NZ COVID Tracer

This is the repository for the [NZ COVID Tracer app](https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-resources-and-tools/nz-covid-tracer-app).

NZ COVID Tracer is a Ministry of Health app that allows you to create a digital
diary of places you visit by scanning the official QR codes. This gives contact
tracers a headstart with identifying anyone who may have been exposed to COVID-19
so we can quickly break the chain of transmission.

You can download the app for:

* **Android** from the [Google Play Store](https://play.google.com/store/apps/details?id=nz.govt.health.covidtracer)
* **iPhone/iOS** from the [App Store](https://apps.apple.com/nz/app/id1511667597)


## Contributing

***We are not currently accepting issue reports or pull requests on GitHub.***

- To report any security issues or vulnerabilities, please see the [security policy](https://github.com/minhealthnz/nz-covid-tracer/security/policy)
- For all other reports or questions, please email help@covidtracer.min.health.nz.

## Development setup

### Dependencies
1. yarn
2. XCode / Android Studio
3. cocoapods
4. `prettier` extension (latest version) installed on code editor (preferably VSCode)
5. Javac version 1.8 (check by javac -version)

### Env variables
This project uses [react-native-config](https://github.com/luggit/react-native-config)  
To create a env file, run `cp .env.example .env`

### Generating an encryption key for Realm Db (Optional)
Generate 64 [random bytes](https://www.random.org/cgi-bin/randbyte?nbytes=64&format=h), copy the bytes in hexadeicmal format
Go to [Binary to Base64](https://cryptii.com/pipes/binary-to-base64), choose Hexadecimal format and convert it to text
Go to `.env` file, configure `DbEncryptionKey` with the key

### Pre-build
Keep the below changes in your local dev only. Do not push it in the branch.
- Create a .env file in the root directory and insert the correct variables as shown in the example env file.
- Insert the correct serects in the scripts/inject-secrets bash file.
- `sh scripts/inject-secrets.sh .`
- yarn install
- cd ios
- bundle exec pod install
- cd ../

### Run the app
```
yarn install
yarn ios --scheme 'UniteAppRN-ENF'
```

### Known issues
- If you have linking issues for Xcode 12 and above, please fix them by the file reference workaround.
- Ensure that the versions match.
    * `javac -version` --> 1.8 (important).
    * `node -v` --> currently @ 14.16.1.
- Cannot find default.realm on running Jest
    - Delete default.realm.lock file from root and try again.
- Snapshot testing failing as it cannot match.
    - Update the snapshot tests by running `yarn test -u`

### E2E tests
End to end tests are implemented with [cavy](https://github.com/pixielabs/cavy)  

Start the app for e.g. `yarn ios`, and make sure both the app and the bundler are running
Start the test server `yarn e2e:dev`
Tests should now be running at every reload
See tests under `./specs`
