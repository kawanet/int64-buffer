// int64-buffer.js

/*jshint -W018 */ // Confusing use of '!'.
/*jshint -W030 */ // Expected an assignment or function call and instead saw an expression.
/*jshint -W093 */ // Did you mean to return a conditional instead of an assignment?

function Uint64BE(source) {
  return Uint64BE.init(this, source);
}

function Int64BE(source) {
  return Int64BE.init(this, source);
}

!function(exports, Uint64BE, Int64BE) {
  exports.Uint64BE = Uint64BE;
  exports.Int64BE = Int64BE;
  Uint64BE.init = Int64BE.init = init;

  var BUFFER = ("undefined" !== typeof Buffer) && Buffer;
  var UINT8ARRAY = ("undefined" !== typeof Uint8Array) && Uint8Array;
  var STORAGE = BUFFER || UINT8ARRAY || Array;
  var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
  var fromArray = (STORAGE === Array) ? newArray : newStorage;
  var isArray = Array.isArray || _isArray;
  var isBuffer = BUFFER && BUFFER.isBuffer;
  var BIT32 = 4294967296;
  var BIT24 = 16777216;

  function init(that, source) {
    if (!(that instanceof this)) return new this(source);
    if ("string" === typeof source) {
      fromString(initStorage(that), source);
    } else if (source && source.length === 8 && "number" === typeof source[0]) {
      that.buffer = source;
    } else if (source > 0) {
      writeUint64BE.call(initStorage(that), source); // positinve
    } else if (source < 0) {
      writeInt64BE.call(initStorage(that), source); // negative
    } else {
      that.buffer = fromArray(ZERO); // zero, NaN and others
    }
  }

  var Uint64BE_prototype = Uint64BE.prototype;
  var Int64BE_prototype = Int64BE.prototype;
  Uint64BE_prototype.valueOf = function() {
    return readUInt64BE.call(this.buffer, 0);
  };

  Int64BE_prototype.valueOf = function() {
    return readInt64BE.call(this.buffer, 0);
  };

  Uint64BE_prototype.toArray = Int64BE_prototype.toArray = toArray;

  if (BUFFER) {
    Uint64BE_prototype.toBuffer = Int64BE_prototype.toBuffer = toBuffer;
  }

  if (UINT8ARRAY) {
    Uint64BE_prototype.toArrayBuffer = Int64BE_prototype.toArrayBuffer = toArrayBuffer;
  }

  Int64BE_prototype.toString = function(radix) {
    var buffer = newArray(this.buffer);
    if (buffer[0] & 0x80) {
      return "-" + toString(neg(buffer), radix);
    } else {
      return toString(buffer, radix);
    }
  };

  Uint64BE_prototype.toString = function(radix) {
    return toString(newArray(this.buffer), radix);
  };

  function neg(buffer) {
    var p = 1;
    var sign = buffer[0] & 0x80;
    for (var i = buffer.length - 1; i >= 0; i--) {
      var q = (buffer[i] ^ 255) + p;
      p = (q > 255) ? 1 : 0;
      buffer[i] = p ? 0 : q;
    }
    buffer[0] = (buffer[0] & 0x7F) | (sign ^ 0x80);
    return buffer;
  }

  function fromString(buffer, str) {
    var pos = 0;
    var len = str.length;
    var high = 0;
    var low = 0;
    if (str[0] === "-") pos++;
    var sign = pos;
    while (pos < len) {
      var chr = str[pos++] - 0;
      if (!(chr >= 0)) break;
      low = low * 10 + chr;
      high = high * 10 + Math.floor(low / BIT32);
      low %= BIT32;
    }
    writeUInt32BE.call(buffer, high, 0);
    writeUInt32BE.call(buffer, low, 4);
    if (sign) neg(buffer);
  }

  function toString(buffer, radix) {
    var str = "";
    if (!radix) radix = 10;
    var len = buffer.length;
    while (1) {
      var mod = 0;
      var bit = 0;
      for (var i = 0; i < len; i++) {
        var quot = mod * 256 + buffer[i];
        var div = buffer[i] = Math.floor(quot / radix);
        bit = bit | div;
        mod = quot % radix;
      }
      str = mod.toString(radix) + str;
      if (!bit) break;
    }
    return str;
  }

  function toArray() {
    var buffer = this.buffer;
    return isArray(buffer) ? buffer : newArray(buffer);
  }

  function toBuffer() {
    var buffer = this.buffer;
    return isBuffer(buffer) ? buffer : new BUFFER(buffer);
  }

  function toArrayBuffer() {
    var buffer = this.buffer;
    var arrbuf = buffer && buffer.buffer;
    return (arrbuf instanceof ArrayBuffer) ? arrbuf : (new UINT8ARRAY(buffer)).buffer;
  }

  function initStorage(that) {
    return that.buffer = new STORAGE(8);
  }

  function newStorage(buffer) {
    return new STORAGE(buffer);
  }

  function newArray(buffer) {
    return Array.prototype.slice.call(buffer, 0, 8);
  }

  function readUInt64BE(offset) {
    var high = readUInt32BE.call(this, offset);
    var low = readUInt32BE.call(this, offset + 4);
    return high ? (high * BIT32 + low) : low;
  }

  function readInt64BE(offset) {
    var high = readUInt32BE.call(this, offset) | 0; // a trick to get signed
    var low = readUInt32BE.call(this, offset + 4);
    return high ? (high * BIT32 + low) : low;
  }

  function readUInt32BE(offset) {
    return (this[offset++] * BIT24) + (this[offset++] << 16) + (this[offset++] << 8) + this[offset];
  }

  function writeUInt32BE(value, offset) {
    this[offset + 3] = value & 255;
    value = value >> 8;
    this[offset + 2] = value & 255;
    value = value >> 8;
    this[offset + 1] = value & 255;
    value = value >> 8;
    this[offset] = value & 255;
  }

  function writeUint64BE(value) {
    for (var i = 7; i >= 0; i--) {
      this[i] = value & 255;
      value /= 256;
    }
  }

  function writeInt64BE(value) {
    value++;
    for (var i = 7; i >= 0; i--) {
      this[i] = ((-value) & 255) ^ 255;
      value /= 256;
    }
  }

  function _isArray(array) {
    return array instanceof Array;
  }

}(this || {}, Uint64BE, Int64BE);
