'use strict';

var gulp = require('gulp');

gulp.task('default', [
    'lint',
    'jscs',
    'test',
    'doc-build'
]);
