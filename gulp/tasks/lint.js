(function() {
    'use strict';

    var jshint = require('gulp-jshint'),
        gulp = require('gulp'),
        paths = {
            lint: [
                'test/**/!(jquery.simulate)*.js',
                'components/**/*.js',
                'gulp/tasks/*.js',
                'gulpfile.js'
            ]
        };

    gulp.task('lint', function() {
        return gulp.src(paths.lint)
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .pipe(jshint.reporter('fail'));
    });
}());
