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
var UINT8ARRAY = ("undefined" !== typeof Uint8Array) && Uint8Array;

var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
var POS1 = [0, 0, 0, 0, 0, 0, 0, 1];
var NEG1 = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
var POSB = [0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF];
var NEGB = [0xFE, 0xDC, 0xBA, 0x98, 0x76, 0x54, 0x32, 0x10];
var SAMPLES = [ZERO, POS1, NEG1, POSB, NEGB];
var FLOAT_MAX = Math.pow(2, 53);
var CLASS = {Int64BE: Int64BE, Uint64BE: Uint64BE};
var STORAGES = {Buffer: BUFFER, Uint8Array: Uint8Array, Array: Array};

var itBuffer = BUFFER ? it : it.skip;
var itArrayBuffer = ARRAYBUFFER ? it : it.skip;

describe("Uint64BE", function() {
  it("Uint64BE().toNumber()", function() {
    var val = Uint64BE(1).toNumber();
    assert.ok("number" === typeof val);
    assert.equal(val, 1);
  });

  it("Uint64BE().toString()", function() {
    var val = Uint64BE(1).toString();
    assert.ok("string" === typeof val);
    assert.equal(val, "1");
  });

  it("Uint64BE().toString(10)", function() {
    var col = 1;
    var val = 1;
    var str = "1";
    while (val < FLOAT_MAX) {
      assert.equal(Uint64BE(val).toString(10), str);
      col = (col + 1) % 10;
      val = val * 10 + col;
      str += col;
    }
  });

  it("Uint64BE().toString(16)", function() {
    var val = 1;
    var col = 1;
    var str = "1";
    while (val < FLOAT_MAX) {
      assert.equal(Uint64BE(val).toString(16), str);
      col = (col + 1) % 10;
      val = val * 16 + col;
      str += col;
    }
  });

  it("Uint64BE().toJSON()", function() {
    SAMPLES.forEach(function(array) {
      var c = Uint64BE(array);
      assert.equal(c.toJSON(), c.toString(10));
    });
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
    assert.equal(val.byteLength, 8);
    assert.equal(toHex(new Uint8Array(val)), toHex(POS1));
  });
});

describe("Int64BE", function() {
  it("Int64BE().toNumber()", function() {
    var val = Int64BE(-1).toNumber();
    assert.ok("number" === typeof val);
    assert.equal(val, -1);
  });

  it("Int64BE().toString()", function() {
    var val = Int64BE(-1).toString();
    assert.ok("string" === typeof val);
    assert.equal(val, "-1");
  });

  it("Int64BE().toString(10)", function() {
    var col = 1;
    var val = -1;
    var str = "-1";
    while (val > FLOAT_MAX) {
      assert.equal(Int64BE(val).toString(10), str);
      col = (col + 1) % 10;
      val = val * 10 - col;
      str += col;
    }
  });

  it("Int64BE().toString(16)", function() {
    var col = 1;
    var val = -1;
    var str = "-1";
    while (val > FLOAT_MAX) {
      assert.equal(Int64BE(val).toString(16), str);
      col = (col + 1) % 10;
      val = val * 16 - col;
      str += col;
    }
  });

  it("Int64BE().toJSON()", function() {
    SAMPLES.forEach(function(array) {
      var c = Int64BE(array);
      assert.equal(c.toJSON(), c.toString(10));
    });
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
    assert.equal(val.byteLength, 8);
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
      assert.equal(c.toString(16), toString16(val));
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
      assert.equal(c.toString(16), toString16(val));
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
      assert.equal(c.toString(16), toString16(val));
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
      assert.equal(c.toString(16), toString16(val));
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

Object.keys(CLASS).forEach(function(int64Name) {
  var Int64Class = CLASS[int64Name];
  describe(int64Name, function() {

    it(int64Name + "(string,raddix)", function() {
      assert.equal(Int64Class("1234567890123456").toString(), "1234567890123456");
      assert.equal(Int64Class("1234567890123456", 10).toString(10), "1234567890123456");
      assert.equal(Int64Class("1234567890abcdef", 16).toString(16), "1234567890abcdef");
    });

    Object.keys(STORAGES).forEach(function(storageName) {
      var StorageClass = STORAGES[storageName];
      var itSkip = StorageClass ? it : it.skip;

      itSkip(int64Name + "(" + storageName.toLowerCase() + ",offset)", function() {
        var buffer = new StorageClass(24);
        for (var i = 0; i < 24; i++) {
          buffer[i] = i;
        }
        var val = new Int64Class(buffer, 8);
        assert.equal(Math.round(val.toNumber() / 0x1000000), 0x08090A0B0C); // check only higher 48bits
        assert.equal(val.toString(16), "8090a0b0c0d0e0f");
        var out = val.toArray();
        assert.equal(toHex(out), "08090a0b0c0d0e0f");
        assert.ok(out instanceof Array);
        if (BUFFER) {
          out = val.toBuffer();
          assert.equal(toHex(out), "08090a0b0c0d0e0f");
          assert.ok(BUFFER.isBuffer(out));
        }
        if (UINT8ARRAY) {
          out = val.toArrayBuffer();
          assert.equal(toHex(new Uint8Array(out)), "08090a0b0c0d0e0f");
          assert.ok(out instanceof ArrayBuffer);
        }
      });

      itSkip(int64Name + "(" + storageName.toLowerCase() + ",offset,value)", function() {
        var buffer = new StorageClass(24);
        var val = new Int64Class(buffer, 8, 1234567890);
        assert.equal(val.toNumber(), 1234567890);
        assert.equal(val.toString(), "1234567890");
        assert.equal(val.toJSON(), "1234567890");
        assert.equal(buffer[8], 0);
        assert.equal(buffer[15], 1234567890 & 255);
      });

      itSkip(int64Name + "(" + storageName.toLowerCase() + ",offset,string,raddix)", function() {
        var buffer = new StorageClass(24);
        var val = new Int64Class(buffer, 8, "1234567890", 16);
        assert.equal(val.toNumber(), 0x1234567890);
        assert.equal(val.toString(16), "1234567890");
        assert.equal(val.toJSON(), (0x1234567890).toString());
        assert.equal(buffer[8], 0);
        assert.equal(buffer[15], 0x1234567890 & 255);
      });
    });
  });
});

function toHex(array) {
  return Array.prototype.map.call(array, function(val) {
    return val > 16 ? val.toString(16) : "0" + val.toString(16);
  }).join("");
}

function toString16(val) {
  var str = val.toString(16);
  if (str.indexOf("e+") < 0) return str;
  // IE8-10 may return "4(e+15)" style of string
  return Math.floor(val / 0x100000000).toString(16) + lpad((val % 0x100000000).toString(16), 8);
}

function lpad(str, len) {
  return "00000000".substr(0, len - str.length) + str;
}

function assert(value) {
  if (!value) throw new Error(value + " = " + true);
}

function equal(actual, expected) {
  if (actual != expected) throw new Error(actual + " = " + expected);
}
