var express = require("express");
var request = require("request");
var cors = require("cors");
var chalk = require("chalk");
var open = require("open");
var proxy = express();

var startProxy = function (
  port,
  proxyUrl,
  credentials,
  origin,
  webhookStoreUrl,
  shouldNotOpen
) {
  proxy.use(cors({ credentials: credentials, origin: origin }));
  proxy.options("*", cors({ credentials: credentials, origin: origin }));

  // remove trailing slash
  var cleanProxyUrl = proxyUrl.replace(/\/$/, "");
  var cleanProxyPartial = "proxy";

  proxy.use("/" + cleanProxyPartial, function (req, res, next) {
    try {
      console.log(chalk.green("Request Proxied -> " + req.url));

      var originalHeaders = JSON.parse(req.headers["x-ws-original-headers"]);
      Object.keys(originalHeaders).forEach(function (key) {
        req.headers[key] = originalHeaders[key];
      });
    } catch (e) {}
    req
      .pipe(
        request(cleanProxyUrl + req.url)
          .on("response", (response) => {
            console.log(chalk.blue("Response code: " + response.statusCode));
            // In order to avoid https://github.com/expressjs/cors/issues/134
            const accessControlAllowOriginHeader =
              response.headers["access-control-allow-origin"];
            if (
              accessControlAllowOriginHeader &&
              accessControlAllowOriginHeader !== origin
            ) {
              console.log(
                chalk.blue(
                  "Override access-control-allow-origin header from proxified URL : " +
                    chalk.green(accessControlAllowOriginHeader) +
                    "\n"
                )
              );
              response.headers["access-control-allow-origin"] = origin;
            }
          })
          .on("error", next)
      )
      .pipe(res);
  });

  proxy.use("/health", (_req, res) => {
    res.send("ok");
  });

  proxy.listen(port);

  // Welcome Message
  console.log(chalk.bgGreen.black.bold.underline("\n Proxy Active \n"));
  console.log(chalk.blue("Proxy Url: " + chalk.green(cleanProxyUrl)));
  const shouldOpen = !shouldNotOpen;
  if (shouldOpen) {
    console.log(
      chalk.blue("Webhook Store: " + chalk.green(webhookStoreUrl) + "\n")
    );

    console.log(
      chalk.cyan("Now opening the webhook store " + chalk.bold(webhookStoreUrl))
    );
    setTimeout(open, 1000, webhookStoreUrl);
  }
};

exports.startProxy = startProxy;
