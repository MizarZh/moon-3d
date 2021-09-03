const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'img',
              name: '[hash:10].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(csv|txt)$/,
        use: ['raw-loader'],
      },
      {
        exclude: /\.(html|js|css|jpg|png|gif|csv|bin)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'media',
              name: '[hash:10].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};
