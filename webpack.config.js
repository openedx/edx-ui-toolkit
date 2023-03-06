var path = require('path'),
    Webpack = require('webpack'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin');

(function () {
    'use strict';

    var outputRoot = process.env.OUTPUT_ROOT ? process.env.OUTPUT_ROOT : 'doc/public/',
        siteRoot = process.env.SITE_ROOT !== undefined ? process.env.SITE_ROOT : '/',
        publicStaticRoot = 'public/static/',
        patternLibraryPath = path.resolve(__dirname, './node_modules/edx-pattern-library/pattern-library');

    module.exports = {
        entry: [
            path.resolve(__dirname, './doc/static/js/ui-toolkit-doc-factory.js'),
            path.resolve(__dirname, './doc/static/sass/main-ltr.scss'),
        ],
        output: {
            path: path.resolve(__dirname, outputRoot),
            publicPath: siteRoot + publicStaticRoot,
            filename: 'ui-toolkit-doc-factory.js',
        },
        resolve: {
            alias: {
                afontgarde: 'edx-pattern-library/js/afontgarde',
                modernizr: 'edx-pattern-library/js/modernizr-custom',
                'edx-pattern-library': patternLibraryPath,
                'edx-ui-toolkit': path.resolve(__dirname, 'src'),
                doc: path.resolve(__dirname, 'doc/static'),
            },
            modules: ['node_modules'],
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    includePaths: [
                                        path.resolve(__dirname, './node_modules'),
                                    ],
                                },
                                additionalData: `$pattern-library-path: '${siteRoot}./public/edx-pattern-library' !default;`,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new Webpack.ProvidePlugin({
                $: 'jquery',
            }),
            new Webpack.IgnorePlugin({ resourceRegExp: /^(config.js)$/ }),
            new Webpack.LoaderOptionsPlugin({
                debug: true,
            }),
            new MiniCssExtractPlugin({
                filename: 'ui-toolkit.css',
            }),
        ],
        devtool: 'inline-source-map',
    };
}());
