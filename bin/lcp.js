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
  { name: 'origin', type: String, defaultValue: '*'},
  { name: 'credentials', type: Boolean, defaultValue: false}
];

try {
  var options = commandLineArgs(optionDefinitions);
  if (!options.proxyUrl) {
    throw new Error('--proxyUrl is required');
  }
  lcp.startProxy(options.port, options.proxyUrl, options.proxyPartial, {
    origin: options.origin,
    credentials: options.credentials
  });
} catch (error) {
  console.error(error);
}
