(function () {
    'use strict';

    var gulp = require('gulp'),
        karma = require('karma').server,
        path = require('path'),
        paths = {
            spec: [
                'test/specs/**/*.js'
            ],
            karamaConf: 'karma.conf.js'
        };

    // kicks up karma to the tests once
    function runKarma(configFile, cb) {
        karma.start({
            configFile: path.resolve(configFile),
            singleRun: true
        }, cb);
    }

    gulp.task('test', function (cb) {
        runKarma(paths.karamaConf, cb);
    });
}());
