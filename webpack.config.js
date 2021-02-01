const webpack = require('webpack');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';
const devMode = !isProd;

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ];
  if (devMode) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

// console.log('process.env', process.env); // https://nodejs.org/api/process.html#process_process_env
console.log('isProd', isProd);
console.log('devMode', devMode);

const filename = (ext) => devMode ? `bundle.${ext}` : `bundle.[hash].${ext}`;

const plugins = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    // don't need to set "src/index", because of mentioned 'context'
    template: 'index.html',
    minify: false,
  }),
  new CopyPlugin({ // to move favicon
    patterns: [
      {from: path.resolve(__dirname, 'src/favicon.ico'),
        to: path.resolve(__dirname, 'dist')},
    ],
  }),
  new MiniCssExtractPlugin({
    filename: filename('css'),
  }),
];
// https://webpack.js.org/plugins/html-webpack-plugin/
// https://webpack.js.org/plugins/copy-webpack-plugin/
// https://www.npmjs.com/package/clean-webpack-plugin - By default, this plugin will remove all files inside webpack's output.path directory, as well as all unused webpack assets after every successful rebuild.
// https://webpack.js.org/plugins/mini-css-extract-plugin/

if (devMode) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

const webpackConfig = {
  context: path.resolve(__dirname, 'src'), // folder for all sources
  mode: 'development',
  entry: './index.js',
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // import '../../../core/Component' -> '@core/Component'
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
  devtool: devMode ? 'source-map': false,
  devServer: {
    port: 1200,
    hot: devMode,
  },
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          // "style-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: jsLoaders(),
      },
    ],
  },
};

module.exports = webpackConfig;
