describe('My Login application', () => {
  it('Create Session with Flutter Integration Driver', async () => {
    await browser.pause(2000);
    const element = await browser.flutterFinderByKey('key', 'increment');
    await browser.elementClick(element.ELEMENT);
    let counterValueElement = await browser.flutterFinderByKey(
      'key',
      'counterValue',
    );
    let counterValue = await browser.getElementText(
      counterValueElement.ELEMENT,
    );
    expect(counterValue).toEqual('1');
    const isElementVisible = await browser.flutterFinderByKey(
      'key',
      'increment',
    );
    await browser.isElementDisplayed(isElementVisible.ELEMENT);

    //This will route to UIA2 driver
    await $('~counterValue').getText();
  });
});
