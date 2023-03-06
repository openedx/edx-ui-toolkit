'use strict';

var gulp = require('gulp'),
    del = require('del'),
    config = require('../config');

gulp.task('clean', function () {
    return del([
        // Remove the Jekyll site
        config.documentation.targetDir,

        // Remove the preview site
        config.documentation.previewTargetDir,

        // Remove the JSDoc generated markdown
        config.documentation.testing.output,
        config.documentation.utilities.output,
        config.documentation.views.output,
    ]);
});

exports.clean = 'clean';
