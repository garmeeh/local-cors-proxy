var express = require('express');
var request = require('request');
var cors = require('cors');
var chalk = require('chalk');
var proxy = express();
var https = require('https')
var fs = require('fs')

var startProxy = function (port, proxyUrl, proxyPartial, credentials, origin, key, cert, passphrase) {
  proxy.use(cors({credentials: credentials, origin: origin}));
  proxy.options('*', cors({credentials: credentials, origin: origin}));

  // remove trailing slash
  var cleanProxyUrl = proxyUrl.replace(/\/$/, '');
  // remove all forward slashes
  var cleanProxyPartial = proxyPartial.replace(/\//g, '');
  // check if certificate and key are present for secure connection
  var secure = cert && key

  proxy.use('/' + cleanProxyPartial, function (req, res) {
    try {
      console.log(chalk.green('Request Proxied -> ' + req.url));
    } catch (e) {}
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

  if (secure) {
    var keyFile = fs.readFileSync(key);
    var certFile = fs.readFileSync(cert);

    https.createServer({
      key: keyFile,
      cert: certFile,
      passphrase
    }, proxy).listen(port);
  } else {
    proxy.listen(port)
  }

  // Welcome Message
  console.log(chalk.bgGreen.black.bold.underline('\n Proxy Active \n'));
  console.log(chalk.blue('Proxy Url: ' + chalk.green(cleanProxyUrl)));
  console.log(chalk.blue('Proxy Partial: ' + chalk.green(cleanProxyPartial)));
  console.log(chalk.blue('PORT: ' + chalk.green(port)));
  console.log(chalk.blue('Credentials: ' + chalk.green(credentials)));
  console.log(chalk.blue('Origin: ' + chalk.green(origin) + '\n'));
  console.log(
    chalk.cyan(
      'To start using the proxy simply replace the proxied part of your url with: ' +
        chalk.bold(`${secure ? 'https' : 'http'}://localhost:${port}/${cleanProxyPartial}\n`)
    )
  );
};

exports.startProxy = startProxy;
