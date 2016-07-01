// The Karma plugin we're using installs itself on window.__karma__, so disable the dangling underscore ESLint rule
/* eslint-disable no-underscore-dangle */

/**
 * This is where your tests go.  It should happen automatically when you
 * add files to the karma configuration.
 */
(function() {
    'use strict';

    var specs = [],
        config = {};

    // you can automatically get the test files using karma's configs
    Object.keys(window.__karma__.files).forEach(function(file) {
        if (/spec\.js$/.test(file)) {
            specs.push(file);
        }
    });

    // This is where karma puts the files
    config.baseUrl = '/base';

    // Karma lets you list the test files here
    config.deps = specs;
    config.callback = window.__karma__.start;

    require.config(config);
}());
