/**
 * This is where your tests go.  It should happen automatically when you
 * add files to the karma configuration.
 */
'use strict';

var specs = [],
    config = {},
    file;

// you can automatically get the test files using karma's configs
for (file in window.__karma__.files) {
    if (/spec\.js$/.test(file)) {
        specs.push(file);
    }
}

// This is where karma puts the files
config.baseUrl = '/base';

// Karma lets you list the test files here
config.deps = specs;
config.callback = window.__karma__.start;

require.config(config);
