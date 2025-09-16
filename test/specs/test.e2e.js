import { browser, expect } from '@wdio/globals';
import path from 'path';

async function performLogin(userName = 'admin', password = '1234') {
   await browser.takeScreenshot();
   const att = await browser.flutterByValueKey$('username_text_field');
   console.log(await att.getAttribute('all'));
   await browser.flutterByValueKey$('username_text_field').clearValue();
   await browser.flutterByValueKey$('username_text_field').addValue(userName);

   await browser.flutterByValueKey$('password_text_field').clearValue();
   await browser.flutterByValueKey$('password').addValue(password);
   await browser.flutterByValueKey$('LoginButton').click();
}

function itForAndroidOnly(description, fn) {
   if (browser.isIOS) {
      it.skip(description, fn);
   } else {
      it(description, fn);
   }
}

async function openScreen(screenTitle) {
   const screenListElement = await browser.flutterScrollTillVisible({
      finder: await browser.flutterByText(screenTitle),
   });
   await screenListElement.click();
}

async function switchToWebview(timeout = 20000) {
   const webviewContext = await browser.waitUntil(
      async () => {
         const contexts = await browser.getContexts();
         return contexts.find((ctx) => ctx.includes('WEBVIEW'));
      },
      {
         timeout,
         timeoutMsg: `WEBVIEW context not found within ${timeout / 1000}s`,
      },
   );

   await browser.switchContext(webviewContext);
   return webviewContext;
}

describe('My Login application', () => {
   afterEach(async () => {
      const currentContext = await browser.getContext();
      if (currentContext !== 'NATIVE_APP') {
         await browser.switchContext('NATIVE_APP');
      }

      const appID = browser.isIOS
         ? 'com.example.appiumTestingApp'
         : 'com.example.appium_testing_app';
      if (await browser.isAppInstalled(appID)) {
         await browser.removeApp(appID);
      }
      await browser.installApp(process.env.APP_PATH);
      await browser.pause(2000);
      if (await browser.isAppInstalled(appID)) {
         console.log('App is installed');
         await browser.execute('flutter: launchApp', {
            appId: appID,
            arguments: ['--dummy-arguments'],
            environment: {},
         });
      }
   });

   it('Create Session with Flutter Integration Driver', async () => {
      await performLogin();
      await openScreen('Double Tap');
      const element = await browser
         .flutterByValueKey$('double_tap_button')
         .flutterByText$('Double Tap');
      expect(await element.getText()).toEqual('Double Tap');
      const size = await element.getSize();
      expect(parseInt(size.width)).toBeGreaterThan(0);
      expect(parseInt(size.height)).toBeGreaterThan(0);
      await browser.flutterDoubleClick({
         element: element,
      });
      let popUpText = await browser.flutterByText$('Double Tap Successful');
      expect(await popUpText.getText()).toEqual('Double Tap Successful');
      await browser.flutterByText$('Ok').click();
      await browser.flutterDoubleClick({
         element,
         offset: {
            x: 10,
            y: 0,
         },
      });
      popUpText = await browser.flutterByText$('Double Tap Successful');
      expect(await popUpText.getText()).toEqual('Double Tap Successful');
   });

   it('Wait Test', async () => {
      await performLogin();
      await openScreen('Lazy Loading');
      const message = await browser.flutterByValueKey$('message_field');
      expect(await message.getText()).toEqual('Hello world');
      await browser.flutterByValueKey$('toggle_button').click();
      await browser.flutterWaitForAbsent({ element: message, timeout: 10 });
      expect(
         await (
            await browser.flutterByValueKey$$('message_field')
         ).length,
      ).toEqual(0);
      await browser.flutterByValueKey$('toggle_button').click();
      await browser.flutterWaitForVisible({ element: message, timeout: 10 });
      expect(await message.getText()).toEqual('Hello world');
   });

   it('Descendant Test', async () => {
      await performLogin();
      await openScreen('Nested Scroll');
      const childElement = await browser.flutterByDescendant$({
         of: await browser.flutterByValueKey('parent_card_1'),
         matching: await browser.flutterByText('Child 2'),
      });
      expect(await childElement.getText()).toEqual('Child 2');
   });

   it.skip('Scroll until visible with Descendant', async () => {
      await performLogin();
      await openScreen('Nested Scroll');
      const childElement = await browser.flutterScrollTillVisible({
         finder: await browser.flutterByDescendant({
            of: await browser.flutterByValueKey('parent_card_4'),
            matching: await browser.flutterByText('Child 2'),
         }),
         delta: 100,
         scrollDirection: 'down',
      });
      expect(await childElement.getText()).toEqual('Child 2');
   });
   it('Ancestor Test', async () => {
      await performLogin();
      await openScreen('Nested Scroll');
      const parentElement = await browser.flutterByAncestor$({
         of: await browser.flutterByText('Child 2'),
         matching: await browser.flutterByValueKey('parent_card_1'),
      });
      expect(await parentElement.getAttribute('displayed')).toBe(true);
   });
   it('Scroll Test', async () => {
      await performLogin();
      await openScreen('Vertical Swiping');
      const javaElement = await browser.flutterScrollTillVisible({
         finder: await browser.flutterByText('Java'),
      });
      expect(await javaElement.getAttribute('displayed')).toBe(true);

      const protractorElement = await browser.flutterScrollTillVisible({
         finder: await browser.flutterByText('Protractor'),
      });
      expect(await javaElement.getAttribute('displayed')).toBe(false);
      expect(await protractorElement.getAttribute('displayed')).toBe(true);

      await browser.flutterScrollTillVisible({
         finder: await browser.flutterByText('Java'),
         scrollDirection: 'up',
      });
      expect(await protractorElement.getAttribute('displayed')).toBe(false);
      expect(await javaElement.getAttribute('displayed')).toBe(true);
   });

   it('Long Press', async () => {
      await performLogin();
      await openScreen('Long Press');
      const longPressElement =
         await browser.flutterByValueKey$('long_press_button');
      await browser.flutterLongPress({ element: longPressElement });
      const popUpText = await browser
         .flutterByText$('It was a long press')
         .isDisplayed();
      expect(popUpText).toBe(true);
   });

   it('Should be able perform action when frame is rendering', async () => {
      await performLogin();
      await openScreen('Loader Screen');
      await browser.flutterByValueKey$('loader_login_button').click();
      expect(await browser.flutterByText$('Button pressed').isDisplayed()).toBe(
         true,
      );
   });

   it('Properties Test', async () => {
      await performLogin();
      await openScreen('UI Elements');
      const prop2 = await browser.flutterBySemanticsLabel$(
         'disabled_text_field',
      );
      const disableTextFieldState = await prop2.getAttribute('flags');
      expect(disableTextFieldState).toEqual(
         '[isTextField, hasEnabledState, isReadOnly]',
      );

      const prop4 = await browser.flutterBySemanticsLabel$('switch_button');
      await prop4.getAttribute('flags');
      expect(await prop4.getAttribute('flags')).toEqual(
         '[hasEnabledState, isEnabled, hasToggledState, isFocusable]',
      );
      await prop4.click();
      await prop4.getAttribute('flags');
      expect(await prop4.getAttribute('flags')).toEqual(
         '[hasEnabledState, isEnabled, hasToggledState, isToggled, isFocusable]',
      );
      const prop5 = await browser.flutterBySemanticsLabel$('switch_button');
      await prop5.getAttribute('all'); // Will return all attributes attached to the element
      // {
      //   owner: 'SemanticsOwner#fd8a3',
      //     isMergedIntoParent: 'false',
      //   mergeAllDescendantsIntoThisNode: 'false',
      //   rect: 'Rect.fromLTRB(0.0, 0.0, 60.0, 48.0)',
      //   tags: 'null',
      //   actions: '[tap]',
      //   customActions: '[]',
      //   flags: '[hasEnabledState, isEnabled, hasToggledState, isToggled, isFocusable]',
      //   isInvisible: 'false',
      //   isHidden: 'false',
      //   identifier: 'null',
      //   label: 'switch_button',
      //   value: 'null',
      //   increasedValue: 'null',
      //   decreasedValue: 'null',
      //   hint: 'null',
      //   tooltip: 'null',
      //   textDirection: 'null',
      //   sortKey: 'null',
      //   platformViewId: 'null',
      //   maxValueLength: 'null',
      //   currentValueLength: 'null',
      //   scrollChildren: 'null',
      //   scrollIndex: 'null',
      //   scrollExtentMin: 'null',
      //   scrollPosition: 'null',
      //   scrollExtentMax: 'null',
      //   indexInParent: 'null',
      //   elevation: '0.0',
      //   thickness: '0.0',
      //   container: 'true',
      //   properties: 'SemanticsProperties(label: "switch_button")',
      //   checked: 'null',
      //   mixed: 'null',
      //   expanded: 'null',
      //   selected: 'null',
      //   attributedLabel: 'null',
      //   attributedValue: 'null',
      //   attributedIncreasedValue: 'null',
      //   attributedDecreasedValue: 'null',
      //   attributedHint: 'null',
      //   hintOverrides: 'null'
      // }
   });

   it.skip('Invalid Driver', async () => {
      await browser
         .flutterBySemanticsLabel$('username_text_field')
         .clearValue();
      await browser
         .flutterBySemanticsLabel$('username_text_field')
         .addValue('admin1');

      await browser
         .flutterBySemanticsLabel$('password_text_field')
         .clearValue();
      await browser.flutterByValueKey$('password').addValue('12345');
      await browser.flutterBySemanticsLabel$('login_button').click();

      await browser.flutterByText$('Ok').click();
   });

   it('Drag and Drop', async () => {
      await performLogin();
      await openScreen('Drag & Drop');
      const dragElement = await browser.flutterByValueKey$('drag_me');
      const dropElement = await browser.flutterByValueKey$('drop_zone');
      await browser.flutterDragAndDrop({
         source: dragElement,
         target: dropElement,
      });
      const dropped = await browser
         .flutterByText$('The box is dropped')
         .getText();
      expect(dropped).toEqual('The box is dropped');
   });

   //TODO: Wbview is not inspectable on iOS demo app, need to fix it.
   itForAndroidOnly(
      'should switch to webview context and validate the page title',
      async () => {
         await performLogin();
         await openScreen('Web View');
         await switchToWebview();

         await browser.waitUntil(
            async () => (await browser.getTitle()) === 'Hacker News',
            {
               timeout: 10000,
               timeoutMsg: 'Expected Hacker News title not found',
            },
         );

         const title = await browser.getTitle();
         expect(title).toEqual(
            'Hacker News',
            'Webview title did not match expected',
         );
      },
   );

   itForAndroidOnly(
      'should execute native commands correctly while in Webview context',
      async () => {
         await performLogin();
         await openScreen('Web View');
         await switchToWebview();

         // Verify no-proxy native commands still operate while in webview context
         const currentContext = await browser.getContext();
         expect(currentContext).toContain('WEBVIEW');

         const contexts = await browser.getContexts();
         expect(Array.isArray(contexts)).toBe(true);
         expect(contexts.length).toBeGreaterThan(0);

         const windowHandle = await browser.getWindowHandle();
         expect(typeof windowHandle).toBe('string');

         const pageSource = await browser.getPageSource();
         expect(typeof pageSource).toBe('string');
      },
   );

   itForAndroidOnly(
      'should switch back and forth between native and Webview contexts',
      async () => {
         await performLogin();
         await openScreen('Web View');

         await switchToWebview();
         expect(await browser.getContext()).toContain('WEBVIEW');

         await browser.switchContext('NATIVE_APP');
         expect(await browser.getContext()).toBe('NATIVE_APP');

         await switchToWebview();
         expect(await browser.getContext()).toContain('WEBVIEW');
      },
   );
});

describe('Image mocking', async () => {
   afterEach(async () => {
      await handleAppManagement();
   });

   it('Inject Image', async () => {
      const firstImageToMock = path.resolve('test/qr.png');
      const secondImageToMock = path.resolve('test/SecondImage.png');
      await performLogin();
      await openScreen('Image Picker');
      const firstInjectedImage =
         await browser.flutterInjectImage(firstImageToMock);
      await browser.flutterByValueKey$('capture_image').click();
      await browser.flutterByText$('PICK').click();
      expect(await browser.flutterByText$('Success!').isDisplayed()).toBe(true);
      await browser.flutterInjectImage(secondImageToMock);
      await browser.flutterByValueKey$('capture_image').click();
      await browser.flutterByText$('PICK').click();
      expect(
         await browser.flutterByText$('SecondInjectedImage').isDisplayed(),
      ).toBe(true);
      await browser.flutterActivateInjectedImage({
         imageId: firstInjectedImage,
      });
      await browser.flutterByValueKey$('capture_image').click();
      await browser.flutterByText$('PICK').click();
      expect(await browser.flutterByText$('Success!').isDisplayed()).toBe(true);
   });
});
