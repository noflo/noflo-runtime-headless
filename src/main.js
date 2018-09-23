const websocket = require('./websocket');
const server = require('./server');
const puppeteer = require('./puppeteer');

const port = 3001;

process.on('SIGTERM', () => {
  process.exit(0);
});

server(process.cwd(), 'spec/dist/noflo.js')(port)
  .then(httpServer => websocket(httpServer))
  .then(wsProxy => puppeteer(`http://localhost:${port}`, wsProxy))
  .then(() => {
    console.log('Running!');
  })
  .catch((err) => {
    console.log(err);
  });
