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
  { name: 'origin', type: String, defaultValue: '' },
  { name: 'exposedHeaders', type: String, defaultValue: '' }
];

try {
  var options = commandLineArgs(optionDefinitions);
  if (!options.proxyUrl) {
    throw new Error('--proxyUrl is required');
  }
  if (options.exposedHeaders) {
    if (!options.exposedHeaders.startsWith('[') || !options.exposedHeaders.endsWith(']')) {
      throw new Error('--exposedHeaders incorrect format, must be a list of comma seperated strings\nExample: [Content-Disposition,Date] OR [*]');
    }
    options.exposedHeaders = options.exposedHeaders.substring(1, options.exposedHeaders.length - 1).split(',');
  }
  if(options.origin && !options.origin.includes('*')) {
    console.log("gg");
    if (!options.origin.startsWith('[') || !options.origin.endsWith(']')) {
      throw new Error('--origin incorrect format, must be a list of comma seperated strings\nExample: [http://example1.com,http://example2.com]');
    }
    options.origin = options.origin.substring(1, options.origin.length - 1).split(',');
  } else {
    options.origin = '*';
  }
  lcp.startProxy(options.port, options.proxyUrl, options.proxyPartial, options.credentials, options.origin, options.exposedHeaders);
} catch (error) {
  console.error(error);
}
