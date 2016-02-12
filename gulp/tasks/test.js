(function() {
    'use strict';

    var gulp = require('gulp'),
        karma = require('karma'),
        path = require('path'),
        configFile;

    gulp.task('test', function(callback) {
        if (process.argv.indexOf('--ci') !== -1) {
            configFile = 'karma.ci.conf.js';
        }
        else {
            configFile = 'karma.conf.js';
        }
        new karma.Server({
            configFile: path.resolve(configFile)
        }, callback).start();
    });
}());
