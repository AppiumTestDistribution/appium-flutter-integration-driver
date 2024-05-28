// @ts-ignore
import { command } from 'webdriver';

browser.addCommand(
  'flutterFinderByKey',
  command('POST', '/session/:sessionId/element', {
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
    ],
    returns: {
      type: 'object',
      name: 'element',
      description:
        "A JSON representation of an element object, e.g. `{ 'element-6066-11e4-a52e-4f735466cecf': 'ELEMENT_1' }`.",
    },
  }),
);
