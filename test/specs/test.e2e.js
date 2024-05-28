describe('My Login application', () => {
  it('Create Session with Flutter Integration Driver', async () => {
    await browser.pause(2000);
    const element = await (
      await browser.flutterFinderByKey$('body')
    ).flutterFinderByKey$('increment');
    await element.click();
    let counterValueElement = await browser.flutterFinderByKey$('counterValue');
    expect(await counterValueElement.getText()).toEqual('1');

    //This will route to UIA2 driver
    console.log(await $('~counterValue').getText());

    let incrementElements = await browser.flutterFinderByKey$$('increment');
    expect(incrementElements.length).toEqual(2);
  });
});
