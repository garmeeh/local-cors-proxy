# Local CORS Proxy

Simple proxy to bypass CORS issues. This was built as a local dev only solution to enable prototyping against existing APIs without having to worry about CORS.

This module was built to solve the issue of getting this error:

```
No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:3000' is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disable
```

## Getting Started

```
npm install -g local-cors-proxy
```

**Simple Example**

API endpoint that we want to request that has CORS issues:

```
https://www.yourdomain.ie/movies/list
```

Start Proxy:

```
lcp --proxyUrl https://www.yourdomain.ie
```

Then in your client code, new API endpoint:

```
http://localhost:8010/proxy/movies/list
```

End result will be a request to `https://www.yourdomain.ie/movies/list` without the CORS issues!

Alternatively you can install the package locally and add a script to your project:

```json
 "scripts": {
   "proxy": "lcp --proxyUrl https://www.yourdomain.ie"
 }
```

## Options

| Option         | Example               | Default |
| -------------- | --------------------- | ------: |
| --proxyUrl     | https://www.google.ie |         |
| --proxyPartial | foo                   |   proxy |
| --port         | 8010                  |    8010 |
| --credentials  | (no value needed)     |   false |
| --origin       | http://localhost:4200 |       * |
