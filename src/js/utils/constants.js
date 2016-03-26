/**
 * Reusable constants
 */
;(function(define) {
    'use strict';
    define([], function() {
        return {
            keyCodes: {
                tab: 9,
                enter: 13,
                esc: 27,
                space: 32,
                left: 37,
                up: 38,
                right: 39,
                down: 40
            }
        };
    });
}).call(
    this,
    (typeof define !== 'undefined' && define) ||
    (typeof RequireJS !== 'undefined' && RequireJS.define) ||
    edx.GlobalLoader.defineAs('constants', 'edx-ui-toolkit/js/utils/constants')
);
