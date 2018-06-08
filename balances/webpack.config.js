'use strict'

const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {

  return {
    entry: ['./src/index'],
    resolve: {
      extensions: ['.js'],
    },
    output: {
      path: path.join(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: {
            loader: 'babel-loader'
          }
        },
      ],
    },
  };
};
