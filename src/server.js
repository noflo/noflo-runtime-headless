const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const koaStatic = require('koa-static');
const entryPoint = require('./entrypoint');

const app = new Koa();
const router = new Router();

module.exports = (root, nofloLib, options) => {
  router.get('/', entryPoint({
    nofloLib,
  }));
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(koaStatic(root, options));
  const httpServer = http.createServer(app.callback());
  return (port) => new Promise((resolve, reject) => {
    httpServer.listen(port, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(httpServer);
    });
  });
};
