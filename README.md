# transportapp-mobile

Please make sure you have following libraries/frameworks/apps installed in your system.
* [Node](https://nodejs.org/en/download/)

* [Latest JDK](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* [Android Studio](https://developer.android.com/studio/install)
* [Android Emulator (API level 28+)](https://developer.android.com/studio/run/emulator)

* [XCode 11+](https://developer.apple.com/xcode/)
* [Cocoapods](https://cocoapods.org/)


### Android

Create `local.properties` file at the project/android folder. Place root to the sdk.dir on your system.
for mac: `sdk.dir = /Users/currentUser/Library/Android/sdk`


To launch app in Debug mode, launch your Android emulator/device and run following commands:
```bash
npm i
npx jetify
cd android && ./gradlew installDebug && cd ..
ifconfig
npm start

```
`ifconfig` is needed to get the Debug server host. Ex. `192.168.20.124`
Shake the device. Press settings and Debug server host & port for device. Ex. `192.168.20.124:8081`

### iOS

Before you open .xcworkspace file in Xcode, please run following commands:
```bash
cd ios && pod install
```

To run app on XCode emulator
1) Select device / emulator from dropdown near Run button (_top left_)
2) Press the Run button


To upload a new version of app to App Store Connect, ensure that you have following set up in XCode
* Apple Profile logged in
* Distribution / Provisioning Profile set up
* App version updated (_Project setting -> General_)

1) Select “Generic iOS Device” as the deployment target.
2) Select Product -> Archive (top bar menu)
3) Window "Organizer" will launch
4) Select build from list and click “Upload to App Store” from right bar menu.
5) Follow the instructions


### Tests

Before you run test  make sure that node packages are installed.

To run tests with Jest run
```
npm install jest --global
jest
```
To update snapshots run:
```
jest --updateSnapshot
```

Please make sure u are familiar with Jest implementation in React Native (https://jestjs.io/docs/en/tutorial-react-native)

If u have problems with modules read (https://jestjs.io/docs/en/mock-functions).
U can mock modules at './jest/setup.js' or at __mock__.
