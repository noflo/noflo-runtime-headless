const program = require('commander');
const manifest = require('../package.json');
const websocket = require('./websocket');
const server = require('./server');
const puppeteer = require('./puppeteer');

exports.run = (options) => {
  const opts = options;
  if (!opts.root) {
    opts.root = process.cwd();
  }
  if (!opts.port) {
    opts.port = 3569;
  }
  return server(opts.root, opts.file)(opts.port)
    .then(httpServer => puppeteer(`http://localhost:${opts.port}`)
      .then(pageProxy => websocket(httpServer)
        .then(wsProxy => [pageProxy, wsProxy])))
    .then(([pageProxy, wsProxy]) => {
      wsProxy.on('message', msg => pageProxy.send(msg));
      pageProxy.on('message', msg => wsProxy.send(msg));
      return true;
    });
};

exports.main = () => {
  program
    .version(manifest.version)
    .option('-r, --root <dir>', 'Base dir to expose for the browser')
    .option('-f, --file <file>', 'Path to the browser build of NoFlo inside base dir')
    .option('-p --port <port>', 'Runtime port to expose')
    .parse(process.argv);

  process.on('SIGTERM', () => {
    process.exit(0);
  });

  exports.run(program)
    .then(() => {
      console.log('Running!');
    }, (err) => {
      console.error(err);
      process.exit(1);
    });
};
