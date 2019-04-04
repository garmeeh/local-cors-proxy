#!/usr/bin/env node

require('dotenv').config()

var commandLineArgs = require('command-line-args');
var lcp = require('../lib/index.js');

var optionDefinitions = [
  {
    name: 'port',
    alias: 'p',
    type: Number,
    defaultValue: process.env.LCP_PORT,
  },
  {
    name: 'proxyPartial',
    type: String,
    defaultValue: process.env.LCP_PROXY_PARTIAL,
  },
  {
    name: 'proxyUrl',
    type: String,
    defaultValue: process.env.LCP_PROXY_URL,
  }
];

try {
  var options = commandLineArgs(optionDefinitions);
  if (!options.proxyUrl) {
    throw new Error('--proxyUrl is required');
  }
  lcp.startProxy(options.port, options.proxyUrl, options.proxyPartial);
} catch (error) {
  console.error(error);
  process.exit(1);
}
