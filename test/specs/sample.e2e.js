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

describe('My Login application', () => {
  it('Create Session with Flutter Integration Driver', async () => {
    await performLogin();
  });
});
