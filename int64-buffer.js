// int64-buffer.js

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

  function init(that, source) {
    if (!(that instanceof this)) return new this(source);
    if (source && source.length === 8 && "number" === typeof source[0]) {
      that.buffer = source;
    } else if (source > 0) {
      writeUint64BE.call((that.buffer = new STORAGE(8)), source); // positinve
    } else if (source < 0) {
      writeInt64BE.call((that.buffer = new STORAGE(8)), source); // negative
    } else {
      that.buffer = toStorage(ZERO); // zero, NaN and others
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

  function toStorage(buffer) {
    return (STORAGE === Array) ? Array.prototype.slice.call(buffer, 0, 8) : new STORAGE(buffer);
  }

  function readUInt64BE(offset) {
    var upper = readUInt32BE.call(this, offset);
    var lower = readUInt32BE.call(this, offset + 4);
    return upper ? (upper * 4294967296 + lower) : lower;
  }

  function readInt64BE(offset) {
    var upper = readUInt32BE.call(this, offset) | 0; // a trick to get signed
    var lower = readUInt32BE.call(this, offset + 4);
    return upper ? (upper * 4294967296 + lower) : lower;
  }

  function readUInt32BE(offset) {
    return (this[offset++] * 16777216) + (this[offset++] << 16) + (this[offset++] << 8) + this[offset];
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

}(this || {}, Uint64BE, Int64BE);
