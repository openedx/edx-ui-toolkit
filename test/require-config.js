/**
 * Require.js config file.  Library and packages used in components.
 */

require.config({
    baseUrl: '/base',
    waitSeconds: 60,
    paths: {
        backbone: 'node_modules/backbone/backbone',
        'backbone.paginator': 'node_modules/backbone.paginator/lib/backbone.paginator',
        jquery: 'node_modules/jquery/dist/jquery',
        'jquery.simulate': 'test/jquery.simulate',
        text: 'node_modules/requirejs-text/text',
        underscore: 'node_modules/underscore/underscore',
        sinon: 'node_modules/sinon/lib/sinon',
        moment: 'node_modules/moment/min/moment-with-locales.min',
        'moment-timezone': 'node_modules/moment-timezone/builds/moment-timezone-with-data',

        // URI and its dependencies
        URI: 'node_modules/urijs/src/URI',
        IPv6: 'node_modules/urijs/src/IPv6',
        punycode: 'node_modules/urijs/src/punycode',
        SecondLevelDomains: 'node_modules/urijs/src/SecondLevelDomains'
    },
    wrapShim: true,
    shim: {
        jquery: {
            exports: '$'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone',
            init: function (_, $) {
                'use strict';

                var Backbone;
                Backbone.$ = $;
                return Backbone;
            }
        },
        'jquery.simulate': {
            deps: ['jquery'],
            exports: ['$.simulate']
        },
        underscore: {
            exports: '_'
        },
        'edx-ui-toolkit/js/utils/global-loader': {
            exports: 'edx.GlobalLoader'
        }
    }
});
