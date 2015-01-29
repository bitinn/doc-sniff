
doc-sniff
=========

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage status][coveralls-image]][coveralls-url]
[![dependency status][david-image]][david-url]

A helper for combating incorrect content-type, aka a mime sniffing module for node.js


# Motivation

So you have made a http request and got back some headers and a response body, but you just don't know if that innocent `Content-Type` header tells you what really goes on in its `body`.

Enter `doc-sniff`, a much simpler implementation of [whatwg mime sniffing](https://mimesniff.spec.whatwg.org/) algorithm. Specifically for those responses that can't be easily distinguished via [file extensions](https://github.com/broofa/node-mime) or [magic numbers](https://github.com/mscdex/mmmagic), eg. HTML, XML documents.


# Install

`npm install doc-sniff --save`


# Usage

```javascript
var docsniff = require('doc-sniff');

var mime1 = docsniff(false, '<html></html>');
console.log(mime1); // text/html

var mime2 = docsniff('text/html', '<?xml version="1.0" encoding="UTF-8" ?><feed></feed>');
console.log(mime2); // application/atom+xml

var mime3 = docsniff('application/xml; charset=UTF-8', '<?xml version="1.0" encoding="UTF-8" ?><feed></feed>');
console.log(mime3); // application/xml
```

Currently this module will correct following mime:

- text/html
- text/xml
- text/plain
- application/xml
- application/rss+xml
- application/atom+xml
- application/rdf+xml
- application/octet-stream

It does not attempt to be overzealous at correcting subtypes; see example 3 above, if original mime is acceptable, it will not be replaced.


# API

## docsniff(type, body);

- `type` is the content-type header in response
- `body` is the response body string
- returns the sniffed content-type as string


# Limits

The [whatwg spec](https://mimesniff.spec.whatwg.org) has a much more thorough algorithm and mime list for browser vendors, but on server-side, we are more interested in parsable documents and information extractions, if you encounter a use case not covered by this algorithm, please let us know on github issues.

Like any simple algorithm, this can easily be spoofed, so don't use it for validation, use it for mime sniffing incoming documents only.

(For better security: [mime](https://github.com/broofa/node-mime) and [mmmagic](https://github.com/mscdex/mmmagic) can handle most filetypes, but you still need XSS protections and content whitelist to safely serve content to users.)


# License

MIT


[npm-image]: https://img.shields.io/npm/v/doc-sniff.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/doc-sniff
[travis-image]: https://img.shields.io/travis/bitinn/doc-sniff.svg?style=flat-square
[travis-url]: https://travis-ci.org/bitinn/doc-sniff
[coveralls-image]: https://img.shields.io/coveralls/bitinn/doc-sniff.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/bitinn/doc-sniff
[david-image]: https://david-dm.org/bitinn/doc-sniff.svg?style=flat-square
[david-url]: https://david-dm.org/bitinn/doc-sniff
