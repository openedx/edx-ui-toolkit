var gulp = require('gulp'),
    coveralls = require('gulp-coveralls');

(function() {
    'use strict';

    gulp.task('coverage', function() {
        return gulp.src('coverage/**/lcov.info')
            .pipe(coveralls());
    });
}());
