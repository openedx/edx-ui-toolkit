'use strict';

var gulp = require('gulp');

gulp.task('default', function(done) {
    gulp.series('lint', 'test', 'doc-build')
    done();
});
