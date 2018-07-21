const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const baseConf = (_path) => {
  // NEW pages should be added here i.g. if you need to create
  // contacts page you need add folder to src,
  // and add path and name to entry array
  const VENDORS_NAME = 'vendors';
  const entry = {
    index: ['babel-polyfill', './src/index/index.js'],
        lesson_6: ['babel-polyfill', './src/lesson_6/lesson_6.js'],
        lesson_7: ['babel-polyfill', './src/lesson_7/lesson_7.js'],
        hw_9: ['babel-polyfill', './src/hw_9/hw_9.js'],
        hw1: ['babel-polyfill', './src/hw1/hw1.js'],
        hw11: ['babel-polyfill', './src/hw11/hw11.js'],
        hw_14: ['babel-polyfill', './src/hw_14/hw_14.js'],
  };

  const plugins = Object.keys(entry).reduce((acc, name) => {
    acc.push(new HtmlWebpackPlugin({
      chunksSortMode: 'manual',
      title: `${name}`,
      template: `./src/${name}/${name}.html`,
      chunks: [VENDORS_NAME, name],
      filename: `./${name}.html`,
    }));
    acc.push(new ExtractTextPlugin({
      filename: `[name].css`,
      allChunks: false
    }));

    return acc;
  }, []);

  plugins.concat([
    new webpack.optimize.CommonsChunkPlugin({
      name: VENDORS_NAME,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      VERSION: JSON.stringify('5fa3b9'),
      BROWSER_SUPPORTS_HTML5: true,
      'typeof window': JSON.stringify('object')
    })
  ]);

  entry.vendors = `./src/common/scripts/${VENDORS_NAME}.js`;

  return {
    entry,
    output: {
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader'
            }
          ]
        },
        {
          test: /\.js/,
          exclude: /(node_modules)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['env']
              }
            }
          ]
        },
        {
          test: /\.css/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'autoprefixer-loader?browsers=last 5 version',]
          })
        },
        {
          test: /\.scss/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'autoprefixer-loader?browsers=last 5 version', 'sass-loader']
          })
        },
        {

          /**
           * ASSET LOADER
           * Reference: https://github.com/webpack/file-loader
           * Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
           * Rename the file using the asset hash
           * Pass along the updated reference to your code
           * You can add here any file extension you want to get copied to your output
           */
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          loader: 'file-loader?name=assets/images/[name].[ext]'
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          loader: 'file-loader?name=assets/fonts/[name].[ext]'
        }
      ]
    },
    plugins
  };
};

module.exports = baseConf;