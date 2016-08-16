'use strict';

const gulp = require('gulp'),
    shell = require('gulp-shell');

gulp.task('build', ['babel', 'templates']);

gulp.task('babel', shell.task('babel src --out-dir dist --ignore *-spec.js'));

gulp.task('templates', () => {
    gulp.src(['./src/**/*.underscore'])
        .pipe(gulp.dest('dist'));
});
