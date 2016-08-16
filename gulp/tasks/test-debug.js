'use strict';

const gulp = require('gulp'),
    karma = require('karma'),
    path = require('path'),
    configFile = 'test/karma.debug.conf.js';

gulp.task('test-debug', (callback) => {
    new karma.Server({
        configFile: path.resolve(configFile)
    }, callback).start();
});
