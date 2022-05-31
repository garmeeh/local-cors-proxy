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
  { name: 'proxyUrl', type: String, defaultValue: 'http://localhost:9000' },
  { name: 'credentials', type: Boolean, defaultValue: false },
  { name: 'origin', type: String, defaultValue: '*' },
  { name: 'webhookStore', type: String }
];

try {
  var options = commandLineArgs(optionDefinitions);
  if (!options.webhookStore) {
    throw new Error('--webhookStore is required. example --webhookStore https://claimyourdomain.webhook.store');
  }
  lcp.startProxy(options.port, options.proxyUrl, options.proxyPartial, options.credentials, options.origin, options.webhookStore);
} catch (error) {
  console.error(error);
}
