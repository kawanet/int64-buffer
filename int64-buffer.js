// int64-buffer.js

/*jshint -W018 */ // Confusing use of '!'.
/*jshint -W030 */ // Expected an assignment or function call and instead saw an expression.
/*jshint -W093 */ // Did you mean to return a conditional instead of an assignment?

var Uint64BE, Int64BE;

!function(exports) {
  // constructors

  var U = exports.Uint64BE = Uint64BE = function(buffer, offset, source) {
    if (!(this instanceof Uint64BE)) return new Uint64BE(buffer, offset, source);
    return init(this, buffer, offset, source);
  };

  var I = exports.Int64BE = Int64BE = function(buffer, offset, source) {
    if (!(this instanceof Int64BE)) return new Int64BE(buffer, offset, source);
    return init(this, buffer, offset, source);
  };

  // constants

  var UNDEFIND = "undefined";
  var BUFFER = (UNDEFIND !== typeof Buffer) && Buffer;
  var UINT8ARRAY = (UNDEFIND !== typeof Uint8Array) && Uint8Array;
  var STORAGE = BUFFER || UINT8ARRAY || Array;
  var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
  var isArray = Array.isArray || _isArray;
  var isBuffer = BUFFER && BUFFER.isBuffer;
  var BIT32 = 4294967296;
  var BIT24 = 16777216;

  // initializer

  function init(that, buffer, offset, value) {
    that.offset = offset = offset | 0;
    if (isStorage(buffer, offset)) {
      that.buffer = buffer;
      if (UNDEFIND === typeof value) return;
    } else {
      value = buffer;
      that.buffer = buffer = new STORAGE(offset + 8);
    }
    if (isStorage(value, offset)) {
      fromArray(buffer, offset, value, 0);
    } else if ("string" === typeof value) {
      fromString(buffer, offset, value);
    } else if (value > 0) {
      fromPositive(buffer, offset, value); // positive
    } else if (value < 0) {
      fromNegative(buffer, offset, value); // negative
    } else {
      fromArray(buffer, offset, ZERO, 0); // zero, NaN and others
    }
  }

  // member methods

  var UPROTO = U.prototype;
  var IPROTO = I.prototype;

  UPROTO.buffer = IPROTO.buffer = void 0;

  UPROTO.offset = IPROTO.offset = 0;

  UPROTO.fragment = IPROTO.fragment = false;

  UPROTO.toNumber = function() {
    var buffer = this.buffer;
    var offset = this.offset;
    var high = readUInt32BE(buffer, offset);
    var low = readUInt32BE(buffer, offset + 4);
    return high ? (high * BIT32 + low) : low;
  };

  IPROTO.toNumber = function() {
    var buffer = this.buffer;
    var offset = this.offset;
    var high = readUInt32BE(buffer, offset) | 0; // a trick to get signed
    var low = readUInt32BE(buffer, offset + 4);
    return high ? (high * BIT32 + low) : low;
  };

  UPROTO.toArray = IPROTO.toArray = function(raw) {
    var buffer = this.buffer;
    var offset = this.offset;
    if (raw !== false && offset === 0 && buffer.length === 8 && isArray(buffer)) return buffer;
    return newArray(buffer, offset);
  };

  if (BUFFER) {
    UPROTO.toBuffer = IPROTO.toBuffer = function(raw) {
      var buffer = this.buffer;
      var offset = this.offset;
      if (raw !== false && offset === 0 && buffer.length === 8 && isBuffer(buffer)) return buffer;
      var dest = new BUFFER(8);
      fromArray(dest, 0, buffer, offset);
      return dest;
    };
  }

  if (UINT8ARRAY) {
    UPROTO.toArrayBuffer = IPROTO.toArrayBuffer = function(raw) {
      var buffer = this.buffer;
      var offset = this.offset;
      if (raw !== false && offset === 0 && buffer.length === 8 && hasArrayBuffer(buffer)) return buffer.buffer;
      var dest = new UINT8ARRAY(8);
      fromArray(dest, 0, buffer, offset);
      return dest.buffer;
    };
  }

  IPROTO.toString = function(radix) {
    var buffer = this.buffer;
    var offset = this.offset;
    var sign = (buffer[offset] & 0x80) ? "-" : "";
    if (sign) buffer = neg(newArray(buffer, offset), 0);
    return sign + toString(buffer, offset, radix);
  };

  UPROTO.toString = function(radix) {
    return toString(this.buffer, this.offset, radix);
  };

  UPROTO.toJSON = IPROTO.toJSON = function() {
    return this.toString(10);
  };

  // private methods

  function isStorage(buffer, offset) {
    var len = buffer && buffer.length;
    return len && (offset + 8 <= len) && ("string" !== typeof buffer[offset]);
  }

  function hasArrayBuffer(buffer) {
    return buffer.buffer instanceof ArrayBuffer;
  }

  function fromArray(destbuf, destoff, srcbuf, srcoff) {
    destoff |= 0;
    srcoff |= 0;
    for (var i = 0; i < 8; i++) {
      destbuf[destoff++] = srcbuf[srcoff++] & 255;
    }
  }

  function neg(buffer, offset) {
    var p = 1;
    var sign = buffer[offset] & 0x80;
    for (var i = offset + 8; i >= offset; i--) {
      var q = (buffer[i] ^ 255) + p;
      p = (q > 255) ? 1 : 0;
      buffer[i] = p ? 0 : q;
    }
    buffer[offset] = (buffer[offset] & 0x7F) | (sign ^ 0x80);
    return buffer;
  }

  function fromString(buffer, offset, str) {
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
    writeUInt32BE(buffer, offset, high);
    writeUInt32BE(buffer, offset + 4, low);
    if (sign) neg(buffer, offset);
  }

  function toString(buffer, offset, radix) {
    var str = "";
    var high = readUInt32BE(buffer, offset);
    var low = readUInt32BE(buffer, offset + 4);
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

  function newArray(buffer, offset) {
    return Array.prototype.slice.call(buffer, offset, offset + 8);
  }

  function readUInt32BE(buffer, offset) {
    return (buffer[offset++] * BIT24) + (buffer[offset++] << 16) + (buffer[offset++] << 8) + buffer[offset];
  }

  function writeUInt32BE(buffer, offset, value) {
    buffer[offset + 3] = value & 255;
    value = value >> 8;
    buffer[offset + 2] = value & 255;
    value = value >> 8;
    buffer[offset + 1] = value & 255;
    value = value >> 8;
    buffer[offset] = value & 255;
  }

  function fromPositive(buffer, offset, value) {
    for (var i = offset + 7; i >= offset; i--) {
      buffer[i] = value & 255;
      value /= 256;
    }
  }

  function fromNegative(buffer, offset, value) {
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
