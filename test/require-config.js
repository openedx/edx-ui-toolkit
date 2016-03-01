/**
 * Require.js config file.  Library and packages used in components.
 */

require.config({
    baseUrl: '/',
    waitSeconds: 60,
    paths: {
        backbone: 'node_modules/backbone/backbone-min',
        'backbone.paginator': 'node_modules/backbone.paginator/lib/backbone.paginator.min',
        jquery: 'node_modules/jquery/dist/jquery.min',
        text: 'node_modules/requirejs-text/text',
        underscore: 'node_modules/underscore/underscore-min',
        sinon: 'node_modules/sinon/lib/sinon',

        // URI and its dependencies
        URI: 'node_modules/urijs/src/URI',
        IPv6: 'node_modules/urijs/src/IPv6',
        punycode: 'node_modules/urijs/src/punycode',
        SecondLevelDomains: 'node_modules/urijs/src/SecondLevelDomains'
    },
    wrapShim: true,
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone',
            init: function(_, $) {
                'use strict';
                Backbone.$ = $;
                return Backbone;
            }
        }
    }
});
