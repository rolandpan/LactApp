'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadMenuTree = undefined;

let loadMenuTree = exports.loadMenuTree = (() => {
  var _ref = _asyncToGenerator(function* (versionName) {
    return yield loadYML(`${versionName}.yml`);
  });

  return function loadMenuTree(_x) {
    return _ref.apply(this, arguments);
  };
})();

let loadYML = (() => {
  var _ref2 = _asyncToGenerator(function* (fileName) {
    return (0, _jsYaml.safeLoad)((yield fs.readFileAsync('./content/' + fileName, 'utf8')));
  });

  return function loadYML(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

exports.getPath = getPath;

var _jsYaml = require('js-yaml');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fs = _bluebird2.default.promisifyAll(require('fs'));

function getPath(obj, path) {
  if (obj) {
    if (path && path.length > 0) {
      var [head, ...tail] = path;
      var child = obj[head];
      return getPath(child, tail);
    } else {
      return obj;
    }
  }
}