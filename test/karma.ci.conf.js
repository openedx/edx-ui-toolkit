var baseConfig = require('./karma.conf');

// Karma configuration to run in CI
module.exports = function (config) {
    'use strict';

    baseConfig(config, {
        singleRun: true,
        autoWatch: false,
        customLaunchers: {
            Chrome_github_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox'],
            },
        },
        browsers: ['Chrome_github_ci', 'Firefox', 'PhantomJS'],
        logLevel: config.LOG_INFO,
        preprocessors: {
            'src/js/**/*.js': ['coverage'],
        },
        reporters: ['spec', 'coverage', 'coveralls'],
    });
};
