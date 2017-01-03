'use strict';

const gulp = require('gulp'),
    coveralls = require('gulp-coveralls');

gulp.task('coverage', () =>
    gulp.src('coverage/**/lcov.info').pipe(coveralls())
);
