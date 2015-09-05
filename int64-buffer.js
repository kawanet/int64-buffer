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
  var fromArray = (STORAGE === Array) ? newArray : newStorage;
  var isArray = Array.isArray || _isArray;
  var isBuffer = BUFFER && BUFFER.isBuffer;

  function init(that, source) {
    if (!(that instanceof this)) return new this(source);
    if (source && source.length === 8 && "number" === typeof source[0]) {
      that.buffer = source;
    } else if (source > 0) {
      writeUint64BE.call((that.buffer = new STORAGE(8)), source); // positinve
    } else if (source < 0) {
      writeInt64BE.call((that.buffer = new STORAGE(8)), source); // negative
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
    var bufbuf = buffer && buffer.buffer;
    return (bufbuf && (bufbuf instanceof ArrayBuffer)) ? bufbuf : (new UINT8ARRAY(buffer)).buffer;
  }

  function newStorage(buffer) {
    return new STORAGE(buffer);
  }

  function newArray(buffer) {
    return Array.prototype.slice.call(buffer, 0, 8);
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

  function _isArray(array) {
    return array instanceof Array;
  }

}(this || {}, Uint64BE, Int64BE);
