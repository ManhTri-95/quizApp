const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const generateHtmlPlugins = require('./helpers/generateHtmlPlugins');

/**
 * Gets the root directory of the project.
 * @type {string}
 */
const projectRootDir = process.cwd();
/**
 * Current project version from package.json
 * @type {string}
 */
const version = require('../package.json').version;
/**
 * Custom title for the site
 * @type {string}
 */
const title = 'Create HTML Boilerplate';
/**
 * Directory with templates
 * @type {string}
 */
const templatesPath = path.join(projectRootDir, 'source', 'html', 'views');
/**
 * Basic config for the site
 * templatesPath - path for HTML templates (required)
 * options - any data that is needed in the template (optional parameter)
 * @type {{templatesPath: string, options: {[key]: string | number | any }}}
 */
const config = {
  templatesPath,
  options: {
    version,
    title,
  },
};
/**
 * Determines in which mode the assembly works - development or production.
 * @type {boolean}
 */
const isProd = process.argv.mode === 'production';
const htmlPlugins = generateHtmlPlugins(config);

module.exports = {
  resolve: {
    alias: {
      source: path.join('..', 'source'),
    },
  },
  mode: isProd ? 'production' : 'development',
  entry: {
    bundle: './source/js/index.js',
    libs: ['picturefill'],
    style: './source/scss/style.scss',
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 9001,
    hot: true,
    compress: true,
    watchFiles: ['source/**'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
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
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer']],
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, '../source/html/includes'),
        use: ['raw-loader'],
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new SpriteLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        /* Copy fonts */
        {
          from: 'source/fonts',
          to: './fonts',
        },
        /* Copy images */
        {
          from: 'source/img',
          to: './img',
        },
        /* Copying external libraries */
        {
          from: 'source/vendors',
          to: './vendors',
        },
        /* We copy the files that we need in the root of the project */
        {
          from: 'source/root',
          to: './',
        },
      ],
    }),
    new ImageminPlugin({
      test: 'source/img/**',
      optimizationLevel: 3,
      progressive: true,
    }),
    new ImageminWebpWebpackPlugin({
      config: [
        {
          test: /\.(jpe?g|png)/,
          options: {
            quality: 85,
          },
        },
      ],
      overrideExtension: true,
      detailedLogs: false,
      silent: false,
      strict: true,
    }),
  ].concat(htmlPlugins),
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../build'),
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
    },
    minimizer: isProd
      ? [
          new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: false,
          }),
        ]
      : [],
  },
};
