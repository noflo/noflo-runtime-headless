const websocket = require('./websocket');
const server = require('./server');
const puppeteer = require('./puppeteer');

const port = 3001;

process.on('SIGTERM', () => {
  process.exit(0);
});

server(process.cwd(), 'spec/dist/noflo.js')(port)
  .then(httpServer => puppeteer(`http://localhost:${port}`)
    .then(pageProxy => websocket(httpServer)
      .then(wsProxy => [pageProxy, wsProxy])))
  .then(([pageProxy, wsProxy]) => {
    wsProxy.on('message', msg => pageProxy.send(msg));
    pageProxy.on('message', msg => wsProxy.send(msg));
    console.log('Running!');
  })
  .catch((err) => {
    console.log(err);
  });
