import { browser, expect } from '@wdio/globals';

describe('My Login application', () => {
  beforeEach(async () => {
    await browser.reloadSession();
  });
  it('Create Session with Flutter Integration Driver', async () => {
    await browser.flutterBySemanticsLabel$('username_text_field').clearValue();
    await browser
      .flutterBySemanticsLabel$('username_text_field')
      .addValue('admin');

    await browser.flutterBySemanticsLabel$('password_text_field').clearValue();
    await browser.flutterByValueKey$('password').addValue('1234');
    await browser.flutterBySemanticsLabel$('login_button').click();

    await browser.flutterByText$('Double Tap').click();
    const element = await browser
      .flutterBySemanticsLabel$('double_tap_button')
      .flutterByText$('Double Tap');
    expect(await element.getText()).toEqual('Double Tap');
    await browser.flutterDoubleClick({ finder: element });
    const popUpText = await browser.flutterByText$('Double Tap Successful');
    expect(await popUpText.getText()).toEqual('Double Tap Successful');
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
