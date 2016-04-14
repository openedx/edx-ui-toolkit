(function() {
    'use strict';

    var path = require('path'),
        webpack = require('webpack'),
        outputRoot = process.env.OUTPUT_ROOT ? process.env.OUTPUT_ROOT : 'doc/',
        siteRoot = process.env.SITE_ROOT !== undefined ? process.env.SITE_ROOT : '/',
        publicJavaScriptRoot = 'public/static/js/',
        patternLibraryPath = path.resolve(__dirname, './node_modules/edx-pattern-library/pattern-library');

    module.exports = {
        entry: path.resolve(__dirname, 'doc/static/js/ui-toolkit-doc-factory.js'),
        output: {
            path: path.resolve(__dirname, outputRoot),
            publicPath: siteRoot + publicJavaScriptRoot,
            filename: 'ui-toolkit-doc-factory.js'
        },
        modulesDirectories: ['node_modules'],
        resolve: {
            alias: {
                afontgarde: 'edx-pattern-library/js/afontgarde',
                modernizr: 'edx-pattern-library/js/modernizr-custom',
                'edx-pattern-library': patternLibraryPath,
                'edx-ui-toolkit': path.resolve(__dirname, 'src')
            }
        },
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loaders: ['style', 'css', 'sass']
                }
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery'
            }),
            new webpack.IgnorePlugin(/^(config.js)$/)
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
})();
