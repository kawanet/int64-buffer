# int64-buffer [![npm version](https://badge.fury.io/js/int64-buffer.svg)](http://badge.fury.io/js/int64-buffer) [![Build Status](https://travis-ci.org/kawanet/int64-buffer.svg?branch=master)](https://travis-ci.org/kawanet/int64-buffer)

64bit Long Integer on Buffer/ArrayBuffer in Pure JavaScript

[![Sauce Test Status](https://saucelabs.com/browser-matrix/int64-buffer.svg)](https://saucelabs.com/u/int64-buffer)

JavaScript's number based on IEEE-754 could only handle [53 bits](https://en.wikipedia.org/wiki/Double-precision_floating-point_format) precision. This module provides a couple of classes Int64BE and Uint64BE. Both could keep 64 bit long integer and loose no bits.

### Features

- Int64 for signed 64bit long integer and Uint64 for unsigned.
- Big endian representation in 8 bytes internal buffer.
- Buffer object is used per default on Node.js.
- Int8Array or Array object is used per default on Web browsers.
- No math methods such as add(), sub(), mul(), div() etc.
- Optimized only for 64 bits. If you need Int128, use [bignum](https://www.npmjs.com/package/bignum) etc.
- [Tested](https://travis-ci.org/kawanet/int64-buffer.svg?branch=master) on node.js-v0.10, v0.12, io.js-v3.3 and [Web browsers](https://saucelabs.com/u/int64-buffer)

### Usage

Int64BE constructor accepts a number.

```js
var Int64BE = require("int64-buffer").Int64BE;

var big = new Int64BE(-1);

console.log(big - 0); // -1
```

Uint64BE constructor accepts a positive number.

```js
var Uint64BE = require("int64-buffer").Uint64BE;

var big = new Uint64BE(Math.pow(2, 63));

console.log(big - 0); // 9223372036854776000
```

Both also accept a string representation for bigger number.

```js
var big = Int64BE("1234567890123456789");

console.log(big.toString(10)); // "1234567890123456789"

console.log(big.toJSON()); // "1234567890123456789" as string
```

Both accept an Array or Array-like object with 8 elements as well.

```js
var big = new Uint64BE([0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF]);

console.log(big.toString(16)); // "123456789abcdef"

console.log(big.toBuffer()); // <Buffer 01 23 45 67 89 ab cd ef>

console.log(big.toArrayBuffer().byteLength); // 8

console.log(big.toArray()); // [ 1, 35, 69, 103, 137, 171, 205, 239 ]
```

### Browsers Build

[int64-buffer.min.js](https://rawgithub.com/kawanet/int64-buffer/master/dist/int64-buffer.min.js) supports modern Web browsers as well as legends of IE8. It's only 2KB minified, 1KB gzipped.

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<script src="https://rawgithub.com/kawanet/int64-buffer/master/dist/int64-buffer.min.js"></script>
<script>

  var i = Int64BE("1234567890123456789");
  console.log(i.toString(10)); // "1234567890123456789"
  
  var u = new Uint64BE([0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF]);
  console.log(u.toString(16)); // "123456789abcdef"

</script>
```

### Installation

```sh
npm install int64-buffer --save
```

### The MIT License (MIT)

Copyright (c) 2015 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
