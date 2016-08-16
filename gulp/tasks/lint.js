'use strict';

const gulp = require('gulp'),
    shell = require('gulp-shell');

gulp.task('lint', shell.task('eslint .'));
