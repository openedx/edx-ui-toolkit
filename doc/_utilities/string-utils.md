---
title: utils/string-utils
requirePath: edx-ui-toolkit/js/utils/string-utils
githubPath: blob/master/src/js/utils/string-utils.js
viewClass: utility
---

# StringUtils

Useful functions for dealing with strings.



* * *

### StringUtils.interpolate(formatString, parameters) 

Returns a string created by interpolating the provided parameters.

The text is provided as a tokenized format string where parameters are
indicated via curly braces, e.g. 'Hello {name}'. These tokens are
replaced by the parameter value of the same name.

Parameter values will be rendered using their toString methods and then
HTML-escaped. The only exception is that instances of the class HTML
are rendered without escaping as their contract declares that they are
already valid HTML.

Example:
  HtmlUtils.interpolate(
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
case it will be wrapped with a call to an i18n lookup function. In Django,
this would look like:

  HtmlUtils.interpolate(
      gettext('You are enrolling in {spanStart}{courseName}{spanEnd}'),
      ...
  );

**Parameters**

**formatString**: `string`, The string to be interpolated.

**parameters**: `Object`, An optional set of parameters to the template.

**Returns**: `string`, A string with the values interpolated.



* * *










