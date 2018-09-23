const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './webpack.entry.js'),
  output: {
    path: __dirname,
    filename: '../dist/noflo.js',
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
  },
  node: {
    child_process: 'empty',
    fs: 'empty',
  },
};
