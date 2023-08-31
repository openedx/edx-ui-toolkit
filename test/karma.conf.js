// Karma configuration

const puppeteer = require('puppeteer');

process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function (config, overrideOptions) {
    'use strict';

    var options;

    // If not being overridden, then specify the default headless configuration
    if (overrideOptions) {
        options = overrideOptions;
    } else {
        options = {
            singleRun: true,
            autoWatch: false,
            customLaunchers: [],
            browsers: ['ChromeHeadless'],
            logLevel: config.LOG_INFO,
            preprocessors: {
                'src/js/**/*.js': ['coverage'],
            },
            reporters: ['spec', 'coverage'],
        };
    }

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',

        // support the namespace 'edx-ui-toolkit' so that it can be used in the
        // same way as clients expect to see it.
        proxies: {
            '/base/edx-ui-toolkit/': '/base/src/',
        },

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine-jquery', 'jasmine', 'requirejs'],

        // list of files / patterns to load in the browser
        files: [
            // load the Karma spec runner
            'test/spec-runner.js',

            // load the RequireJS configuration
            'test/require-config.js',

            // load third party libraries
            'node_modules/underscore/underscore.js',

            // register third party libraries to be loaded via RequireJS
            { pattern: 'node_modules/backbone/backbone.js', included: false },
            { pattern: 'node_modules/backbone.paginator/lib/backbone.paginator.js', included: false },
            { pattern: 'node_modules/requirejs-text/text.js', included: false },
            { pattern: 'node_modules/sinon/**/*.js', included: false },
            { pattern: 'node_modules/urijs/src/*.js', included: false },
            { pattern: 'node_modules/moment/min/moment-with-locales.min.js', included: false },
            { pattern: 'node_modules/moment-timezone/builds/moment-timezone-with-data.js', included: false },
            { pattern: 'test/jquery.simulate.js', included: false },

            // register all the UI Toolkit source and Underscore templates
            { pattern: 'src/js/**/*.js', included: false },
            { pattern: 'src/js/**/*.underscore', included: false },
        ],

        // plugins required for running the karma tests
        plugins: [
            'karma-jasmine',
            'karma-jasmine-jquery-2',
            'karma-requirejs',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            // 'karma-phantomjs-launcher',
            'karma-coverage',
            'karma-coveralls',
            'karma-sinon',
            'karma-jasmine-html-reporter',
            'karma-spec-reporter',
        ],

        // preprocess each file according to the specified options
        preprocessors: options.preprocessors,

        // reports to use according to the specified options
        reporters: options.reporters,

        coverageReporter: {
            dir: 'build',
            subdir: 'coverage-js',
            reporters: [
                { type: 'html', subdir: 'coverage-js/html' },
                { type: 'cobertura', file: 'coverage.xml' },
                { type: 'lcov', dir: 'coverage/' },
            ],
        },

        // web server port
        // Note: not the default 9876 as that clashes with devstack
        port: 9009,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE, config.LOG_ERROR, config.LOG_WARN, config.LOG_INFO, config.LOG_DEBUG
        logLevel: options.logLevel,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: options.autoWatch,

        // Custom launchers for environments such as GitHub CI
        customLaunchers: options.customLaunchers,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // you can also add Chrome or other browsers too
        browsers: options.browsers,

        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: options.singleRun,
    });
};
