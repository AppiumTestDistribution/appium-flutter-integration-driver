import { browser, expect } from '@wdio/globals';

async function performLogin(userName = 'admin', password = '1234') {
  await browser.takeScreenshot();
  await browser.flutterBySemanticsLabel$('username_text_field').clearValue();
  await browser
    .flutterBySemanticsLabel$('username_text_field')
    .addValue(userName);

  await browser.flutterBySemanticsLabel$('password_text_field').clearValue();
  await browser.flutterByValueKey$('password').addValue(password);
  await browser.flutterBySemanticsLabel$('login_button').click();
}

async function openScreen(screenTitle) {
  const screenListElement = await browser.flutterScrollTillVisible({
    finder: await browser.flutterByText(screenTitle),
  });
  await screenListElement.click();
}

describe('My Login application', () => {
  afterEach(async () => {
    await browser.reloadSession();
  });

  it('Create Session with Flutter Integration Driver', async () => {
    await performLogin();
    await openScreen('Double Tap');
    const element = await browser
      .flutterBySemanticsLabel$('double_tap_button')
      .flutterByText$('Double Tap');
    expect(await element.getText()).toEqual('Double Tap');
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
    const message = await browser.flutterBySemanticsLabel$('message_field');
    expect(await message.getText()).toEqual('Hello world');
    await browser.flutterBySemanticsLabel$('toggle_button').click();
    await browser.flutterWaitForAbsent({ element: message, timeout: 10 });
    expect(
      await (
        await browser.flutterBySemanticsLabel$$('message_field')
      ).length,
    ).toEqual(0);
    await browser.flutterBySemanticsLabel$('toggle_button').click();
    await browser.flutterWaitForVisible({ element: message, timeout: 10 });
    expect(await message.getText()).toEqual('Hello world');
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

  it.skip('Invalid Driver', async () => {
    await browser.flutterBySemanticsLabel$('username_text_field').clearValue();
    await browser
      .flutterBySemanticsLabel$('username_text_field')
      .addValue('admin1');

    await browser.flutterBySemanticsLabel$('password_text_field').clearValue();
    await browser.flutterByValueKey$('password').addValue('12345');
    await browser.flutterBySemanticsLabel$('login_button').click();

    await browser.flutterByText$('Ok').click();
  });
});
