const path = require('path');

module.exports = {
  entry: {
    main: './assets/js/main.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/js/'),
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      // Additional rules
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};
