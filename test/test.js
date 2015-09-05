// test.js

assert.equal = equal;
assert.ok = assert;

var exported = ("undefined" !== typeof require) ? require("../int64-buffer") : window;
var Uint64BE = exported.Uint64BE;
var Int64BE = exported.Int64BE;
var reduce = Array.prototype.reduce;
var forEach = Array.prototype.forEach;
var BUFFER = ("undefined" !== typeof Buffer) && Buffer;

var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
var ONE = [0, 0, 0, 0, 0, 0, 0, 1];

it.skipBuffer = BUFFER ? it : it.skip;

describe("Uint64BE", function() {
  it("Uint64BE().toArray()", function() {
    var c = Uint64BE();
    assert.ok(c instanceof Uint64BE);
    assert.ok(c.toArray() instanceof Array);
  });

  it.skipBuffer("Uint64BE().toBuffer()", function() {
    var c = Uint64BE();
    assert.ok(BUFFER.isBuffer(c.toBuffer()));
  });
});

describe("Int64BE", function() {
  it("Int64BE().toArray()", function() {
    var c = Int64BE();
    assert.ok(c instanceof Int64BE);
    assert.ok(c.toArray() instanceof Array);
  });

  it.skipBuffer("Int64BE().toBuffer()", function() {
    var c = Int64BE();
    assert.ok(BUFFER.isBuffer(c.toBuffer()));
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
    it(toHex(exp) + " = " + val, function() {
      var c = new Uint64BE(exp);
      assert.equal(toHex(c.toArray()), toHex(exp));
      assert.equal(c - 0, val);
    });
    return val * 256;
  }, 1);
});

describe("Int64BE(array)", function() {
  forEach.call([
    [0x0000000000000000, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0x0000000000000001, 0, 0, 0, 0, 0, 0, 0, 1], // 1
    [0x4000000000000000, 0x40, 0, 0, 0, 0, 0, 0, 0],
    [-1, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
  ], function(exp) {
    var val = exp.shift();
    it(toHex(exp) + " = " + val, function() {
      var c = new Int64BE(exp);
      assert.equal(toHex(c.toArray()), toHex(exp));
      assert.equal(c - 0, val);
    });
    return val * 256;
  }, 1);
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
    it(toHex(exp) + " = " + val, function() {
      var c = new Uint64BE(val);
      assert.equal(toHex(c.toArray()), toHex(exp));
      assert.equal(c - 0, val);
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
    it(toHex(exp) + " = " + val, function() {
      var c = new Uint64BE(val);
      assert.equal(toHex(c.toArray()), toHex(exp));
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
    it(toHex(exp) + " = " + val, function() {
      var c = new Int64BE(val);
      assert.equal(toHex(c.toArray()), toHex(exp));
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
    it(toHex(exp) + " = " + val, function() {
      var c = new Int64BE(val);
      assert.equal(toHex(c.toArray()), toHex(exp));
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
      assert.equal(toHex(c.toArray()), toHex(ZERO));
    });
    return val * 256;
  }, 1);
});

describe("Int64BE(1)", function() {
  forEach.call([
    1, 1.5, "1", true
  ], function(val) {
    var view = ("string" === typeof val) ? '"' + val + '"' : val;
    it(toHex(ONE) + " = " + view, function() {
      var c = new Uint64BE(val);
      assert.equal(toHex(c.toArray()), toHex(ONE));
    });
    return val * 256;
  }, 1);
});

function toHex(array) {
  return Array.prototype.map.call(array, function(val) {
    return val > 16 ? val.toString(16) : "0" + val.toString(16);
  }).join(" ");
}

function assert(value) {
  if (!value) throw new Error(value + " = " + true);
}

function equal(actual, expected) {
  if (actual != expected) throw new Error(actual + " = " + expected);
}
