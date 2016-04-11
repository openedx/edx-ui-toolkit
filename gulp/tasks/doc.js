(function() {
    'use strict';

    var gulp = require('gulp'),
        childProcess = require('child_process'),
        browserSync = require('browser-sync'),
        runSequence = require('run-sequence'),
        config  = require('../config').documentation,
        generateDoc = require('../utils/generate-doc'),
        rename = require('gulp-rename'),
        webpack = require('gulp-webpack'),
        webpackConfig = require('../../webpack.config.js'),
        renameAsMarkdown,
        generateDocFor;

    renameAsMarkdown = function(path) {
        path.extname = '.md';
        return path;
    };

    generateDocFor = function(options) {
        var i, directory;
        for (i = 0; i < options.sources.length; i++) {
            directory = options.sources[i];
            console.log('Generating documentation for ' + directory);
            gulp.src(directory + '/*.js', {buffer: false})
                .pipe(generateDoc(options.viewClass))
                .pipe(rename(renameAsMarkdown))
                .pipe(gulp.dest(options.output));
        }
    };

    gulp.task('doc', function(callback) {
        runSequence(
            'doc-utils',
            'doc-views',
            'webpack',
            'jekyll-build',
            callback
        );
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
        console.log('config: ' + webpackConfig.output.path);
        console.log('config: ' + webpackConfig.output.publicPath);
        console.log('config: ' + webpackConfig.output.filename);
        return gulp.src('')
            .pipe(webpack(webpackConfig))
            .pipe(gulp.dest('doc/public/static/js'));
    });

    gulp.task('jekyll-build', function(done) {
        return childProcess.spawn('jekyll', ['build'], {stdio: 'inherit'})
            .on('close', done);
    });

    gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
        browserSync.reload();
    });
}());
