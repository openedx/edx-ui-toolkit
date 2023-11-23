var baseConfig = require('./karma.conf');

// Karma configuration for debugging
module.exports = function (config) {
    'use strict';

    baseConfig(config, {
        singleRun: false,
        autoWatch: true,
        browsers: ['Chrome'],
        logLevel: baseConfig.LOG_DEBUG,
        preprocessors: [],
        reporters: ['kjhtml']
    });
};
