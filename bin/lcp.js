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
  {
    name: 'allowedOrigin',
    type: String,
    defaultValue: '*'
  },
  {
    name: 'includeCredentials',
    type: Boolean,
    defaultValue: false
  }
];

try {
  var options = commandLineArgs(optionDefinitions);
  if (!options.proxyUrl) {
    throw new Error('--proxyUrl is required');
  }
  lcp.startProxy(options.port, options.proxyUrl, options.proxyPartial, options.allowedOrigin, options.includeCredentials);
} catch (error) {
  console.error(error);
}
