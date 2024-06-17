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

## How to Use Appium Flutter Integration Driver

1. In your Flutter app's `pubspec.yaml`, add the following dependencies:

   Get the latest version from `https://pub.dev/packages/appium_flutter_server/install`

   ```yaml
   dev_dependencies:
     appium_flutter_server: ^0.0.7
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

   ```bash
   flutter build ios integration_test/appium.dart --release
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


## Install the Flutter Integration Driver

```bash
appium driver install --source npm appium-flutter-integration-driver
```

## Appium Flutter Integration Driver vs. Appium UiAutomator2/XCUITest Driver

- The driver manages the application under test and the device under test via Appium UiAutomator2/XCUITest drivers.
- Newer Flutter versions expose their accessibility labels to the system's accessibility features. This means some Flutter elements can be found and interacted with using `accessibility_id` in the vanilla Appium UiAutomator2/XCUITest drivers, although some elements require interaction over the Dart VM.
- Using native driver command will directly hit the Appium UiAutomator2/XCUITest driver.

For more details, refer to the documentation for each driver:

- [Appium UiAutomator2 Driver](https://github.com/appium/appium-uiautomator2-driver)
- [Appium XCUITest Driver](https://appium.github.io/appium-xcuitest-driver/latest)

## Capabilities for Appium Flutter Integration Driver

| Capability                | Description                                                             | Required |
| ------------------------- |-------------------------------------------------------------------------| -------- |
| appium:flutterServerLaunchTimeout | Time in ms to wait for flutter server to be pingable. Default is 5000ms | No       |


## Locating Elements

You can use the following locators to find elements in your Flutter app. Custom finders are built for WDIO. Refer to the [wdio-flutter-by-service](https://www.npmjs.com/package/wdio-flutter-by-service?activeTab=readme).

| Locator                                                                                                                                                                                                                                                                               | Description                                                    |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|
| `flutterByValueKey(value: string): Flutter.Locator`                                                                                                                                                                                                                                   | Locate by value key                                            |
| `flutterByValueKey$(value: string): WebdriverIO.Element`                                                                                                                                                                                                                              | Locate single element by value key                             |
| `flutterByValueKey$$(value: string): WebdriverIO.Element[]`                                                                                                                                                                                                                           | Locate multiple elements by value key                          |
| `flutterBySemanticsLabel(label: string): Flutter.Locator`                                                                                                                                                                                                                             | Locate by semantics label                                      |
| `flutterBySemanticsLabel$(label: string): WebdriverIO.Element`                                                                                                                                                                                                                        | Locate single element by semantics label                       |
| `flutterBySemanticsLabel$$(label: string): WebdriverIO.Element[]`                                                                                                                                                                                                                     | Locate multiple elements by semantics label                    |
| `flutterByText(text: string): Flutter.Locator`                                                                                                                                                                                                                                        | Locate by text                                                 |
| `flutterByText$(text: string): WebdriverIO.Element`                                                                                                                                                                                                                                   | Locate single element by text                                  |
| `flutterByType$(text: string): WebdriverIO.Element`                                                                                                                                                                                                                                   | Locate single element by Type(Checkbox, RadioButton, ListView) |
| `flutterByType$$(text: string): WebdriverIO.Element[]`                                                                                                                                                                                                                                | Locate multiple elements by text(Checkbox, RadioButton, ListView)|
| `flutterDoubleClick(element: WebdriverIO.Element): WebdriverIO.Element`                                                                                                                                                                                                               | Double click on an element                                     |
| `flutterWaitForAbsent(options: { element: WebdriverIO.Element; locator: Flutter.Locator; }): void`                                                                                                                                                                                    | Wait for an element to be absent                               |
| `flutterScrollTillVisible(options: { finder: WebdriverIO.Element; scrollView?: WebdriverIO.Element; scrollDirection?: 'up','right','down','left'; delta?: number; maxScrolls?: number; settleBetweenScrollsTimeout?: number; dragDuration?: number; }): Promise<WebdriverIO.Element>` | Scroll until an element is visible                             |

For more examples, see the [test file](https://github.com/AppiumTestDistribution/appium-flutter-integration-driver/blob/main/test/specs/test.e2e.js).
