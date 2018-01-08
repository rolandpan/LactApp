'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YesNoDialog = undefined;

var _deepdialog = require('deepdialog');

var _maindialog = require('./maindialog');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var YesNoDialog = exports.YesNoDialog = new _deepdialog.Dialog({
  name: 'YesNoDialog',
  description: 'Ask yes or no question, use NLP to handle message - return Yes or No'
});

YesNoDialog.nlpModelName = 'MainNLP';

YesNoDialog.onIntent('yesno_affirmative', function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(session) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            session.finish('Yes');

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

YesNoDialog.onIntent('yesno_negative', function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(session) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            session.finish('No');

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());

YesNoDialog.onIntent('image_input', function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(session, _ref4, _ref5) {
    var entities = _ref4.entities;
    var message = _ref5.message;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(0, _maindialog.imageHandler)(session, message)) {
              _context3.next = 4;
              break;
            }

            session.finish('Yes');
            _context3.next = 6;
            break;

          case 4:
            _context3.next = 6;
            return session.send({ text: 'I\'m so sorry, but I\'m still working on recognizing stickers and images...until I figure it out please use text to speak with me.' });

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}());

YesNoDialog.onRecovery(function () {
  var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(session, message) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return session.send({ text: 'I\'m very sorry, I didn\'t understand "' + message.text + '".' });

          case 2:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function (_x6, _x7) {
    return _ref6.apply(this, arguments);
  };
}());