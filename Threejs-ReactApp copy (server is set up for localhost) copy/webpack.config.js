const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  // Entry point of your application
  entry: "./src/index.js",

  // Output configuration
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },

  // Loaders and rules for file types
  module: {
    rules: [
      {
        test: /\.js$/, // Regular expression for JavaScript files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Use babel-loader for transpiling JavaScript
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"], // Presets for React and modern JavaScript
          },
        },
      },
      {
        test: /\.css$/, // Regular expression for CSS files
        use: [MiniCssExtractPlugin.loader, "css-loader"], // Use css-loader to handle CSS files and MiniCssExtractPlugin to extract CSS into files
      },
      // You can add more rules for other file types (images, fonts, etc.)
    ],
  },

  // Plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Your HTML file to be used as a template
    }),
    new MiniCssExtractPlugin(), // Extracts CSS into separate files
  ],

  // Development server configuration
  devServer: {
    static: "./dist",
    hot: true, // Enables Hot Module Replacement
  },

  // Enable source maps for debugging
  devtool: "source-map",

  // Mode can be 'development' or 'production'
  mode: "development",
}
