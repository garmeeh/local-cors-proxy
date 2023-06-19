var express = require('express');
var request = require('request');
var cors = require('cors');
var chalk = require('chalk');
var proxy = express();
const crypto = require('crypto');

var startProxy = function(port, proxyUrl, proxyPartial, credentials, whitelist, exposedHeaders) {
  var corsOption = {credentials: credentials, origin: whitelist, exposedHeaders: exposedHeaders};
  if(Array.isArray(whitelist)) {
    corsOption = {
      credentials: credentials,
      origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      exposedHeaders: exposedHeaders
    }
  }
  proxy.use(cors(corsOption));
  proxy.options('*', cors(corsOption));

  // remove trailing slash
  var cleanProxyUrl = proxyUrl.replace(/\/$/, '');
  // remove all forward slashes
  var cleanProxyPartial = proxyPartial.replace(/\//g, '');

  proxy.use('/' + cleanProxyPartial, function(req, res) {
    try {
      console.log(chalk.green('Request Proxied -> ' + req.url));
    } catch (e) {}
    req.pipe(
      request(cleanProxyUrl + req.url, {
        agentOptions: {
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
        }
      })
      .on('response', response => {
        // In order to avoid https://github.com/expressjs/cors/issues/134
        const accessControlAllowOriginHeader = response.headers['access-control-allow-origin']
        if(accessControlAllowOriginHeader && accessControlAllowOriginHeader !== whitelist ){
          console.log(chalk.blue('Override access-control-allow-origin header from proxified URL : ' + chalk.green(accessControlAllowOriginHeader) + '\n'));
          response.headers['access-control-allow-origin'] = whitelist;
        }
      })
    ).pipe(res);
  });

  proxy.listen(port);

  // Welcome Message
  console.log(chalk.bgGreen.black.bold.underline('\n Proxy Active \n'));
  console.log(chalk.blue('Proxy Url: ' + chalk.green(cleanProxyUrl)));
  console.log(chalk.blue('Proxy Partial: ' + chalk.green(cleanProxyPartial)));
  console.log(chalk.blue('PORT: ' + chalk.green(port)));
  console.log(chalk.blue('Credentials: ' + chalk.green(credentials)));
  console.log(chalk.blue('Origin: ' + chalk.green(whitelist)));
  if(exposedHeaders) {
    console.log(chalk.blue('Exposed Headers: ' + chalk.green(exposedHeaders)));
  }
  console.log(
    chalk.cyan(
      '\nTo start using the proxy simply replace the proxied part of your url with: ' +
        chalk.bold('http://localhost:' + port + '/' + cleanProxyPartial + '\n')
    )
  );
};

exports.startProxy = startProxy;
