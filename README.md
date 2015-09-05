# Int64/Uint64 - 64bit Long Integer Buffer Pure JavaScript

### Features

- Int64 for signed 64bit long integer and Uint64 for unsigned.
- Big endian representation in 8 bytes internal buffer.
- Buffer object is used per default on Node.js.
- Int8Array or Array object is used per default on Web browsers.
- No math methods such as add(), sub(), mul(), etc.
- No bigger integer such as Int128 supported. This focuses Int64 only.

JavaScript's IEEE-754 format number only handles [53 bits](https://en.wikipedia.org/wiki/Double-precision_floating-point_format) precision. This module keeps 64 bit precision and loose no bits. This module focuses 64 bit integer only. If you need some math methods or more bigger integer such as 128 bits, try [other modules](https://www.npmjs.com/search?q=bignum).

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

They also accept a string representation for bigger number.

```js
var big = Uint64BE("12345678901234567890");

console.log(big.toString(10)); // "12345678901234567890"
console.log(big.toJSON(10)); // "12345678901234567890"
```

The both constructors also accept an Array or Array-like object with 8 elements.

```js
var big = new Uint64BE([0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF]);

console.log(big.toString(16)); // "123456789abcdef"
console.log(big.toBuffer()); // <Buffer 01 23 45 67 89 ab cd ef>
console.log(big.toArrayBuffer().byteLength); // 8
console.log(big.toArray()); // [ 1, 35, 69, 103, 137, 171, 205, 239 ]
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
