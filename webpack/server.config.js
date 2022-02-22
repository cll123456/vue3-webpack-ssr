const { default: merge } = require('webpack-merge');
const base = require('./base.config.js');
const path = require('path');
const nodeExternals = require("webpack-node-externals");
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(base, {
  mode: "production",
  // mode: 'development',
  // optimization: {
  //   usedExports: true,
  // },
  entry: {
    'server': path.resolve(__dirname, '../entry/server.entry.js')
  },
  devtool: 'source-map',
  externals: nodeExternals({
    allowlist: [/\.css$/],
  }),
  output: {
    filename: '[name].server.bundle.js',
    library: {
      type: 'commonjs2'
    }
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [["@babel/plugin-transform-runtime", {
              "corejs": 3
            }]]
          },

        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new WebpackManifestPlugin({ fileName: 'ssr-manifest.json' }),
    // 赋值图标
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, "../public/favicon.ico"), to: path.resolve(__dirname, './../dist') },
      ],
    }),
  ],

})