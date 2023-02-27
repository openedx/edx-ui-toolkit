'use strict';

var gulp = require('gulp');

var lint = require('./lint');
var test = require('./test');
var doc = require('./doc');

exports.default = gulp.series(lint.lint, test.test, doc.docBuild);
