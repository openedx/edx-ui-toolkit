(function() {
    'use strict';

    var gulp = require('gulp'),
        karma = require('karma').server,
        path = require('path'),
        configFile = 'karma.conf.js';

    gulp.task('test', function(callback) {
        karma.start({
            configFile: path.resolve(configFile)
        }, callback);
    });
}());
