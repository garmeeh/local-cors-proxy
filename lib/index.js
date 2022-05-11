var express = require('express');
var request = require('request');
var cors = require('cors');
var chalk = require('chalk');
var proxy = express();

var startProxy = function (port, proxyUrl, proxyPartial, credentials, origin) {
  proxy.use(cors({ credentials: credentials, origin: origin }));
  proxy.options('*', cors({ credentials: credentials, origin: origin }));

  // remove trailing slash
  var cleanProxyUrl = proxyUrl.replace(/\/$/, '');
  // remove all forward slashes
  var cleanProxyPartial = proxyPartial.replace(/\//g, '');

  proxy.use('/' + cleanProxyPartial, function (req, res) {
    try {
      console.log(chalk.green('Request Proxied -> ' + req.url + ' ' + req.method));
    } catch (e) { }


    // follow original http method &  follow redirects
    const proxy_req = request({ followOriginalHttpMethod: true, followAllRedirects: true, url: cleanProxyUrl + req.url });
    // cookie is essential and should be piped to proxied api
    proxy_req.headers.cookie = req.headers.cookie;

    proxy_req.on('response', response => {
      // In order to avoid https://github.com/expressjs/cors/issues/134
      const accessControlAllowOriginHeader = response.headers['access-control-allow-origin']
      if (accessControlAllowOriginHeader && accessControlAllowOriginHeader !== origin) {
        console.log(chalk.blue('Override access-control-allow-origin header from proxified URL : ' + chalk.green(accessControlAllowOriginHeader) + '\n'));
        response.headers['access-control-allow-origin'] = origin;
      }
      // allow credential
      response.headers['access-control-allow-credentials'] = true;
    }).pipe(res);

    req.pipe(proxy_req)
  });

  proxy.listen(port);

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
      chalk.bold('http://localhost:' + port + '/' + cleanProxyPartial + '\n')
    )
  );
};

exports.startProxy = startProxy;
