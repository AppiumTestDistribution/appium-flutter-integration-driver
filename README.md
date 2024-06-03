# appium-flutter-integration-driver


Appium Flutter Integration Driver is a test automation tool for Flutter apps on multiple platforms/OSes. Appium Flutter Integration Driver is part of the Appium mobile test automation tool maintained by the community. Feel free to create PRs to fix issues/improve this driver.

Native Flutter Driver vs Appium Flutter Driver
Even though Flutter comes with superb integration test support, Flutter Driver, it does not fit some specific use cases, such as

Writing tests in other languages than Dart
Running integration test for Flutter app with embedded webview or native view, or existing native app with embedded Flutter view
Running tests on multiple devices simultaneously
Running integration tests on device farms that offer Appium support (Please contact the availability for each vendor)
App interactions are limited within Flutter’s contextuality. For instance, sending an OTP from a message application is not possible during test phases.


**How is this different from Appium Flutter Driver?** 

Current appium flutter driver is built on top of flutter_test sdk which is deprecated.  [Expand deprecation policy to package:flutter_driver](https://github.com/flutter/flutter/issues/139249) potentially means this driver will no longer work by the future Flutter updates. They do not cover all cases that can cover the flutter_driver, such as permission dialog handling, thus we're not sure when the time comes though.


**Why use Appium Flutter Integration Driver?**

This driver is build using [Flutter Integration Test](https://docs.flutter.dev/cookbook/testing/integration/introduction) 


** How to use Appium Flutter Integration Driver?**

1. In you flutter app pubspec.yaml add the following dependencies
```yaml
dev_dependencies:
  appium_flutter_server: ^0.0.1
```
2. Create a directory called integration_test in the root of your flutter project
3. Create a file called appium_test.dart in the integration_test directory
4. Add the following code to the appium_test.dart file

```dart
import 'package:appium_flutter_server/appium_flutter_server.dart';
import 'package:appium_testing_app/main.dart';

void main() {
  initializeTest(app: const MyApp());
}
```

Bingo! You are ready to run your tests using Appium Flutter Integration Driver.


**Install the flutter integration driver**

```bash
appium driver install --source npm appium-flutter-integration-driver
```

**Do you have different ways to locator elements?** 
Yes, we have different ways to locator elements. You can use the following locators to find elements in your Flutter app.
We have custom finders build for WDIO. Refer to the [wdio-flutter-by-service](https://www.npmjs.com/package/wdio-flutter-by-service?activeTab=readme)
 
```
flutterByValueKey(value: string): Flutter.Locator;
flutterByValueKey$(value: string): WebdriverIO.Element;
flutterByValueKey$$(value: string): WebdriverIO.Element[];
flutterBySemanticsLabel(label: string): Flutter.Locator;
flutterBySemanticsLabel$(label: string): WebdriverIO.Element;
flutterBySemanticsLabel$$(label: string): WebdriverIO.Element[];
flutterByText(text: string): Flutter.Locator;
flutterByText$(text: string): WebdriverIO.Element;
flutterByText$$(text: string): WebdriverIO.Element[];
flutterDoubleClick(element: WebdriverIO.Element): WebdriverIO.Element;
flutterWaitForAbsent(options: {
  element: WebdriverIO.Element;
  locator: Flutter.Locator;
}): void;

flutterScrollTillVisible(options: {
  finder: WebdriverIO.Element;
  scrollView?: WebdriverIO.Element;
  scrollDirection?: 'up' | 'right' | 'down' | 'left';
  delta?: number;
  maxScrolls?: number;
  settleBetweenScrollsTimeout?: number;
  dragDuration?: number;
  }): Promise<WebdriverIO.Element | null>;
}
```

Examples: https://github.com/AppiumTestDistribution/appium-flutter-integration-driver/blob/main/test/specs/test.e2e.js

