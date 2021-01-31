const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackConfig = {
    context: path.resolve(__dirname, 'src'), // folder for all sources
    mode: 'development',
    entry: './index.js',
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@core': path.resolve(__dirname, 'src/core') // import '../../../core/Component' -> '@core/Component'
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html' // don't need to set "src/index", because of mentioned 'context'
        }),
        new CopyPlugin({ // to move favicon
            patterns: [
              { from: path.resolve(__dirname, 'src/favicon.ico'), 
              to: path.resolve(__dirname, 'dist') },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: 'bundle.[hash].css'
        })
    ]
    // https://webpack.js.org/plugins/html-webpack-plugin/
    // https://webpack.js.org/plugins/copy-webpack-plugin/
    // https://www.npmjs.com/package/clean-webpack-plugin - By default, this plugin will remove all files inside webpack's output.path directory, as well as all unused webpack assets after every successful rebuild.
    // https://webpack.js.org/plugins/mini-css-extract-plugin/
}

module.exports = webpackConfig;