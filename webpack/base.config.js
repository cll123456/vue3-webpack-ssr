const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
module.exports = {
  // 输出
  output: {
    path: path.resolve(__dirname, './../dist'), 
    filename: '[name].bundle.js',
  },
  //  loader
  module: {
    rules: [
      { test: /\.vue$/, use: 'vue-loader' },
      {
        test: /\.css$/, use: [
           'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
           "vue-style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
         
        },
        exclude: /node_modules/
      }
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
  ]
}