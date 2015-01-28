
doc-sniff
=========

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

A helper for combating incorrect content-type, aka a mime sniffing module for node.js


# Motivation

So you have made a http request and got back some headers and a response body, but you just don't know if that innocent `Content-Type` header tells you what really goes on in its `body`.

Enter `doc-sniff`, a simple node.js implementation of [whatwg mime sniffing](https://mimesniff.spec.whatwg.org/) algorithm. Specifically for those responses that can't be easily distinguished by [file extensions](https://github.com/broofa/node-mime) or [magic numbers](https://github.com/mscdex/mmmagic), eg. HTML, XML documents.


# Install

`npm install doc-sniff --save`


# Usage

TODO


# API

TODO


# License

MIT


[npm-image]: https://img.shields.io/npm/v/node-fetch.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/node-fetch
[travis-image]: https://img.shields.io/travis/bitinn/node-fetch.svg?style=flat-square
[travis-url]: https://travis-ci.org/bitinn/node-fetch
