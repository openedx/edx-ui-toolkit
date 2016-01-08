/**
 * Require.js config file.  Library and packages used in components.
 */

require.config({
    baseUrl: '/',
    waitSeconds: 60,
    paths: {
        backbone: 'bower_components/backbone/backbone',
        'backbone.paginator': 'bower_components/backbone.paginator/lib/backbone.paginator.min',
        jquery: 'bower_components/jquery/dist/jquery',
        text: 'bower_components/text/text',
        underscore: 'bower_components/underscore/underscore',
        sinon: 'bower_components/sinon/lib/sinon',

        // URI and its dependencies
        URI: 'bower_components/urijs/src/URI',
        IPv6: 'bower_components/urijs/src/IPv6',
        punycode: 'bower_components/urijs/src/punycode',
        SecondLevelDomains: 'bower_components/urijs/src/SecondLevelDomains'
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
