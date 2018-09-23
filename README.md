NoFlo headless runner [![Build Status](https://travis-ci.org/noflo/noflo-runtime-headless.svg?branch=master)](https://travis-ci.org/noflo/noflo-runtime-headless)
=====================

This utility enables proxying NoFlo [postMessage runtimes](https://github.com/noflo/noflo-runtime-postmessage) running in a [headless browser](https://pptr.dev/) to the FBP protocol WebSocket transport.

The primary use case for this is enabling NoFlo browser components and applications to be tested with [fbp-spec](https://github.com/flowbased/fbp-spec) on the command-line (for example, inside a Continuous Integration system).

## Requirements

You need a browser build of NoFlo and your components that exposes the `noflo-runtime-postmessage` library via `window.require()`. If you're building your libraries with [grunt-noflo-browser](https://github.com/noflo/grunt-noflo-browser), this will already be the case.

For custom builds, the easiest way to do this is by adding something like the following to your WebPack entry file:

```javascript
const postMessageRuntime = require('noflo-runtime-postmessage');

const exported = {
  'noflo-runtime-postmessage': postMessageRuntime,
};

function requireModule(moduleName) {
  if (exported[moduleName]) {
    return exported[moduleName];
  }
  throw new Error(`Module ${moduleName} not available`);
}

if (window) {
  window.require = requireModule;
}
```

## Running

TODO

## Changes

* 0.1.0 (git master)
  - Initial version, proof of concept
