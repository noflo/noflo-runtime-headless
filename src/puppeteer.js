const puppeteer = require('puppeteer');
const { EventEmitter } = require('events');
const debug = require('debug');

const debugMessageSend = debug('noflo-runtime-headless:puppeteer:message:send');
const debugMessageReceive = debug('noflo-runtime-headless:puppeteer:message:receive');
const debugOutput = debug('noflo-runtime-headless:puppeteer:log');

class BrowserRuntimeProxy extends EventEmitter {
  constructor(page) {
    super();
    this.page = page;
  }

  send(msg) {
    debugMessageSend(msg);
    return this.page.evaluate((m) => {
      window.headlessRuntime.receive(m.protocol, m.command, m.payload, {});
    }, msg);
  }

  receive(msg) {
    debugMessageReceive(msg);
    this.emit('message', msg);
  }
}

module.exports = async (url) => {
  const browserOptions = {};
  if (process.env.CI) {
    browserOptions.args = ['--no-sandbox'];
  }
  const browser = await puppeteer.launch(browserOptions);
  const page = await browser.newPage();
  page.on('console', msg => debugOutput(msg.text()));
  await page.goto(url, {
    waitUntil: 'networkidle0',
  });
  const proxy = new BrowserRuntimeProxy(page);
  await page.exposeFunction('onRuntimeEvent', (msg) => {
    proxy.receive(JSON.parse(msg));
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
  return proxy;
};
