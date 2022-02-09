'use strict';

var gulp = require('gulp');

gulp.task('default', () => gulp.series('lint', 'test', 'doc-build'));
