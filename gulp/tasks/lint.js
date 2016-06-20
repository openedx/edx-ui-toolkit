(function() {
    'use strict';

    var eslint = require('gulp-eslint'),
        gulp = require('gulp'),
        paths = {
            lint: [
                'test/**/!(jquery.simulate)*.js',
                'src/**/*.js',
                'gulp/tasks/*.js',
                'gulpfile.js'
            ]
        };

    gulp.task('lint', function() {
        return gulp.src(paths.lint)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
    });
}());
