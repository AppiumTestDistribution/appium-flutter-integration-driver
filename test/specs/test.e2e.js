import { browser } from '@wdio/globals';

describe('My Login application', () => {
  it('Create Session with Flutter Integration Driver', async () => {
    await browser.pause(2000);
    await browser.flutterBySemanticsLabel$('username_text_field').clearValue();
    await browser.pause(2000);
    await browser.flutterBySemanticsLabel$('username_text_field').addValue('test');
    await browser.pause(2000);
    // const element = await (
    //   await browser.flutterFinderByKey$('body')
    // ).flutterFinderByKey$('increment');
    //await browser.flutterWaitForAbsent({finderType: 'key', finderValue: 'increment'});
    // const element = await browser.flutterByValueKey$('increment');
    // await element.click();
    // let counterValueElement = await browser.flutterByValueKey$('counterValue');
    // expect(await counterValueElement.getText()).toEqual('1');
    //
    // //This will route to UIA2 driver
    // console.log(await $('~counterValue').getText());
    //
    // let incrementElements = await browser.flutterByValueKey$$('increment');
    // expect(incrementElements.length).toEqual(2);
  });
});
