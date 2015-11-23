(function() {
    'use strict';

    var gulp = require('gulp'),
        karma = require('karma').server,
        path = require('path'),
        configFile = 'karma.debug.conf.js';

    gulp.task('test_debug', function(callback) {
        karma.start({
            configFile: path.resolve(configFile)
        }, callback);
    });
}());
