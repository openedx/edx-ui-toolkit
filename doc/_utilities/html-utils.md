---
title: utils/html-utils
requirePath: edx-ui-toolkit/js/utils/html-utils
githubPath: blob/master/src/js/utils/html-utils.js
viewClass: utility
---

# HtmlUtils

Useful functions for dealing with HTML.

In particular, these functions default to being safe against
Cross Site Scripting (XSS) attacks.



* * *

### HtmlUtils.HtmlSnippet(htmlString) 

Creates an HTML snippet.

The intention of an HTML snippet is to communicate that the string
it represents contains HTML that has been safely escaped as necessary.
As an example, this allows interpolate to understand that
it does not need to further escape this HTML.

**Parameters**

**htmlString**: `string`, The string of HTML.



### HtmlUtils.HTML(htmlString) 

Helper function to create an HTML snippet from a string.

The intention of an HTML snippet is to communicate that the string
it represents contains HTML that has been safely escaped as necessary.

**Parameters**

**htmlString**: `string`, The string of HTML.

**Returns**: `HtmlSnippet`, An HTML snippet that can be safely rendered.


### HtmlUtils.ensureHtml(html) 

Ensures that the provided text is properly HTML-escaped.

If a plain text string is provided, then it will be HTML-escaped and
returned as an HtmlSnippet. If the parameter is an HTML snippet
then it will be returned directly so as not to double escape it.

**Parameters**

**html**: `string | HtmlSnippet`, Either a plain text string
or an HTML snippet.

**Returns**: `HtmlSnippet`, A safely escaped HTML snippet.


### HtmlUtils.interpolateHtml(formatString, parameters) 

Returns an HTML snippet by interpolating the provided parameters.

The text is provided as a tokenized format string where parameters
are indicated via curly braces, e.g. 'Hello {name}'. These tokens are
replaced by the parameter value of the same name.

Parameter values will be rendered using their toString methods and then
HTML-escaped. The only exception is that instances of the class HTML
are rendered without escaping as their contract declares that they are
already valid HTML.

Example:
  HtmlUtils.interpolateHtml(
      'You are enrolling in {spanStart}{courseName}{spanEnd}',
      {
          courseName: 'Rock & Roll 101',
          spanStart: HtmlUtils.HTML('<span class="course-title">'),
          spanEnd: HtmlUtils.HTML('</span>')
      }
  );

returns:
  'You are enrolling in <span class="course-title">Rock &amp; Roll 101</span>'

Note: typically the formatString will need to be internationalized, in which
case it will be wrapped with a call to an i18n lookup function. If using
the Django i18n library this would look like:

  HtmlUtils.interpolateHtml(
      gettext('You are enrolling in {spanStart}{courseName}{spanEnd}'),
      ...
  );

**Parameters**

**formatString**: `string`, The string to be interpolated.

**parameters**: `Object`, An optional set of parameters for interpolation.

**Returns**: `HtmlSnippet`, The resulting safely escaped HTML snippet.


### HtmlUtils.joinHtml(items) 

Joins multiple strings and/or HTML snippets together to produce
a single safely escaped HTML snippet.

For each item, if it is provided as an HTML snippet then it is joined
directly. If the item is a string then it is assumed to be unescaped and
so it is first escaped before being joined.

**Parameters**

**items**: `string | HtmlSnippet`, The strings and/or HTML snippets
to be joined together.

**Returns**: `HtmlSnippet`, The resulting safely escaped HTML snippet.


### HtmlUtils.template(text, settings) 

Returns a function that renders an Underscore template as an HTML snippet.

Note: This helper function makes the following context parameters
available to the template in addition to those passed in:

  - HtmlUtils: the HtmlUtils helper class
  - StringUtils: the StringUtils helper class

**Parameters**

**text**: `string`, Returns a function that renders an Underscore template as an HTML snippet.

Note: This helper function makes the following context parameters
available to the template in addition to those passed in:

  - HtmlUtils: the HtmlUtils helper class
  - StringUtils: the StringUtils helper class

**settings**: `object`, Returns a function that renders an Underscore template as an HTML snippet.

Note: This helper function makes the following context parameters
available to the template in addition to those passed in:

  - HtmlUtils: the HtmlUtils helper class
  - StringUtils: the StringUtils helper class

**Returns**: `function`, A function that returns a rendered HTML snippet.


### HtmlUtils.setHtml(element, html) 

A wrapper for $.html that safely escapes the provided HTML.

If the HTML is provided as an HTML snippet then it is used directly.
If the value is a string then it is assumed to be unescaped and
so it is first escaped before being used.

**Parameters**

**element**: `element`, The element or elements to be updated.

**html**: `string | HtmlSnippet`, The desired HTML, either as a
plain string or as an HTML snippet.

**Returns**: `JQuery`, The JQuery object representing the element or elements.


### HtmlUtils.append(element, html) 

A wrapper for $.append that safely escapes the provided HTML.

If the HTML is provided as an HTML snippet then it is used directly.
If the value is a string then it is assumed to be unescaped and
so it is first escaped before being used.

**Parameters**

**element**: `element`, The element or elements to be updated.

**html**: `string | HtmlSnippet`, The desired HTML, either as a
plain string or as an HTML snippet.

**Returns**: `JQuery`, The JQuery object representing the element or elements.


### HtmlUtils.prepend(element, html) 

A wrapper for $.prepend that safely escapes the provided HTML.

If the HTML is provided as an HTML snippet then it is used directly.
If the value is a string then it is assumed to be unescaped and
so it is first escaped before being used.

**Parameters**

**element**: `element`, The element or elements to be updated.

**html**: `string | HtmlSnippet`, The desired HTML, either as a
plain string or as an HTML snippet.

**Returns**: `JQuery`, The JQuery object representing the element or elements.



* * *










