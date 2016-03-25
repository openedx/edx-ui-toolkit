(function() {
    'use strict';

    var gulp = require('gulp'),
        coveralls = require('gulp-coveralls');

    gulp.task('coverage', function() {
        if (process.argv.indexOf('--ci') !== -1) {
            return gulp.src('coverage/**/lcov.info')
  .             pipe(coveralls());
        } else {
            return gulp.src('coverage/**/lcov.info')
  .             pipe(coveralls());
        }
    });
}());
