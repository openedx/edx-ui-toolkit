(function() {
    'use strict';
    var gulp = require('gulp');
    gulp.task('default', ['test', 'lint', 'jscs', 'coverage']);
}());
