/**
 * Useful functions for dealing with HTML.
 *
 * In particular, these functions default to being safe against
 * Cross Site Scripting (XSS) attacks.
 */
(function(define) {
    'use strict';
    define(['underscore', 'edx-ui-toolkit/js/utils/string-utils'], function(_, StringUtils) {
        var escape, interpolateHtml, HTML, template;

        /**
         * Helper function to return a string flagged as an HTML snippet.
         *
         * @param {string} htmlString The string of HTML.
         * @returns {string} A string flagged as an HTML snippet.
         * @constructor
         */
        HTML = function(htmlString) {
            var htmlSnippet = new String(htmlString); // jshint ignore:line
            htmlSnippet.isHtmlSnippet = true;
            return htmlSnippet;
        };

        /**
         * Returns an HTML string that is appropriately escaped.
         *
         * Note: if the string provided is flagged as being an HTML snippet
         * then it will be returned directly so as not to double escape it.
         *
         * @param {string} text A string that is either plan text, or is
         * flagged as being an HTML snippet.
         * @returns {string} A safely HTML-escaped string.
         */
        escape = function(text) {
            if (text.isHtmlSnippet) {
                return text.toString();
            } else {
                return _.escape(text);
            }
        };

        /**
         * Returns an HTML snippet by interpolating the provided parameters.
         *
         * The HTML text is provided as a tokenized format string where parameters
         * are indicated via curly braces, e.g. 'Hello {name}'. These tokens are
         * replaced by the parameter value of the same name.
         *
         * Parameter values will be rendered using their toString methods and then
         * HTML-escaped. The only exception is that instances of the class HTML
         * are rendered without escaping as their contract declares that they are
         * already valid HTML.
         *
         * Example:
         *   HtmlUtils.interpolateHtml(
         *       'You are enrolling in {spanStart}{courseName}{spanEnd}',
         *       {
         *           courseName: 'Rock & Roll 101',
         *           spanStart: HtmlUtils.HTML('<span class="course-title">'),
         *           spanEnd: HtmlUtils.HTML('</span>')
         *       }
         *   );
         *
         * returns:
         *   'You are enrolling in <span class="course-title">Rock &amp; Roll 101</span>'
         *
         * Note: typically the formatString will need to be internationalized, in which
         * case it will be wrapped with a call to an i18n lookup function. In Django,
         * this would look like:
         *
         *   HtmlUtils.interpolateHtml(
         *       gettext('You are enrolling in {spanStart}{courseName}{spanEnd}'),
         *       ...
         *   );
         *
         * @param {string} formatString The string to be interpolated.
         * @param {Object} parameters An optional set of parameters to the template.
         * @returns {string} The resulting safely escaped string flagged as
         * an HTML snippet.
         */
        interpolateHtml = function(formatString, parameters) {
            var result = StringUtils.interpolate(
                escape(formatString).toString(),
                _.mapObject(parameters, escape)
            );
            return HTML(result);
        };

        /**
         * Returns a function that renders an Underscore template as a string.
         *
         * Note: This helper function makes the following context parameters
         * available to the template in addition to those passed in:
         *
         *   * HtmlUtils: the HtmlUtils helper class
         *
         * @param {string} text
         * @param {object} settings
         * @returns {function} A function that returns a rendered string.
         */
        template = function(text, settings) {
            var HtmlUtils = this,
                rawTemplate = _.template(text, settings),
                template = function(data) {
                    var augmentedData = _.extend(
                        {
                            HtmlUtils: HtmlUtils
                        },
                        data
                    );
                    return rawTemplate(augmentedData);
                };
            return template;
        };

        return {
            escape: escape,
            HTML: HTML,
            interpolateHtml: interpolateHtml,
            template: template
        };
    });
}).call(this, define || RequireJS.define);
