'use strict';

var gulp = require('gulp'),
    shell = require('gulp-shell');

gulp.task('babel', shell.task('babel src/* --out-dir dist --ignore *-spec.js'));
