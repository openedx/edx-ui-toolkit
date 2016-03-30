# How to contribute

This is an Open edX repo, and we welcome your contributions!
Please read the [contributing guidelines](http://edx.readthedocs.org/projects/edx-developer-guide/en/latest/process/index.html).

Here are some areas of heightened importance to consider when contributing to the UI Toolkit:

- RTL
  - Will the feature work for right-to-left languages?
- a11y
  - Are functionality and navigation accessible to those using screen readers or keyboards?
  - Are there any special cases around focus management that need to be addressed?
  - Does markup make use of aria attributes, where applicable?
- Browser support
  - Does the feature work at all screen sizes and pixel densities?
  - Are the browser features this code relies on available in all edX supported browsers?
- Pattern Library
  - If this feature introduces a new pattern then has it been contributed to the Pattern Library repo?
