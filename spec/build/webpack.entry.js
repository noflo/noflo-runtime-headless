const noflo = require('noflo');
const postMessageRuntime = require('noflo-runtime-postmessage');

const exported = {
  noflo,
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
