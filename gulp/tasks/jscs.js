(function() {
    'use strict';

    var jscs = require('gulp-jscs'),
        gulp = require('gulp'),
        paths = {
            lint: [
                'test/**/!(jquery.simulate)*.js',
                'components/**/*.js',
                'gulp/tasks/*.js',
                'gulpfile.js'
            ]
        };

    gulp.task('jscs', function() {
        return gulp.src(paths.lint)
            .pipe(jscs())
            .pipe(jscs.reporter());
    });
}());
