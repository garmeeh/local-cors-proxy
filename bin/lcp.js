#!/usr/bin/env node

var lcp = require('../lib/index.js');
var commandLineArgs = require('command-line-args');

var optionDefinitions = [
  { name: 'port', alias: 'p', type: Number, defaultValue: 8010 },
  {
    name: 'proxyPartial',
    type: String,
    defaultValue: '/proxy'
  },
  { name: 'proxyUrl', type: String },
  { name: 'credentials', type: Boolean, defaultValue: false },
  { name: 'origin', type: String, defaultValue: '*' },
  { name: 'removeRequestOrigin', type: Boolean, defaultValue: false }
];

try {
  var options = commandLineArgs(optionDefinitions);
  if (!options.proxyUrl) {
    throw new Error('--proxyUrl is required');
  }

  const { port, proxyUrl, proxyPartial, credentials, origin, removeRequestOrigin } = options;

  lcp.startProxy(port, proxyUrl, proxyPartial, credentials, origin, removeRequestOrigin);
} catch (error) {
  console.error(error);
}
