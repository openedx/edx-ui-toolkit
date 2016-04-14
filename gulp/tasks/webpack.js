(function() {
    'use strict';

    var gulp = require('gulp'),
        webpack = require('gulp-webpack'),
        webpackConfig = require('../../webpack.config.js');

    gulp.task('webpack', function() {
       console.log('config: ' + webpackConfig.output.path);
       console.log('config: ' + webpackConfig.output.publicPath);
       console.log('config: ' + webpackConfig.output.filename);
        return gulp.src('')
            .pipe(webpack(webpackConfig))
            .pipe(gulp.dest('doc/public/static/js'));
    });
})();
