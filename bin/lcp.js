#!/usr/bin/env node

var lcp = require("../lib/index.js");
var commandLineArgs = require("command-line-args");
var chalk = require("chalk");

var optionDefinitions = [
  { name: "proxyPort", alias: "p", type: Number, defaultValue: 8010 },
  {
    name: "proxyPartial",
    type: String,
    defaultValue: "/proxy",
  },
  { name: "port", type: String, defaultValue: "9000" },
  { name: "credentials", type: Boolean, defaultValue: false },
  { name: "origin", type: String, defaultValue: "*" },
  { name: "webhookStore", type: String },
  {
    name: "help",
    type: Boolean,
    alias: "h",
    description: "print out helpful usage information",
  },
];

try {
  var options = commandLineArgs(optionDefinitions);
  if (options.help) {
    console.warn(chalk.yellow.bold("Options"));
    console.warn(
      chalk.yellow(
        "webhookStore: " +
          chalk.green(
            "Url of you webhook store. Example: --webhookStore https://coucou.webhook.store"
          )
      )
    );
    console.warn(
      chalk.yellow(
        "port: " +
          chalk.green(
            "The port you want forward the webhooks. Example: --port 9001"
          )
      )
    );
  } else {
    if (!options.webhookStore) {
      throw new Error(
        "--webhookStore is required. example --webhookStore https://claimyourdomain.webhook.store"
      );
    }
    if (!options.port) {
      console.log(
        chalk.yellow("--port option was not provided, using 9000 by default.")
      );
    }
    lcp.startProxy(
      options.proxyPort,
      "http://localhost:" + options.port,
      options.proxyPartial,
      options.credentials,
      options.origin,
      options.webhookStore
    );
  }
} catch (error) {
  console.error(chalk.red(error));
}
