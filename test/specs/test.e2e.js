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
    try {
      await browser.reloadSession();
    } catch (e) {
      // Do nothing;
    }
  });

  it.only('Create Session with Flutter Integration Driver', async () => {
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

  it.only('Scroll Test', async () => {
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
      await browser.flutterBySemanticsLabel$('long_press_button');
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
    expect(await browser.flutterByText$('Button pressed').isDisplayed()).toBe(true);
  });

  it('Properties Test', async () => {
    await performLogin();
    await openScreen('UI Elements');
    const prop2 = await browser.flutterBySemanticsLabel$('disabled_text_field');
    const disableTextFieldState = await prop2.getAttribute('flags');
    expect(disableTextFieldState).toEqual('[isTextField, hasEnabledState, isReadOnly]');

    const prop4 = await browser.flutterBySemanticsLabel$('switch_button');
    await prop4.getAttribute('flags')
    expect(await prop4.getAttribute('flags')).toEqual('[hasEnabledState, isEnabled, hasToggledState, isFocusable]');
    await prop4.click();
    await prop4.getAttribute('flags');
    expect(await prop4.getAttribute('flags')).toEqual('[hasEnabledState, isEnabled, hasToggledState, isToggled, isFocusable]');
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
    await browser.flutterBySemanticsLabel$('username_text_field').clearValue();
    await browser
      .flutterBySemanticsLabel$('username_text_field')
      .addValue('admin1');

    await browser.flutterBySemanticsLabel$('password_text_field').clearValue();
    await browser.flutterByValueKey$('password').addValue('12345');
    await browser.flutterBySemanticsLabel$('login_button').click();

    await browser.flutterByText$('Ok').click();
  });

  it('Drag and Drop', async() => {
    await performLogin();
    await openScreen('Drag & Drop');
    const dragElement = await browser.flutterBySemanticsLabel$('drag_me');
    const dropElement = await browser.flutterBySemanticsLabel$('drop_zone');
    await browser.flutterDragAndDrop({
      source: dragElement,
      target: dropElement,
    });
    const dropped = await browser.flutterByText$('The box is dropped').getText();
    expect(dropped).toEqual('The box is dropped');
  })

  it('Multi scroll view', async() => {
    await performLogin();
    await openScreen('Multiple Scrollview');
    const scrollElement = await browser.flutterBySemanticsLabel('multiple_scroll_view_vertical_scroll');
    await browser.flutterScrollTillVisible({
      finder: await browser.flutterByText('3'),
      scrollView: scrollElement,
      scrollDirection: 'down',
    });
  });
});
