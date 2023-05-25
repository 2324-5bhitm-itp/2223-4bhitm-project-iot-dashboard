const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = env => ({
  entry: './src/index.ts',
  mode: "development",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  devtool: "cheap-source-map",
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      "fs": false,
      "url": false,
      "os": false,
      "path": false,
      "utf-8-validate": false
    }     
  },
  output: {
    filename: 'bundle-[fullhash].js',
    path: path.resolve(__dirname, './dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html"
    })
    ],
    devServer: {
        static: {
          directory: path.join(__dirname, '/'),
        },
        compress: true,
        port: 4200,
        proxy: {
          '/api': 'http://localhost:8080',
        }
    },    
})