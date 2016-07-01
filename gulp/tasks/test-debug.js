var gulp = require('gulp'),
    karma = require('karma'),
    path = require('path');

(function() {
    'use strict';

    var configFile = 'test/karma.debug.conf.js';

    gulp.task('test-debug', function(callback) {
        new karma.Server({
            configFile: path.resolve(configFile)
        }, callback).start();
    });
}());
