"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hexToBuffer = exports.bufferToHex = exports.bufferToBigNumberString = exports.bigNumberToBuffer = void 0;

var _browserifyBignum = _interopRequireDefault(require("browserify-bignum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright © 2018 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */
var bigNumberToBuffer = function bigNumberToBuffer(bignumber, size) {
  return new _browserifyBignum.default(bignumber).toBuffer({
    size: size,
    endian: 'big'
  });
};

exports.bigNumberToBuffer = bigNumberToBuffer;

var bufferToBigNumberString = function bufferToBigNumberString(bigNumberBuffer) {
  return _browserifyBignum.default.fromBuffer(bigNumberBuffer).toString();
};

exports.bufferToBigNumberString = bufferToBigNumberString;

var bufferToHex = function bufferToHex(buffer) {
  return Buffer.from(buffer).toString('hex');
};

exports.bufferToHex = bufferToHex;
var hexRegex = /^[0-9a-f]+/i;

var hexToBuffer = function hexToBuffer(hex) {
  var argumentName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Argument';

  if (typeof hex !== 'string') {
    throw new TypeError("".concat(argumentName, " must be a string."));
  }

  var matchedHex = (hex.match(hexRegex) || [])[0];

  if (!matchedHex || matchedHex.length !== hex.length) {
    throw new TypeError("".concat(argumentName, " must be a valid hex string."));
  } // tslint:disable-next-line no-magic-numbers


  if (matchedHex.length % 2 !== 0) {
    throw new TypeError("".concat(argumentName, " must have a valid length of hex string."));
  }

  return Buffer.from(matchedHex, 'hex');
};

exports.hexToBuffer = hexToBuffer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ibG9ja2NoYWluL2NyeXB0by9idWZmZXIudHMiXSwibmFtZXMiOlsiYmlnTnVtYmVyVG9CdWZmZXIiLCJiaWdudW1iZXIiLCJzaXplIiwiQmlnTnVtIiwidG9CdWZmZXIiLCJlbmRpYW4iLCJidWZmZXJUb0JpZ051bWJlclN0cmluZyIsImJpZ051bWJlckJ1ZmZlciIsImZyb21CdWZmZXIiLCJ0b1N0cmluZyIsImJ1ZmZlclRvSGV4IiwiYnVmZmVyIiwiQnVmZmVyIiwiZnJvbSIsImhleFJlZ2V4IiwiaGV4VG9CdWZmZXIiLCJoZXgiLCJhcmd1bWVudE5hbWUiLCJUeXBlRXJyb3IiLCJtYXRjaGVkSGV4IiwibWF0Y2giLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFjQTs7OztBQWRBOzs7Ozs7Ozs7Ozs7OztBQWdCTyxJQUFNQSxpQkFBaUIsR0FBRyxTQUFwQkEsaUJBQW9CLENBQUNDLFNBQUQsRUFBb0JDLElBQXBCO0FBQUEsU0FDaEMsSUFBSUMseUJBQUosQ0FBV0YsU0FBWCxFQUFzQkcsUUFBdEIsQ0FBK0I7QUFBRUYsSUFBQUEsSUFBSSxFQUFKQSxJQUFGO0FBQVFHLElBQUFBLE1BQU0sRUFBRTtBQUFoQixHQUEvQixDQURnQztBQUFBLENBQTFCOzs7O0FBR0EsSUFBTUMsdUJBQXVCLEdBQUcsU0FBMUJBLHVCQUEwQixDQUFDQyxlQUFEO0FBQUEsU0FDdENKLDBCQUFPSyxVQUFQLENBQWtCRCxlQUFsQixFQUFtQ0UsUUFBbkMsRUFEc0M7QUFBQSxDQUFoQzs7OztBQUdBLElBQU1DLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQUNDLE1BQUQ7QUFBQSxTQUMxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVlGLE1BQVosRUFBb0JGLFFBQXBCLENBQTZCLEtBQTdCLENBRDBCO0FBQUEsQ0FBcEI7OztBQUdQLElBQU1LLFFBQVEsR0FBRyxhQUFqQjs7QUFDTyxJQUFNQyxXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUFDQyxHQUFELEVBQW9EO0FBQUEsTUFBdENDLFlBQXNDLHVFQUF2QixVQUF1Qjs7QUFDOUUsTUFBSSxPQUFPRCxHQUFQLEtBQWUsUUFBbkIsRUFBNkI7QUFDNUIsVUFBTSxJQUFJRSxTQUFKLFdBQWlCRCxZQUFqQix3QkFBTjtBQUNBOztBQUNELE1BQU1FLFVBQVUsR0FBRyxDQUFDSCxHQUFHLENBQUNJLEtBQUosQ0FBVU4sUUFBVixLQUF1QixFQUF4QixFQUE0QixDQUE1QixDQUFuQjs7QUFDQSxNQUFJLENBQUNLLFVBQUQsSUFBZUEsVUFBVSxDQUFDRSxNQUFYLEtBQXNCTCxHQUFHLENBQUNLLE1BQTdDLEVBQXFEO0FBQ3BELFVBQU0sSUFBSUgsU0FBSixXQUFpQkQsWUFBakIsa0NBQU47QUFDQSxHQVA2RSxDQVE5RTs7O0FBQ0EsTUFBSUUsVUFBVSxDQUFDRSxNQUFYLEdBQW9CLENBQXBCLEtBQTBCLENBQTlCLEVBQWlDO0FBQ2hDLFVBQU0sSUFBSUgsU0FBSixXQUNGRCxZQURFLDhDQUFOO0FBR0E7O0FBRUQsU0FBT0wsTUFBTSxDQUFDQyxJQUFQLENBQVlNLFVBQVosRUFBd0IsS0FBeEIsQ0FBUDtBQUNBLENBaEJNIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCDCqSAyMDE4IExpc2sgRm91bmRhdGlvblxuICpcbiAqIFNlZSB0aGUgTElDRU5TRSBmaWxlIGF0IHRoZSB0b3AtbGV2ZWwgZGlyZWN0b3J5IG9mIHRoaXMgZGlzdHJpYnV0aW9uXG4gKiBmb3IgbGljZW5zaW5nIGluZm9ybWF0aW9uLlxuICpcbiAqIFVubGVzcyBvdGhlcndpc2UgYWdyZWVkIGluIGEgY3VzdG9tIGxpY2Vuc2luZyBhZ3JlZW1lbnQgd2l0aCB0aGUgTGlzayBGb3VuZGF0aW9uLFxuICogbm8gcGFydCBvZiB0aGlzIHNvZnR3YXJlLCBpbmNsdWRpbmcgdGhpcyBmaWxlLCBtYXkgYmUgY29waWVkLCBtb2RpZmllZCxcbiAqIHByb3BhZ2F0ZWQsIG9yIGRpc3RyaWJ1dGVkIGV4Y2VwdCBhY2NvcmRpbmcgdG8gdGhlIHRlcm1zIGNvbnRhaW5lZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZS5cbiAqXG4gKiBSZW1vdmFsIG9yIG1vZGlmaWNhdGlvbiBvZiB0aGlzIGNvcHlyaWdodCBub3RpY2UgaXMgcHJvaGliaXRlZC5cbiAqXG4gKi9cbmltcG9ydCBCaWdOdW0gZnJvbSAnYnJvd3NlcmlmeS1iaWdudW0nO1xuXG5leHBvcnQgY29uc3QgYmlnTnVtYmVyVG9CdWZmZXIgPSAoYmlnbnVtYmVyOiBzdHJpbmcsIHNpemU6IG51bWJlcikgPT5cblx0bmV3IEJpZ051bShiaWdudW1iZXIpLnRvQnVmZmVyKHsgc2l6ZSwgZW5kaWFuOiAnYmlnJyB9KTtcblxuZXhwb3J0IGNvbnN0IGJ1ZmZlclRvQmlnTnVtYmVyU3RyaW5nID0gKGJpZ051bWJlckJ1ZmZlcjogQnVmZmVyKTogc3RyaW5nID0+XG5cdEJpZ051bS5mcm9tQnVmZmVyKGJpZ051bWJlckJ1ZmZlcikudG9TdHJpbmcoKTtcblxuZXhwb3J0IGNvbnN0IGJ1ZmZlclRvSGV4ID0gKGJ1ZmZlcjogQnVmZmVyKTogc3RyaW5nID0+XG5cdEJ1ZmZlci5mcm9tKGJ1ZmZlcikudG9TdHJpbmcoJ2hleCcpO1xuXG5jb25zdCBoZXhSZWdleCA9IC9eWzAtOWEtZl0rL2k7XG5leHBvcnQgY29uc3QgaGV4VG9CdWZmZXIgPSAoaGV4OiBzdHJpbmcsIGFyZ3VtZW50TmFtZSA9ICdBcmd1bWVudCcpOiBCdWZmZXIgPT4ge1xuXHRpZiAodHlwZW9mIGhleCAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGAke2FyZ3VtZW50TmFtZX0gbXVzdCBiZSBhIHN0cmluZy5gKTtcblx0fVxuXHRjb25zdCBtYXRjaGVkSGV4ID0gKGhleC5tYXRjaChoZXhSZWdleCkgfHwgW10pWzBdO1xuXHRpZiAoIW1hdGNoZWRIZXggfHwgbWF0Y2hlZEhleC5sZW5ndGggIT09IGhleC5sZW5ndGgpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGAke2FyZ3VtZW50TmFtZX0gbXVzdCBiZSBhIHZhbGlkIGhleCBzdHJpbmcuYCk7XG5cdH1cblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcblx0aWYgKG1hdGNoZWRIZXgubGVuZ3RoICUgMiAhPT0gMCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXG5cdFx0XHRgJHthcmd1bWVudE5hbWV9IG11c3QgaGF2ZSBhIHZhbGlkIGxlbmd0aCBvZiBoZXggc3RyaW5nLmAsXG5cdFx0KTtcblx0fVxuXG5cdHJldHVybiBCdWZmZXIuZnJvbShtYXRjaGVkSGV4LCAnaGV4Jyk7XG59O1xuIl19