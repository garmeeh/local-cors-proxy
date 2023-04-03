#!/usr/bin/env node

var lcp = require("../lib/index.js");
var commandLineArgs = require("command-line-args");
var chalk = require("chalk");
const prompt = require("prompt-sync")();

var optionDefinitions = [
  { name: "proxyPort", alias: "p", type: Number, defaultValue: 8010 },
  { name: "protocol", type: String, defaultValue: "http" },
  { name: "hostname", type: String, defaultValue: "localhost" },
  { name: "port", type: String },
  { name: "credentials", type: Boolean, defaultValue: false },
  { name: "origin", type: String, defaultValue: "*" },
  { name: "webhookStore", type: String },
  { name: "noOpen", type: Boolean, default: false },
  {
    name: "help",
    type: Boolean,
    alias: "h",
    description: "print out helpful usage information",
  },
];

function getDefaultSubdomain() {
  const defaultSubdomain = "hackator10";
  try {
    const username = require("os").userInfo().username;
    return username.replace(/[^a-zA-Z0-9]/g, "") || defaultSubdomain;
  } catch {
    return defaultSubdomain;
  }
}

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
    if (!options.webhookStore && !options.noOpen) {
      console.log(chalk.yellow("--webhookStore was not provided."));
      const defaultSubdomain = getDefaultSubdomain();
      const subdomainInput =
        prompt(
          `Claim your subdomain (your name or company name. e.g. ${defaultSubdomain}): `
        ) || defaultSubdomain;
      const subdomain =
        subdomainInput.replace(/[^a-zA-Z0-9]/g, "") || defaultSubdomain;
      options.webhookStore = `https://${subdomain}.webhook.store`;
      console.log(
        chalk.yellow(
          `Next time run with '--webhookStore ${options.webhookStore}'`
        )
      );
    }
    if (!options.port) {
      console.log(chalk.yellow("--port option was not provided"));
      const portInput =
        prompt(
          `Which port would you like to redirect webhooks on (default :9000): `
        ) || 9000;
      options.port = isNaN(portInput) ? 9000 : portInput;
    }
    lcp.startProxy(
      options.proxyPort,
      options.protocol + "://" + options.hostname + ":" + options.port,
      options.credentials,
      options.origin,
      options.webhookStore,
      options.noOpen
    );
  }
} catch (error) {
  console.error(chalk.red(error));
}
