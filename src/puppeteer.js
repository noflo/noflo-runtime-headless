const puppeteer = require('puppeteer');
const debug = require('debug');

const debugMessageSend = debug('noflo-runtime-headless:puppeteer:message:send');
const debugMessageReceive = debug('noflo-runtime-headless:puppeteer:message:receive');

module.exports = async (url, wsProxy) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto(url, {
    waitUntil: 'networkidle0',
  });
  await page.exposeFunction('onRuntimeEvent', (msg) => {
    debugMessageReceive(msg);
    wsProxy.send(JSON.parse(msg));
  });
  await page.evaluate(() => {
    const runtime = window.require('noflo-runtime-postmessage');
    // eslint-disable-next-line
    window.headlessRuntime = new runtime.postMessage({
      defaultPermissions: [
        'protocol:graph',
        'protocol:component',
        'protocol:network',
        'protocol:runtime',
        'component:getsource',
        'component:setsource',
      ],
    });
    window.headlessRuntime.setClient({
      postMessage: (payload) => {
        window.onRuntimeEvent(payload);
      },
    });
  });
  wsProxy.on('message', async (msg) => {
    debugMessageSend(msg);
    await page.evaluate((m) => {
      window.headlessRuntime.receive(m.protocol, m.command, m.payload, {});
    }, msg);
  });
};
