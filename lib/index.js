var express = require('express');
var request = require('request');
var cors = require('cors');
var chalk = require('chalk');

var proxy = express();

var startProxy = function(port, proxyUrl, proxyPartial, credentials, origin, anonymous) {
  proxy.use(cors({credentials: credentials, origin: origin}));
  proxy.options('*', cors({credentials: credentials, origin: origin}));

  // remove trailing slash
  var cleanProxyUrl = proxyUrl.replace(/\/$/, '');
  // remove all forward slashes
  var cleanProxyPartial = proxyPartial.replace(/\//g, '');

  proxy.use('/' + cleanProxyPartial, function(req, res) {
    try {
      console.log(chalk.green('Request Proxied -> ' + req.url));
    } catch (e) {}

    if (anonymous) {
      delete req.headers['forwarded'];
      delete req.headers['via'];
      delete req.headers['x-client-ip'];
      delete req.headers['x-client-ssl'];
      delete req.headers['x-client-verify'];
      delete req.headers['x-forwarded-for'];
      delete req.headers['x-forwarded-host'];
      delete req.headers['x-forwarded-proto'];
      delete req.headers['x-real-ip'];
    }

    req.pipe(
      request(cleanProxyUrl + req.url)
      .on('response', response => {
        // In order to avoid https://github.com/expressjs/cors/issues/134
        const accessControlAllowOriginHeader = response.headers['access-control-allow-origin']
        if(accessControlAllowOriginHeader && accessControlAllowOriginHeader !== origin ){
          console.log(chalk.blue('Override access-control-allow-origin header from proxified URL : ' + chalk.green(accessControlAllowOriginHeader) + '\n'));
          response.headers['access-control-allow-origin'] = origin;
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
  console.log(chalk.blue('Origin: ' + chalk.green(origin)));
  console.log(chalk.blue('Anonymous: ' + chalk.green(anonymous) + '\n'));
  console.log(
    chalk.cyan(
      'To start using the proxy simply replace the proxied part of your url with: ' +
        chalk.bold('http://localhost:' + port + '/' + cleanProxyPartial + '\n')
    )
  );
};

exports.startProxy = startProxy;
