// Karma configuration

module.exports = function (config, options) {
    'use strict';

    // If not being overridden, then specify the default headless configuration
    if (!options) {
        options = {
            singleRun: true,
            autoWatch: false,
            browsers: ['PhantomJS'],
            logLevel: config.LOG_INFO,
            preprocessors: {
                'components/**/*.js': ['coverage']
            },
            reporters: ['spec', 'coverage']
        };
    }

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine-jquery', 'jasmine', 'requirejs', 'sinon'],


        // list of files / patterns to load in the browser
        files: [
            {pattern: 'bower_components/**/*.js', included: false},
            {pattern: 'bower_components/**/*.json', included: false},
            {pattern: 'components/utils/*.js', included: false},
            {pattern: 'components/**/views/*.js', included: false},
            {pattern: 'components/**/templates/*.underscore', included: false},
            {pattern: 'test/specs/**/*.js', included: false},
            {pattern: 'components/config.js', included: true},
            {pattern: 'test/spec-runner.js', included: true}
        ],


        // plugins required for running the karma tests
        plugins:[
            'karma-jasmine',
            'karma-jasmine-jquery',
            'karma-requirejs',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-coverage',
            'karma-sinon',
            'karma-spec-reporter'
        ],

        // preprocess each file according to the specified options
        preprocessors: options.preprocessors,

        // reports to use according to the specified options
        reporters: options.reporters,

        coverageReporter: {
            dir:'build', subdir: 'coverage-js',
            reporters:[
                {type: 'html', subdir: 'coverage-js/html'},
                {type: 'cobertura', file: 'coverage.xml'},
                {type: 'text-summary'}
            ]
        },

        // web server port
        // Note: not the default 9876 as that clashes with devstack
        port: 9009,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: options.logLevel,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: options.autoWatch,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // you can also add Chrome or other browsers too
        browsers: options.browsers,

        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: options.singleRun
    });
};
