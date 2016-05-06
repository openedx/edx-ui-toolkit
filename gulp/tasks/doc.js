/**
 * Gulp tasks for building API documentation for the UI Toolkit.
 *
 * The tasks are as follows:
 *  - doc: builds the API documentation
 *  - doc-serve: serves up the API documentation through browser sync
 */

'use strict';

var gulp = require('gulp'),
    childProcess = require('child_process'),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence'),
    config  = require('../config').documentation,
    generateDoc = require('../utils/generate-doc'),
    rename = require('gulp-rename'),
    webpack = require('webpack-stream'),
    ghPages = require('gulp-gh-pages'),
    renameAsMarkdown,
    generateDocFor;

renameAsMarkdown = function(path) {
    path.extname = '.md';
    return path;
};

generateDocFor = function(options) {
    var i, sources;
    for (i = 0; i < options.sources.length; i++) {
        sources = options.sources[i];
        console.log('Generating documentation for ' + sources);
        gulp.src(sources, {buffer: false})
            .pipe(generateDoc(options.viewClass))
            .pipe(rename(renameAsMarkdown))
            .pipe(gulp.dest(options.output));
    }
};

gulp.task('doc', function(callback) {
    runSequence(
        'doc-build',
        'doc-serve',
        callback
    );
});

gulp.task('doc-build', function(callback) {
    runSequence(
        ['doc-testing', 'doc-utils', 'doc-views'],
        'copy-pattern-library',
        'webpack',
        'jekyll-build',
        callback
    );
});

gulp.task('doc-serve', function() {
    // Run browserSync to serve the doc site
    browserSync(config.browserSync);

    // Watch the UI Toolkit's source code
    gulp.watch(config.testing.sources, ['doc-testing', 'webpack-rebuild']);
    gulp.watch(config.utilities.sources, ['doc-utils', 'webpack-rebuild']);
    gulp.watch(config.views.sources, ['doc-views', 'webpack-rebuild']);

    // Watch the doc site's static assets
    gulp.watch(config.static, ['webpack-rebuild']);

    // Watch the doc site's templates
    gulp.watch(config.templates, ['jekyll-rebuild']);
});

gulp.task('doc-testing', function() {
    generateDocFor(config.testing);
});

gulp.task('doc-utils', function() {
    generateDocFor(config.utilities);
});

gulp.task('doc-views', function() {
    generateDocFor(config.views);
});

gulp.task('copy-pattern-library', function() {
    gulp.src(['./node_modules/edx-pattern-library/pattern-library/**/*'])
        .pipe(gulp.dest('doc/public/edx-pattern-library'));
});

gulp.task('webpack', function() {
    var webpackConfig = require('../../webpack.config.js');
    return gulp.src('')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(webpackConfig.output.path))
        .pipe(browserSync.stream());
});

gulp.task('webpack-rebuild', function(callback) {
    runSequence(
        'webpack',
        'jekyll-rebuild',
        callback
    );
});

gulp.task('jekyll-build', function() {
    childProcess.execSync('jekyll build');
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
    browserSync.reload();
});

gulp.task('doc-publish', ['doc-build'], function() {
    return gulp.src(config.gitHubPages.files)
        .pipe(ghPages());
});
