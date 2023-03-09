# Local CORS Proxy + Webhook Store

Simple proxy to bypass CORS issues. This was built as a local dev only solution to enable prototyping against existing APIs without having to worry about CORS.

This module was built to solve the issue of getting this error:

```
No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:3000' is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disable
```

## Getting Started

```
npx webhook-store-cli@latest
```

**Simple Example**

Start Proxy and open Webhook Store client in a tab:

```
npx webhook-store-cli@latest
```

Start Proxy and open a specific Webhook Store client:

```
npx webhook-store-cli@latest --webhookStore https://lol.webhook.store/
```

Start Proxy without opening a tab:

```
npx webhook-store-cli@latest --noOpen
```

Start Proxy to target port 9000:

```
npx webhook-store-cli@latest --port 9000
```

Start Proxy to target specific port, hostname and protocol:

```
npx webhook-store-cli@latest --protocol https --hostname dev.localenv --port 9000
```

## Options

| Option         | Example                   |   Default |
| -------------- | ------------------------- | --------: |
| --webhookStore | https://lol.webhook.store |           |
| --noOpen       | (no value needed)         |           |
| --port         | 9000                      |      9000 |
| --protocol     | https                     |      http |
| --hostname     | dev.localenv              | localhost |
