// test.js

assert.equal = equal;
assert.ok = assert;

var exported = ("undefined" !== typeof require) ? require("../int64-buffer") : window;
var Uint64BE = exported.Uint64BE;
var Int64BE = exported.Int64BE;
var reduce = Array.prototype.reduce;
var forEach = Array.prototype.forEach;
var BUFFER = ("undefined" !== typeof Buffer) && Buffer;
var ARRAYBUFFER = ("undefined" !== typeof ArrayBuffer) && ArrayBuffer;

var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
var POS1 = [0, 0, 0, 0, 0, 0, 0, 1];
var NEG1 = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];

var itBuffer = BUFFER ? it : it.skip;
var itArrayBuffer = ARRAYBUFFER ? it : it.skip;

describe("Uint64BE", function() {
  it("Uint64BE().toString()", function() {
    var val = Uint64BE(1).toString();
    assert.ok("string" === typeof val);
    assert.equal(val, "1");
  });

  it("Uint64BE().toString(10)", function() {
    var max = Math.pow(2, 53);
    var col = 1;
    var val = 1;
    var str = "1";
    while (val < max) {
      assert.equal(Uint64BE(val).toString(10), str);
      col = (col + 1) % 10;
      val = val * 10 + col;
      str += col;
    }
  });

  it("Uint64BE().toString(16)", function() {
    var max = Math.pow(2, 53);
    var val = 1;
    var col = 1;
    var str = "1";
    while (val < max) {
      assert.equal(Uint64BE(val).toString(16), str);
      col = (col + 1) % 10;
      val = val * 16 + col;
      str += col;
    }
  });

  it("Uint64BE().toArray()", function() {
    var val = Uint64BE(1).toArray();
    assert.ok(val instanceof Array);
    assert.equal(toHex(val), toHex(POS1));
  });

  itBuffer("Uint64BE().toBuffer()", function() {
    var val = Uint64BE(1).toBuffer();
    assert.ok(BUFFER.isBuffer(val));
    assert.equal(toHex(val), toHex(POS1));
  });

  itArrayBuffer("Uint64BE().toArrayBuffer()", function() {
    var val = Uint64BE(1).toArrayBuffer();
    assert.ok(val instanceof ArrayBuffer);
    assert.equal(toHex(new Uint8Array(val)), toHex(POS1));
  });
});

describe("Int64BE", function() {
  it("Int64BE().toString()", function() {
    var val = Int64BE(-1).toString();
    assert.ok("string" === typeof val);
    assert.equal(val, "-1");
  });

  it("Int64BE().toString(10)", function() {
    var max = -Math.pow(2, 53);
    var col = 1;
    var val = -1;
    var str = "-1";
    while (val > max) {
      assert.equal(Int64BE(val).toString(10), str);
      col = (col + 1) % 10;
      val = val * 10 - col;
      str += col;
    }
  });

  it("Int64BE().toString(16)", function() {
    var max = -Math.pow(2, 53);
    var col = 1;
    var val = -1;
    var str = "-1";
    while (val > max) {
      assert.equal(Int64BE(val).toString(16), str);
      col = (col + 1) % 10;
      val = val * 16 - col;
      str += col;
    }
  });

  it("Int64BE().toArray()", function() {
    var val = Int64BE(-1).toArray();
    assert.ok(val instanceof Array);
    assert.equal(toHex(val), toHex(NEG1));
  });

  itBuffer("Int64BE().toBuffer()", function() {
    var val = Int64BE(-1).toBuffer();
    assert.ok(BUFFER.isBuffer(val));
    assert.equal(toHex(val), toHex(NEG1));
  });

  itArrayBuffer("Int64BE().toArrayBuffer()", function() {
    var val = Int64BE(-1).toArrayBuffer();
    assert.ok(val instanceof ArrayBuffer);
    assert.equal(toHex(new Uint8Array(val)), toHex(NEG1));
  });
});

describe("Uint64BE(array)", function() {
  forEach.call([
    [0x0000000000000000, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0x0000000000000001, 0, 0, 0, 0, 0, 0, 0, 1], // 1
    [0x4000000000000000, 0x40, 0, 0, 0, 0, 0, 0, 0],
    [0x8000000000000000, 0x80, 0, 0, 0, 0, 0, 0, 0]
  ], function(exp) {
    var val = exp.shift();
    it(toHex(exp), function() {
      var c = new Uint64BE(exp);
      assert.equal(toHex(c.buffer), toHex(exp));
      assert.equal(c - 0, val);
      assert.equal(c.toString(16), val.toString(16));
    });
  });
});

describe("Int64BE(array)", function() {
  forEach.call([
    [0x0000000000000000, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0x0000000000000001, 0, 0, 0, 0, 0, 0, 0, 1], // 1
    [0x4000000000000000, 0x40, 0, 0, 0, 0, 0, 0, 0],
    [-1, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
  ], function(exp) {
    var val = exp.shift();
    it(toHex(exp), function() {
      var c = new Int64BE(exp);
      assert.equal(toHex(c.buffer), toHex(exp));
      assert.equal(c - 0, val);
      assert.equal(c.toString(16), val.toString(16));
    });
  });
});

describe("Uint64BE(high1)", function() {
  reduce.call([
    [0, 0, 0, 0, 0, 0, 0, 1], // 1
    [0, 0, 0, 0, 0, 0, 1, 0], // 256
    [0, 0, 0, 0, 0, 1, 0, 0], // 65536
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0]
  ], function(val, exp) {
    it(toHex(exp), function() {
      var c = new Uint64BE(val);
      assert.equal(toHex(c.buffer), toHex(exp));
      assert.equal(c - 0, val);
      assert.equal(c.toString(16), val.toString(16));
    });
    return val * 256;
  }, 1);
});

describe("Uint64BE(high32)", function() {
  reduce.call([
    [0, 0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF],
    [0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF, 0],
    [0, 0, 0xFF, 0xFF, 0xFF, 0xFF, 0, 0],
    [0, 0xFF, 0xFF, 0xFF, 0xFF, 0, 0, 0],
    [0xFF, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0]
  ], function(val, exp) {
    it(toHex(exp), function() {
      var c = new Uint64BE(val);
      assert.equal(toHex(c.buffer), toHex(exp));
      assert.equal(c - 0, val);
      assert.equal(c.toString(16), val.toString(16));
    });
    return val * 256;
  }, 0xFFFFFFFF);
});

describe("Int64BE(low1)", function() {
  reduce.call([
    [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE], // -2
    [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE, 0xFF], // -257
    [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE, 0xFF, 0xFF], // -65537
    [0xFF, 0xFF, 0xFF, 0xFF, 0xFE, 0xFF, 0xFF, 0xFF],
    [0xFF, 0xFF, 0xFF, 0xFE, 0xFF, 0xFF, 0xFF, 0xFF],
    [0xFF, 0xFF, 0xFE, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
    [0xFF, 0xFE, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
    [0xFE, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
  ], function(val, exp) {
    it(toHex(exp), function() {
      var c = new Int64BE(val);
      assert.equal(toHex(c.buffer), toHex(exp));
      assert.equal(c - 0, val);
    });
    return (val * 256) + 255;
  }, -2);
});

describe("Int64BE(low31)", function() {
  reduce.call([
    [0xFF, 0xFF, 0xFF, 0xFF, 0x80, 0, 0, 0],
    [0xFF, 0xFF, 0xFF, 0x80, 0, 0, 0, 0xFF],
    [0xFF, 0xFF, 0x80, 0, 0, 0, 0xFF, 0xFF],
    [0xFF, 0x80, 0, 0, 0, 0xFF, 0xFF, 0xFF],
    [0x80, 0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF]
  ], function(val, exp) {
    it(toHex(exp), function() {
      var c = new Int64BE(val);
      assert.equal(toHex(c.buffer), toHex(exp));
      assert.equal(c - 0, val);
    });
    return (val * 256) + 255;
  }, -2147483648);
});


describe("Int64BE(0)", function() {
  forEach.call([
    0, 0.5, "0", NaN, Infinity, void 0, null
  ], function(val) {
    var view = ("string" === typeof val) ? '"' + val + '"' : val;
    it(toHex(ZERO) + " = " + view, function() {
      var c = new Uint64BE(val);
      assert.equal(toHex(c.buffer), toHex(ZERO));
      assert.equal(c - 0, 0);
    });
  });
});

describe("Int64BE(1)", function() {
  forEach.call([
    1, 1.5, "1", true
  ], function(val) {
    var view = ("string" === typeof val) ? '"' + val + '"' : val;
    it(toHex(POS1) + " = " + view, function() {
      var c = new Uint64BE(val);
      assert.equal(toHex(c.buffer), toHex(POS1));
      assert.equal(c - 0, 1);
    });
  });
});

function toHex(array) {
  return Array.prototype.map.call(array, function(val) {
    return val > 16 ? val.toString(16) : "0" + val.toString(16);
  }).join("");
}

function assert(value) {
  if (!value) throw new Error(value + " = " + true);
}

function equal(actual, expected) {
  if (actual != expected) throw new Error(actual + " = " + expected);
}
