var gulp = require('gulp');

(function() {
    'use strict';

    gulp.task('default', [
        'lint',
        'test',
        'doc-build'
    ]);
}());
