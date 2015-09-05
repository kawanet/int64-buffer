// int64-buffer.js

/*jshint -W018 */ // Confusing use of '!'.
/*jshint -W030 */ // Expected an assignment or function call and instead saw an expression.
/*jshint -W093 */ // Did you mean to return a conditional instead of an assignment?

var UInt64BE, Int64BE;

!function(exports) {
  // constructors

  var U = exports.UInt64BE = UInt64BE = function(source) {
    if (!(this instanceof UInt64BE)) return new UInt64BE(source);
    return init(this, source);
  };

  var I = exports.Int64BE = Int64BE = function(source) {
    if (!(this instanceof Int64BE)) return new Int64BE(source);
    return init(this, source);
  };

  // constants

  var BUFFER = ("undefined" !== typeof Buffer) && Buffer;
  var UINT8ARRAY = ("undefined" !== typeof Uint8Array) && Uint8Array;
  var STORAGE = BUFFER || UINT8ARRAY || Array;
  var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
  var fromArray = (STORAGE === Array) ? newArray : newStorage;
  var isArray = Array.isArray || _isArray;
  var isBuffer = BUFFER && BUFFER.isBuffer;
  var BIT32 = 4294967296;
  var BIT24 = 16777216;

  // initializer

  function init(that, source) {
    if ("string" === typeof source) {
      fromString(initStorage(that), source);
    } else if (source > 0) {
      writeUInt64BE(initStorage(that), source); // positinve
    } else if (source < 0) {
      writeInt64BE(initStorage(that), source); // negative
    } else if (source && source.length === 8 && "number" === typeof source[0]) {
      that.buffer = source;
    } else {
      that.buffer = fromArray(ZERO); // zero, NaN and others
    }
  }

  function initStorage(that) {
    return that.buffer = new STORAGE(8);
  }

  // member methods

  var UPROTO = U.prototype;
  var IPROTO = I.prototype;
  UPROTO.toNumber = function() {
    return readUInt64BE(this.buffer, 0);
  };

  IPROTO.toNumber = function() {
    return readInt64BE(this.buffer, 0);
  };

  UPROTO.toArray = IPROTO.toArray = function() {
    var buffer = this.buffer;
    return isArray(buffer) ? buffer : newArray(buffer);
  };

  if (BUFFER) {
    UPROTO.toBuffer = IPROTO.toBuffer = function() {
      var buffer = this.buffer;
      return isBuffer(buffer) ? buffer : new BUFFER(buffer);
    };
  }

  if (UINT8ARRAY) {
    UPROTO.toArrayBuffer = IPROTO.toArrayBuffer = function() {
      var buffer = this.buffer;
      var arrbuf = buffer && buffer.buffer;
      return (arrbuf instanceof ArrayBuffer) ? arrbuf : (new UINT8ARRAY(buffer)).buffer;
    };
  }

  IPROTO.toString = function(radix) {
    var buffer = this.buffer;
    var sign = (buffer[0] & 0x80) ? "-" : "";
    if (sign) buffer = neg(newArray(buffer));
    return sign + toString(buffer, radix);
  };

  UPROTO.toString = function(radix) {
    return toString(this.buffer, radix);
  };

  UPROTO.toJSON = IPROTO.toJSON = function() {
    return this.toString(10);
  };

  // private methods

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
    writeUInt32BE(buffer, high, 0);
    writeUInt32BE(buffer, low, 4);
    if (sign) neg(buffer);
  }

  function toString(buffer, radix) {
    var str = "";
    var high = readUInt32BE(buffer, 0);
    var low = readUInt32BE(buffer, 4);
    radix = radix || 10;
    while (1) {
      var mod = (high % radix) * BIT32 + low;
      high = Math.floor(high / radix);
      low = Math.floor(mod / radix);
      str = (mod % radix).toString(radix) + str;
      if (!high && !low) break;
    }
    return str;
  }

  function newStorage(buffer) {
    return new STORAGE(buffer);
  }

  function newArray(buffer, offset) {
    offset |= 0;
    return Array.prototype.slice.call(buffer, offset, offset + 8);
  }

  function readUInt64BE(buffer, offset) {
    var high = readUInt32BE(buffer, offset);
    var low = readUInt32BE(buffer, offset + 4);
    return high ? (high * BIT32 + low) : low;
  }

  function readInt64BE(buffer, offset) {
    var high = readUInt32BE(buffer, offset) | 0; // a trick to get signed
    var low = readUInt32BE(buffer, offset + 4);
    return high ? (high * BIT32 + low) : low;
  }

  function readUInt32BE(buffer, offset) {
    return (buffer[offset++] * BIT24) + (buffer[offset++] << 16) + (buffer[offset++] << 8) + buffer[offset];
  }

  function writeUInt32BE(buffer, value, offset) {
    buffer[offset + 3] = value & 255;
    value = value >> 8;
    buffer[offset + 2] = value & 255;
    value = value >> 8;
    buffer[offset + 1] = value & 255;
    value = value >> 8;
    buffer[offset] = value & 255;
  }

  function writeUInt64BE(buffer, value, offset) {
    offset |= 0;
    for (var i = offset + 7; i >= offset; i--) {
      buffer[i] = value & 255;
      value /= 256;
    }
  }

  function writeInt64BE(buffer, value, offset) {
    offset |= 0;
    value++;
    for (var i = offset + 7; i >= offset; i--) {
      buffer[i] = ((-value) & 255) ^ 255;
      value /= 256;
    }
  }

  function _isArray(array) {
    return array instanceof Array;
  }

}(this || {});
