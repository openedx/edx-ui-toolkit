'use strict';

const gulp = require('gulp'),
    karma = require('karma'),
    path = require('path');

gulp.task('test', (callback) => {
    let configFile;

    if (process.argv.includes('--ci')) {
        configFile = 'test/karma.ci.conf.js';
    } else {
        configFile = 'test/karma.conf.js';
    }

    new karma.Server({
        configFile: path.resolve(configFile)
    }, callback).start();
});
