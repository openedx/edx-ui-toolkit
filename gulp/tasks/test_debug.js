(function() {
    'use strict';

    var gulp = require('gulp'),
        karma = require('karma'),
        path = require('path'),
        configFile = 'karma.debug.conf.js';

    gulp.task('test_debug', function(callback) {
        new karma.Server({
            configFile: path.resolve(configFile)
        }, callback).start();
    });
}());
