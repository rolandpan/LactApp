'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadMenuTree = undefined;

var loadMenuTree = exports.loadMenuTree = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(versionName) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return loadYML(versionName + '.yml');

          case 2:
            return _context.abrupt('return', _context.sent);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function loadMenuTree(_x) {
    return _ref.apply(this, arguments);
  };
}();

var loadYML = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(fileName) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = _jsYaml.safeLoad;
            _context2.next = 3;
            return fs.readFileAsync('./content/' + fileName, 'utf8');

          case 3:
            _context2.t1 = _context2.sent;
            return _context2.abrupt('return', (0, _context2.t0)(_context2.t1));

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function loadYML(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getPath = getPath;

var _jsYaml = require('js-yaml');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fs = _bluebird2.default.promisifyAll(require('fs'));

function getPath(obj, path) {
  if (obj) {
    if (path && path.length > 0) {
      var _path = _toArray(path),
          head = _path[0],
          tail = _path.slice(1);

      var child = obj[head];
      return getPath(child, tail);
    } else {
      return obj;
    }
  }
}