const { default: merge } = require('webpack-merge');
const base =  require('./base.config.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = merge(base, {
  mode: "production",
  // devtool: 'source-map',
  entry: {
     'client' : path.resolve(__dirname, '../entry/client.entry.js')
  },
  output:{
    clean: true,
    filename: '[name].client.bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve('public/index.html')
    })
  ]
  
})