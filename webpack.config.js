/* eslint-env node */
'use strict';

var path = require('path'),
    Webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    outputRoot = process.env.OUTPUT_ROOT ? process.env.OUTPUT_ROOT : 'doc/public/',
    siteRoot = process.env.SITE_ROOT !== undefined ? process.env.SITE_ROOT : '/',
    publicStaticRoot = 'public/static/',
    patternLibraryPath = path.resolve(__dirname, './node_modules/edx-pattern-library/pattern-library');

module.exports = {
    entry: [
        path.resolve(__dirname, './doc/static/js/ui-toolkit-doc-factory.js'),
        path.resolve(__dirname, './doc/static/sass/main-ltr.scss')
    ],
    output: {
        path: path.resolve(__dirname, outputRoot),
        publicPath: siteRoot + publicStaticRoot,
        filename: 'ui-toolkit-doc-factory.js'
    },
    modulesDirectories: ['node_modules'],
    resolve: {
        alias: {
            afontgarde: 'edx-pattern-library/js/afontgarde',
            modernizr: 'edx-pattern-library/js/modernizr-custom',
            'edx-pattern-library': patternLibraryPath,
            'edx-ui-toolkit': path.resolve(__dirname, 'src'),
            doc: path.resolve(__dirname, 'doc/static')
        }
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css!sass')
            },
            {
                test: /\.js$/,
                include: __dirname + '/src',
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new Webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new Webpack.IgnorePlugin(/^(config.js)$/),
        new ExtractTextPlugin('ui-toolkit.css')
    ],
    sassLoader: {
        includePaths: [
            path.resolve(__dirname, './node_modules'),
            path.resolve(__dirname, './node_modules/edx-pattern-library/node_modules')
        ],
        data: '$pattern-library-path: \'' + siteRoot + './public/edx-pattern-library\' !default;'
    },
    debug: true,
    devtool: 'inline-source-map'
};
