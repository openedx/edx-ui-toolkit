'use strict';

var gulp = require('gulp'),
    coveralls = require('gulp-coveralls');

gulp.task('coverage', function () {
    return gulp.src('coverage/**/lcov.info')
        .pipe(coveralls());
});
