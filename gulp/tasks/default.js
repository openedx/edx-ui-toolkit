'use strict';

var gulp = require('gulp'),
    lint = require('./lint'),
    test = require('./test'),
    doc = require('./doc');

exports.default = gulp.series(
    lint.lint,
    test.test,
    doc.docBuild,
);
