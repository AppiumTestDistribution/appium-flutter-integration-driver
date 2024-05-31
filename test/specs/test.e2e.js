import { browser, expect } from '@wdio/globals';

async function performLogin(userName = 'admin', password = '1234') {
  await browser.flutterBySemanticsLabel$('username_text_field').clearValue();
  await browser
    .flutterBySemanticsLabel$('username_text_field')
    .addValue(userName);

  await browser.flutterBySemanticsLabel$('password_text_field').clearValue();
  await browser.flutterByValueKey$('password').addValue(password);
  await browser.flutterBySemanticsLabel$('login_button').click();
}

describe('My Login application', () => {
  afterEach(async () => {
    await browser.reloadSession();
  });

  it('Create Session with Flutter Integration Driver', async () => {
    await performLogin();
    await browser.flutterByText$('Double Tap').click();
    const element = await browser
      .flutterBySemanticsLabel$('double_tap_button')
      .flutterByText$('Double Tap');
    expect(await element.getText()).toEqual('Double Tap');
    await browser.flutterDoubleClick(element);
    let popUpText = await browser.flutterByText$('Double Tap Successful');
    expect(await popUpText.getText()).toEqual('Double Tap Successful');
    await browser.flutterByText$('Ok').click();
    await browser.flutterGestureDoubleClick(element, {
      x: 10,
      y: 0,
    });
    popUpText = await browser.flutterByText$('Double Tap Successful');
    expect(await popUpText.getText()).toEqual('Double Tap Successful');
  });

  it('Wait Test', async () => {
    await performLogin();
    await browser.flutterByText$('Double Tap').click();
    const element = await browser
      .flutterBySemanticsLabel$('double_tap_button')
      .flutterByText$('Double Tap');
    await browser.flutterWaitForAbsent({ element: element, timeout: 10 });
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
