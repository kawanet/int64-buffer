# 64bit Integer in pure JavaScript

### Features

- Both Singed Int64 and Unsigned Uint64
- Big endian representation in 8 bytes internal buffer
- Buffer object per default on Node.js
- No math functionalities such as add(), sub(), mul(), etc.

### Usage

```js
var Uint64BE = require("int64-buffer").Uint64BE;

var val = new Uint64BE(Math.pow(2, 63));
console.log(val.buffer); // <Buffer 80 00 00 00 00 00 00 00>
console.log(val - 0); // 9223372036854776000
```

```js
var Int64BE = require("int64-buffer").Int64BE;

var val = new Int64BE(-1);
console.log(val.buffer); // <Buffer ff ff ff ff ff ff ff ff>
console.log(val - 0); // -1
```

```js
var val = new Uint64BE([0,0,0,0,0,0,0,1]);
console.log(val - 0); // 1
console.log(val.buffer);
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
