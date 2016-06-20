var gulp = require('gulp'),
    shell = require('gulp-shell');

(function() {
    'use strict';

    gulp.task('lint', shell.task('eslint .'));
}());
