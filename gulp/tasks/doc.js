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
    runSequence = require('gulp4-run-sequence'),
    config = require('../config').documentation,
    generateDoc = require('../utils/generate-doc'),
    rename = require('gulp-rename'),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
    ghPages = require('gulp-gh-pages'),
    webpackConfig = require('../../webpack.config.js'),
    clean = require('./clean'),
    renameAsMarkdown,
    generateDocFor;

renameAsMarkdown = function(path) {
    var renamedPath = path;
    renamedPath.extname = '.md';
    return renamedPath;
};

generateDocFor = function(options) {
    var i, sources,
        sourceLength = options.sources.length;
    for (i = 0; i < sourceLength; i += 1) {
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

gulp.task('doc-serve', function(callback) {
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
    callback();
});

gulp.task('doc-testing', function(callback) {
    generateDocFor(config.testing);
    callback();
});

gulp.task('doc-utils', function(callback) {
    generateDocFor(config.utilities);
    callback();
});

gulp.task('doc-views', function(callback) {
    generateDocFor(config.views);
    callback();
});

gulp.task('copy-pattern-library', function(callback) {
    gulp.src(['./node_modules/edx-pattern-library/pattern-library/**/*'])
        .pipe(gulp.dest('doc/public/edx-pattern-library'));
    callback();
});

gulp.task('webpack', function() {
    return gulp.src('.', {allowEmpty: true})
        .pipe(webpackStream(webpackConfig, webpack))
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

gulp.task('jekyll-build', function(callback) {
    childProcess.execSync('jekyll build');
    callback();
});

gulp.task('jekyll-rebuild', gulp.series('jekyll-build', function(callback) {
    browserSync.reload();
    callback();
}));

gulp.task('doc-publish', gulp.series(clean.clean, 'doc-build', function() {
    return gulp.src(config.gitHubPages.files)
        .pipe(ghPages());
}));

exports.docBuild = gulp.series(
    gulp.parallel('doc-testing', 'doc-utils', 'doc-views'),
    'copy-pattern-library',
    'webpack',
    'jekyll-build'
);
