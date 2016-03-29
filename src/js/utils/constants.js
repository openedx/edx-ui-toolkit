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
    // Pick a define function as follows:
    // 1. Use the default 'define' function if it is available
    // 2. If not, use 'RequireJS.define' if that is available
    // 3. else use the GlobalLoader to install the class into the edx namespace
    typeof define === 'function' && define.amd ? define :
        (typeof RequireJS !== 'undefined' ? RequireJS.define :
            edx.GlobalLoader.defineAs('constants', 'edx-ui-toolkit/js/utils/constants'))
);
