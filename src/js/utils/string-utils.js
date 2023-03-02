/**
 * Useful functions for dealing with strings.
 *
 * @module StringUtils
 */
(function (define) {
    'use strict';

    define([], function () {
        var interpolate;

        /**
         * Returns a string created by interpolating the provided parameters.
         *
         * The text is provided as a tokenized format string where parameters are
         * indicated via curly braces, e.g. 'Hello {name}'. These tokens are
         * replaced by the parameter value of the same name.
         *
         * Parameter values will be rendered using their toString methods.
         * **NO** HTML escaping or sanitizing of any form is performed.
         * If HTML escaping is required (for example, if user supplied input is
         * being interpolated), use HtmlUtils.interpolateHtml().
         *
         * Example:
         *
         *~~~ javascript
         * StringUtils.interpolate(
         *     'You are enrolling in {courseName}',
         *     {
         *         courseName: 'Rock & Roll 101',
         *     }
         * );
         *~~~
         *
         * returns:
         *
         *~~~ javascript
         * 'You are enrolling in Rock & Roll 101'
         *~~~
         *
         * Note: typically the formatString will need to be internationalized, in which
         * case it will be wrapped with a call to an i18n lookup function. In Django,
         * this would look like:
         *
         *~~~ javascript
         * StringUtils.interpolate(
         *     gettext('You are enrolling in {courseName}'),
         *     ...
         * );
         *~~~
         *
         * @param {string} formatString The string to be interpolated.
         * @param {Object} parameters An optional set of parameters to the template.
         * @returns {string} A string with the values interpolated.
         */
        interpolate = function (formatString, parameters) {
            return formatString.replace(/{\w+}/g,
                function (parameter) {
                    var parameterName = parameter.slice(1, -1);
                    return String(parameters[parameterName]);
                });
        };

        return {
            interpolate: interpolate,
        };
    });
}).call(
    this,
    // Pick a define function as follows:
    // 1. Use the default 'define' function if it is available
    // 2. If not, use 'RequireJS.define' if that is available
    // 3. else use the GlobalLoader to install the class into the edx namespace
    // eslint-disable-next-line no-nested-ternary
    typeof define === 'function' && define.amd ? define
        : (typeof RequireJS !== 'undefined' ? RequireJS.define
            : edx.GlobalLoader.defineAs('StringUtils', 'edx-ui-toolkit/js/utils/string-utils')),
);
