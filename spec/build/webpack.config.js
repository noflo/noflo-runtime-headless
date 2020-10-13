const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, './webpack.entry.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'noflo.js',
  },
  module: {
    rules: [
      {
        test: /noflo([\\]+|\/)lib([\\]+|\/)loader([\\]+|\/)register.js$/,
        use: [
          {
            loader: 'noflo-component-loader',
            options: {
              graph: null,
              debug: true,
              baseDir: path.resolve(__dirname, '../../'),
              manifest: {
                runtimes: ['noflo'],
                discover: true,
                recursive: false,
              },
              runtimes: [
                'noflo',
                'noflo-browser',
              ],
            },
          },
        ],
      },
      {
        test: /\.coffee$/,
        use: [
          {
            loader: 'coffee-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.coffee', '.js'],
    fallback: {
      assert: false,
      child_process: false,
      constants: false,
      fs: false,
      os: false,
      path: require.resolve('path-browserify'),
      process: require.resolve('process'),
      util: require.resolve('util/'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: ['process'],
    }),
  ],
};
