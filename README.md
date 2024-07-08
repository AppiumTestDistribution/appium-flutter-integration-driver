<h1 align="center">
  <br>
  <img src="Logo.png" alt="Flutter-Appium">
  <br>
  <br>
  <br>
</h1>
Appium Flutter Integration Driver is a test automation tool for Flutter apps on multiple platforms/OSes. It is part of the Appium mobile test automation tool maintained by the community. Feel free to create PRs to fix issues or improve this driver.

## Native Flutter Integration Driver vs Appium Flutter Integration Driver

| Use Cases                                                                                                                           | Native Flutter Driver | Appium Flutter Integration Driver |
| ----------------------------------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------- |
| Writing tests in languages other than Dart                                                                                          | ❌                    | ✔️                                |
| Running integration tests for Flutter apps with embedded webview or native view, or existing native apps with embedded Flutter view | ❌                    | ✔️                                |
| Running tests on multiple devices simultaneously                                                                                    | ❌                    | ✔️                                |
| Running integration tests on device farms that offer Appium support                                                                 | ❌                    | ✔️                                |
| App interactions beyond Flutter’s contextuality (e.g., sending an OTP from a message application)                                   | ❌                    | ✔️                                |

## Differences from Appium Flutter Driver

The current Appium Flutter Driver is built on top of the `flutter_test` SDK, which is deprecated. The potential deprecation ([Expand deprecation policy to package:flutter_driver](https://github.com/flutter/flutter/issues/139249)) means this driver may not work with future Flutter updates. It also does not handle all cases, such as permission dialog handling.

## Why Use Appium Flutter Integration Driver?

This driver is built using [Flutter Integration Test](https://docs.flutter.dev/cookbook/testing/integration/introduction).

:star: **Strong Typing & Fluent APIs:** Ensures robust and easy-to-use interfaces.

:star: **Element Handling**: Automatically waits for elements to attach to the DOM before interacting.

:star: **Seamless Context Switching**: No need to switch between contexts, such as Flutter and native; the driver handles it effortlessly.

:star: **Auto Wait for Render Cycles**: Automatically waits for frame render cycles, including animations and screen transitions.

:star: **Simplified Powerful Gestures**: Supports powerful yet simplified gestures like LongPress, ScrollToElement, DragAndDrop, and DoubleClick.

:star: **Element Chaining**: Allows chaining of elements, enabling you to find child elements under a specific parent easily.


## Install the Flutter Integration Driver

```bash
appium driver install --source npm appium-flutter-integration-driver
```
## Prepare the app with Flutter Integration Server

1. In your Flutter app's `pubspec.yaml`, add the following dependencies:

Get the latest version from `https://pub.dev/packages/appium_flutter_server/install`

   ```yaml
   dev_dependencies:
     appium_flutter_server: 0.0.18
   ```

2. Create a directory called `integration_test` in the root of your Flutter project.
3. Create a file called `appium_test.dart` in the `integration_test` directory.
4. Add the following code to the `appium_test.dart` file:

   ```dart
   import 'package:appium_flutter_server/appium_flutter_server.dart';
   import 'package:appium_testing_app/main.dart';

   void main() {
     initializeTest(app: const MyApp());
   }
   ```
   If you are in need to configure certain prerequists before the testing app is loaded, you can try the following code:
   ```dart
   import 'package:appium_testing_app/main.dart'; as app;
   void main() {
     initializeTest(
       callback: (WidgetTester tester) async {
          // Perform any prerequisite steps or intialise any dependencies required by the app
          // and make sure to pump the app widget using below statement.
          await tester.pumpWidget(const app.MyApp());
       },
     );
   }
   ```

5. Build the Android app:

   ```bash
   ./gradlew app:assembleDebug -Ptarget=`pwd`/../integration_test/appium.dart
   ```

6. Build the iOS app:
    For Simulator - Debug mode
    ```bash
      flutter build ios integration_test/appium.dart --simulator
    ```
    For Real Device - Release mode
    ```bash
      flutter build ipa --release integration_test/appium.dart
    ```

Bingo! You are ready to run your tests using Appium Flutter Integration Driver.

Check if your Flutter app is running on the device or emulator.

For Android
```
1. Run adb command `adb logcat | grep flutter` to check if the Flutter app is running.
2. Open the application in the device or emulator manually.
3. Verify the logs in the console.
```
```
06-17 17:02:13.246 32697 32743 I flutter : The Dart VM service is listening on http://127.0.0.1:33339/E2REX61NaiI=/
06-17 17:02:13.584 32697 32735 I flutter : 00:00 +0: appium flutter server
06-17 17:02:14.814 32697 32735 I flutter : shelfRun HTTP service running on port 9000
06-17 17:02:14.814 32697 32735 I flutter : [APPIUM FLUTTER]  Appium flutter server is listening on port 9000
06-17 17:02:14.866 32697 32735 I flutter : [APPIUM FLUTTER]  New Request [GET] http://127.0.0.1:10000/status
06-17 17:02:14.869 32697 32735 I flutter : [APPIUM FLUTTER]  response {message: Flutter driver is ready to accept new connections, appInfo: {appName: appium_testing_app, buildNumber: 1, packageName: com.example.appium_testing_app, version: 1.0.0, buildSignature: F2C7CEC8F907AB830B7802C2178515D1FD4BEBA154E981FB61FFC8EC9A8F8195}}
```

For iOS
Simulator:

```xcrun simctl spawn booted log stream | grep flutter```

Real Device: Check xcode device logs.

2. Open the application in the device or emulator manually.
```
06-17 17:02:13.246 32697 32743 I flutter : The Dart VM service is listening on http://127.0.0.1:33339/E2REX61NaiI=/
06-17 17:02:13.584 32697 32735 I flutter : 00:00 +0: appium flutter server
06-17 17:02:14.814 32697 32735 I flutter : shelfRun HTTP service running on port 9000
06-17 17:02:14.814 32697 32735 I flutter : [APPIUM FLUTTER]  Appium flutter server is listening on port 9000
06-17 17:02:14.866 32697 32735 I flutter : [APPIUM FLUTTER]  New Request [GET] http://127.0.0.1:10000/status
06-17
```

## [Getting Started](https://github.com/AppiumTestDistribution/appium-flutter-integration-driver/wiki/Get-Started)
## Appium Flutter Integration Driver vs. Appium UiAutomator2/XCUITest Driver

- The driver manages the application under test and the device under test via Appium UiAutomator2/XCUITest drivers.
- Newer Flutter versions expose their accessibility labels to the system's accessibility features. This means some Flutter elements can be found and interacted with using `accessibility_id` in the vanilla Appium UiAutomator2/XCUITest drivers, although some elements require interaction over the Dart VM.
- Using native driver command will directly hit the Appium UiAutomator2/XCUITest driver.

For more details, refer to the documentation for each driver:

- [Appium UiAutomator2 Driver](https://github.com/appium/appium-uiautomator2-driver)
- [Appium XCUITest Driver](https://appium.github.io/appium-xcuitest-driver/latest)

## How to Inspect elements?
- You can use the flutter inspector tool to inspect the elements in your Flutter app. You can find the tool [here](https://docs.flutter.dev/tools/devtools/inspector)

## Capabilities for Appium Flutter Integration Driver

| Capability                       | Description                                                             | Required |
|----------------------------------|-------------------------------------------------------------------------|----------|
| appium:flutterServerLaunchTimeout | Time in ms to wait for flutter server to be pingable. Default is 5000ms | No       |
| appium:flutterSystemPort         | The number of the port on the host machine used for the Flutter server. By default the first free port from 10000..11000 range is selected. It is recommended to set this value if you are running parallel tests on the same machine.| No       |


🚨 **Important Notice for iOS Testing**

⚠️ Testing on real iOS devices for `semanticsLabel` may not work due to an issue raised with Flutter. For updates and more information, please refer to [GitHub issue #151238](https://github.com/flutter/flutter/issues/151238).
