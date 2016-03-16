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
         * Creates an HTML snippet.
         *
         * The intention of an HTML snippet is to capture a string that
         * is known to contain HTML that has been safely escaped.
         * As an example, this allows interpolate to understand that
         * it does not need to further escape this HTML.
         *
         * @param {string} htmlString The string of HTML.
         * @constructor
         */
        function HtmlSnippet(htmlString) {
            this.text = htmlString;
        }
        HtmlSnippet.prototype.valueOf = function() {
            return this.text;
        };
        HtmlSnippet.prototype.toString = function() {
            return this.text;
        };

        /**
         * Helper function to create an HTML snippet.
         *
         * @param {string} htmlString The string of HTML.
         * @returns {HtmlSnippet} An HTML snippet that can be safely rendered.
         * @constructor
         */
        HTML = function(htmlString) {
            return new HtmlSnippet(htmlString);
        };

        /**
         * Returns HTML that is appropriately escaped.
         *
         * If the input is provided as a string, then an HtmlSnippet
         * is returned with the original text escaped. If the input
         * is already an HtmlSnippet then it is known to be already
         * escaped and so it is just returned directly.
         *
         * @param {(string|HtmlSnippet)} text Some HTML that is
         * either provided as a string or as an HtmlSnippet.
         * @returns {HtmlSnippet} A safely escaped HtmlSnippet.
         */
        escape = function(text) {
            if (text instanceof HtmlSnippet) {
                return text;
            } else {
                return HTML(_.escape(text));
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
         * @returns {HtmlSnippet} The resulting safely escaped HTML snippet.
         */
        interpolateHtml = function(formatString, parameters) {
            var result = StringUtils.interpolate(
                escape(formatString).toString(),
                _.mapObject(parameters, escape)
            );
            return HTML(result);
        };

        /**
         * Returns a function that renders an Underscore template as an HTML snippet.
         *
         * Note: This helper function makes the following context parameters
         * available to the template in addition to those passed in:
         *
         *   * HtmlUtils: the HtmlUtils helper class
         *
         * @param {string} text
         * @param {object} settings
         * @returns {function} A function that returns a rendered HTML snippet.
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
                    return HTML(rawTemplate(augmentedData));
                };
            return template;
        };

        return {
            escape: escape,
            HTML: HTML,
            HtmlSnippet: HtmlSnippet,
            interpolateHtml: interpolateHtml,
            template: template
        };
    });
}).call(this, define || RequireJS.define);
