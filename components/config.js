/**
 * Require.js config file.  Library and packages used in components.
 */

require.config({
    baseUrl: '/',
    waitSeconds: 60,
    paths: {
        backbone: 'bower_components/backbone/backbone',
        jquery: 'bower_components/jquery/dist/jquery',
        text: 'bower_components/text/text',
        underscore: 'bower_components/underscore/underscore'
    },
    wrapShim: true,
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone',
            init: function (_, $) {
                'use strict';
                Backbone.$ = $;
                return Backbone;
            }
        }
    }
});