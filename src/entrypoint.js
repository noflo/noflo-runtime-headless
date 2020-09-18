const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const templateFile = path.resolve(__dirname, '../templates/entrypoint.html');

module.exports = (options) => async (ctx) => {
  const template = await promisify(fs.readFile)(templateFile, 'utf-8');
  ctx.body = template.replace('__SCRIPT__', options.nofloLib);
};
