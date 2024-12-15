# int64-buffer

64bit Long Integer on Buffer/Array/ArrayBuffer in Pure JavaScript

[![npm version](https://badge.fury.io/js/int64-buffer.svg)](https://www.npmjs.com/package/int64-buffer)
[![Node.js CI](https://github.com/kawanet/int64-buffer/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/kawanet/int64-buffer/actions/)
[![Coverage Status](https://coveralls.io/repos/github/kawanet/int64-buffer/badge.svg?branch=master)](https://coveralls.io/github/kawanet/int64-buffer?branch=master)
[![gzip size](https://img.badgesize.io/https://unpkg.com/int64-buffer/dist/int64-buffer.min.js?compression=gzip)](https://unpkg.com/int64-buffer/dist/int64-buffer.min.js)

JavaScript's number type, based on IEEE-754, can only handle [53 bits](https://en.wikipedia.org/wiki/Double-precision_floating-point_format) of precision.
This module provides two pairs of classes: `Int64BE`/`Uint64BE` and `Int64LE`/`Uint64LE`, which can hold 64-bit long integers without losing any bits.

### Features

- `Int64BE`/`Int64LE` for signed integers, `Uint64BE`/`Uint64LE` for unsigned integers.
- `Int64BE`/`Uint64BE` for big-endian, `Int64LE`/`Uint64LE` for little-endian.
- `Buffer`/`Uint8Array`/`Array`/`Array`-like storage of 8 bytes length with offset.
- No mathematical methods provided, such as `add()`, `sub()`, `mul()`, `div()`, etc.
- Optimized only for 64 bits. If you need Int128, use [bignum](https://www.npmjs.com/package/bignum) or similar libraries.
- Small. 3KB when minified. No other modules required. Portable pure JavaScript.
- [Tested](https://github.com/kawanet/int64-buffer/actions/) on node.js v18, v20, v22 and Web browsers.

### Usage

`Int64BE` is the class to host a 64-bit signed long integer `int64_t`.

```js
import {Int64BE} from "int64-buffer";

const big = new Int64BE(-1);

console.log(big - 0); // -1

console.log(big.toBuffer()); // <Buffer ff ff ff ff ff ff ff ff>
```

It uses `Buffer` on Node.js and `Uint8Array` on modern Web browsers.

`Uint64BE` is the class to host a 64-bit unsigned positive long integer `uint64_t`.

```js
import {Uint64BE} from "int64-buffer";

const big = new Uint64BE(Math.pow(2, 63)); // a big number with 64 bits

console.log(big - 0); // 9223372036854776000 = IEEE-754 loses last bits

console.log(big + ""); // "9223372036854775808" = perfectly correct
```

`Int64LE` and `Uint64LE` work the same way as above but with little-endian storage.

### Input Constructor

- new Uint64BE(number)

```js
const big = new Uint64BE(1234567890);
console.log(big - 0); // 1234567890
```

- new Uint64BE(high, low)

```js
const big = new Uint64BE(0x12345678, 0x9abcdef0);
console.log(big.toString(16)); // "123456789abcdef0"
```

- new Uint64BE(string, radix)

```js
const big = new Uint64BE("123456789abcdef0", 16);
console.log(big.toString(16)); // "123456789abcdef0"
```

- new Uint64BE(buffer)

```js
const buffer = Buffer.from([1,2,3,4,5,6,7,8]);
const big = new Uint64BE(buffer);
console.log(big.toString(16)); // "102030405060708"
```

- new Uint64BE(uint8array)

```js
const uint8array = new Uint8Array([1,2,3,4,5,6,7,8]);
const big = new Uint64BE(uint8array);
console.log(big.toString(16)); // "102030405060708"
```

- new Uint64BE(arraybuffer)

```js
const arraybuffer = (new Uint8Array([1,2,3,4,5,6,7,8])).buffer;
const big = new Uint64BE(arraybuffer);
console.log(big.toString(16)); // "102030405060708"
```

- new Uint64BE(array)

```js
const array = [1,2,3,4,5,6,7,8];
const big = new Uint64BE(array);
console.log(big.toString(16)); // "102030405060708"
```

- new Uint64BE(buffer, offset)

```js
const buffer = Buffer.from([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
const big = new Uint64BE(buffer, 8);
console.log(big.toString(16)); // "90a0b0c0d0e0f10"
```

- new Uint64BE(buffer, offset, number)

```js
const buffer = Buffer.from(16);
const big = new Uint64BE(buffer, 8, 0x1234567890);
console.log(big.toString(16)); // "1234567890"
console.log(buffer[15].toString(16)); // "90"
```

- new Uint64BE(buffer, offset, high, low)

```js
const buffer = new Uint8Array(16);
const big = new Uint64BE(buffer, 8, 0x12345678, 0x9abcdef0);
console.log(big.toString(16)); // "123456789abcdef0"
console.log(buffer[15].toString(16)); // "f0"
```

- new Uint64BE(buffer, offset, string, radix)

```js
const buffer = new Array(16);
const big = new Uint64BE(buffer, 8, "123456789abcdef0", 16);
console.log(big.toString(16)); // "123456789abcdef0"
console.log(buffer[15].toString(16)); // "f0"
```

### Output Methods

- valueOf()

```js
const big = new Uint64BE(1234567890);
console.log(big - 0); // 1234567890
```

- toNumber()

```js
const big = new Uint64BE(1234567890);
console.log(big.toNumber()); // 1234567890
```

- toString(radix)

```js
const big = new Uint64BE(0x1234567890);
console.log(big.toString()); // "78187493520"
console.log(big.toString(16)); // "1234567890"
```

- toBuffer()

```js
const big = new Uint64BE([1,2,3,4,5,6,7,8]);
console.log(big.toBuffer()); // <Buffer 01 02 03 04 05 06 07 08>
```

- toArrayBuffer()

```js
const big = new Uint64BE(0);
const buf = new Int8Array(big.toArrayBuffer());
console.log(buf); // Int8Array { '0': 1, '1': 2, '2': 3, '3': 4, '4': 5, '5': 6, '6': 7, '7': 8 }
```

- toArray()

```js
const big = new Uint64BE([1,2,3,4,5,6,7,8]);
console.log(big.toArray()); // [ 1, 2, 3, 4, 5, 6, 7, 8 ]
```

### Browsers Build

- https://cdn.jsdelivr.net/npm/int64-buffer/dist/int64-buffer.min.js

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<script src="https://cdn.jsdelivr.net/npm/int64-buffer/dist/int64-buffer.min.js"></script>
<script>

  const i = new Int64BE("1234567890123456789");
  console.log(i.toString(10)); // "1234567890123456789"
  
  const u = new Uint64BE([0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF]);
  console.log(u.toString(16)); // "123456789abcdef"

</script>
```

### Links

- https://github.com/kawanet/int64-buffer
- https://www.npmjs.com/package/int64-buffer

### The MIT License (MIT)

Copyright (c) 2015-2024 Yusuke Kawasaki

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
