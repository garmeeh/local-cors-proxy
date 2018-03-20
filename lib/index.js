var express = require('express');
var request = require('request');
var cors = require('cors');
var proxy = express();

var startProxy = function(port, proxyUrl, proxyPartial) {
  proxy.use(cors());
  proxy.options('*', cors());
  // remove all forward slashes
  var cleanProxyPartial = proxyPartial.replace(/\//g, '');
  proxy.use('/' + cleanProxyPartial, function(req, res) {
    // remove trailing slash
    var cleanProxyUrl = proxyUrl.replace(/\/$/, '');
    req.pipe(request(proxyUrl + req.url)).pipe(res);
  });
  proxy.listen(port);
  console.log('Proxy Active');
};

exports.startProxy = startProxy;
