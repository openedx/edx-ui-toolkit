  'use strict';

  const path = require('path');

  module.exports = {
    entry: [path.resolve(__dirname + '/src/components/index.js')],
    output: {
      path: path.resolve(__dirname + '/dist'),
      filename: 'uitk.bundle.js',
      library: 'EdxUitk',
      libraryTarget: 'umd'
    },
    externals: [{
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    },
    {
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    },
    {
      'react-addons-transition-group': {
        commonjs: 'react-addons-transition-group',
        commonjs2: 'react-addons-transition-group',
        amd: 'react-addons-transition-group',
        root: ['React', 'addons', 'TransitionGroup']
      }
    }],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env']
            }
          }
        }
      ]
    }
  };
