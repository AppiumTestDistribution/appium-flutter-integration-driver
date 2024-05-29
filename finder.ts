// @ts-ignore
import { command } from 'webdriver';
import path from 'path';

export async function registerCommands() {
  const utils = await import(
    path.join(
      require.resolve('webdriverio').replace('cjs/index.js', ''),
      'utils',
      'getElementObject.js',
    )
  );

  function handler(multi: boolean = false) {
    return async function (value: string) {
      let findElement;

      let args = ['key', value];
      let suffix = multi ? 'elements' : 'element';
      if (this['elementId']) {
        args = [this['elementId'], 'key', value];
        findElement = command(
          'POST',
          `/session/:sessionId/element/:elementId/${suffix}`,
          {
            command: 'flutterFinderByKey',
            description: 'a new WebDriver command',
            ref: 'https://vendor.com/commands/#myNewCommand',
            variables: [
              {
                name: 'elementId',
                type: 'string',
                description: 'a valid parameter',
                required: true,
              },
            ],
            parameters: [
              {
                name: 'using',
                type: 'string',
                description: 'a valid parameter',
                required: true,
              },
              {
                name: 'value',
                type: 'string',
                description: 'a valid parameter',
                required: true,
              },
            ],
            returns: {
              type: 'object',
              name: 'element',
              description:
                "A JSON representation of an element object, e.g. `{ 'element-6066-11e4-a52e-4f735466cecf': 'ELEMENT_1' }`.",
            },
          },
        );
      } else {
        findElement = command('POST', `/session/:sessionId/${suffix}`, {
          command: 'flutterFinderByKey',
          description: 'a new WebDriver command',
          ref: 'https://vendor.com/commands/#myNewCommand',
          variables: [],
          parameters: [
            {
              name: 'using',
              type: 'string',
              description: 'a valid parameter',
              required: true,
            },
            {
              name: 'value',
              type: 'string',
              description: 'a valid parameter',
              required: true,
            },
            {
              name: 'context',
              type: 'string',
              description: 'a valid parameter',
              required: false,
            },
          ],
          returns: {
            type: 'object',
            name: 'element',
            description:
              "A JSON representation of an element object, e.g. `{ 'element-6066-11e4-a52e-4f735466cecf': 'ELEMENT_1' }`.",
          },
        });
      }

      const response = await findElement.call(browser, ...args);
      console.log(utils.getElement);
      try {
        if (multi) {
          return response.map((element: any) =>
            utils.getElement.call(this, null, element),
          );
        } else {
          return utils.getElement.call(this, null, response);
        }
      } catch (e) {
        console.log(e);
      }
    };
  }
  browser.addCommand('flutterFinderByKey$', handler());
  browser.addCommand('flutterFinderByKey$', handler(), true);

  browser.addCommand('flutterFinderByKey$$', handler(true));
  browser.addCommand('flutterFinderByKey$$', handler(true), true);

  /**
   *
   * 1. Element visible
   * 2. Element not visible
   * 3. element enable/disabled
   * 4. Element count
   * 6.
   *
   */
}
