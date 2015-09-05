// int64-buffer.js

!function(exports) {

  exports.Uint64BE = Uint64BE;
  exports.Int64BE = Int64BE;

  var STORAGE = Buffer;
  var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];

  function Uint64BE(source) {
    init(this, source);
  }

  function Int64BE(source) {
    init(this, source);
  }

  function init(that, source) {
    if (source && source.length === 8 && "number" === typeof source[0]) {
      that.buffer = source;
    } else if (source > 0) {
      writeUint64BE((that.buffer = new STORAGE(8)), source); // positinve
    } else if (source < 0) {
      writeInt64BE((that.buffer = new STORAGE(8)), source); // negative
    } else {
      that.buffer = new STORAGE(ZERO); // zero, NaN and others
    }
  }

  Uint64BE.prototype.valueOf = function() {
    var upper = readUInt32BE(this.buffer, 0);
    var lower = readUInt32BE(this.buffer, 4);
    return upper ? (upper * 4294967296 + lower) : lower;
  };

  Int64BE.prototype.valueOf = function() {
    var upper = readUInt32BE(this.buffer, 0) | 0; // a trick to get signed
    var lower = readUInt32BE(this.buffer, 4);
    return upper ? (upper * 4294967296 + lower) : lower;
  };

  function readUInt32BE(buffer, offset) {
    return (buffer[offset++] * 16777216) + (buffer[offset++] << 16) + (buffer[offset++] << 8) + buffer[offset];
  }

  function writeUint64BE(buffer, value) {
    for (var i = 7; i >= 0; i--) {
      buffer[i] = value & 255;
      value /= 256;
    }
  }

  function writeInt64BE(buffer, value) {
    value++;
    for (var i = 7; i >= 0; i--) {
      buffer[i] = ((-value) & 255) ^ 255;
      value /= 256;
    }
  }

}(this);
