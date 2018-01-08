'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MainDialog = exports.MainNLP = exports.CHOOSE_MENU_ITEM_RESPONSE = exports.UNRECOGNIZED_TEXT_RESPONSE = exports.UNRECOGNIZED_IMAGE_RESPONSE = exports.RESTART_PATH = exports.DEMO_VERSION = exports.HELP_MENU_TREE = exports.COMPLETION_QUESTIONAIRE = exports.CURRENT_VERSION = undefined;

var _deepdialog = require('deepdialog');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } //
// LactBot
// - onboard to LactApp
//
// Main Dialog
//
// This is the dialog that gets control when your bot starts a new
// session with a user
//
//

var CURRENT_VERSION = exports.CURRENT_VERSION = '2017-11-12-main';
var COMPLETION_QUESTIONAIRE = exports.COMPLETION_QUESTIONAIRE = '2017-05-26-completion';
var HELP_MENU_TREE = exports.HELP_MENU_TREE = '2017-06-29-help';
var DEMO_VERSION = exports.DEMO_VERSION = '2017-06-02-lact-demo-eng';
var RESTART_PATH = exports.RESTART_PATH = ['menu', '¡Entendido!', 'menu', 'Vale, cuéntame', 'menu', 'Ok'];
var UNRECOGNIZED_IMAGE_RESPONSE = exports.UNRECOGNIZED_IMAGE_RESPONSE = 'Lo siento.  \uD83D\uDE48 Aun estoy aprendindo a reconocer iconos e im\xE1genes... mientras tanto ser\xE1 mejor que uses texto';
var UNRECOGNIZED_TEXT_RESPONSE = exports.UNRECOGNIZED_TEXT_RESPONSE = 'Lo siento \uD83D\uDE10 no te he entendido';
var CHOOSE_MENU_ITEM_RESPONSE = exports.CHOOSE_MENU_ITEM_RESPONSE = 'Por favor. Escoge una opci\xF3n del men\xFA';

var MainNLP = exports.MainNLP = new _deepdialog.NLPModel({
  name: 'MainNLP',
  provider: 'apiai',
  accessToken: process.env.APIAI_ACCESSKEY_SECRET
});

var MainDialog = exports.MainDialog = new _deepdialog.Dialog({
  name: 'MainDialog',
  description: 'The top level dialog of your bot'
});

MainDialog.nlpModelName = 'MainNLP';

MainDialog.onStart(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(session) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return session.start('MenuTreeDialog', 'current', { versionName: CURRENT_VERSION });

          case 2:
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

MainDialog.onText('Empezar', function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(session) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return session.start('MenuTreeDialog', 'current', { versionName: CURRENT_VERSION });

          case 2:
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

MainDialog.onText('Hello', function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(session) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return session.start('MenuTreeDialog', 'current', { versionName: DEMO_VERSION });

          case 2:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());

MainDialog.onResult('MenuTreeDialog', 'current', function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(session) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return session.start('MenuTreeDialog', 'completion_questionaire', { versionName: COMPLETION_QUESTIONAIRE });

          case 2:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}());

MainDialog.onResult('MenuTreeDialog', 'completion_questionaire', function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(session, result) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!result) {
              _context5.next = 3;
              break;
            }

            _context5.next = 3;
            return session.start('MenuTreeDialog', 'current', { versionName: CURRENT_VERSION, path: RESTART_PATH });

          case 3:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function (_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}());

//
// Basic intent handlers
//
MainDialog.onIntent('image_input', function () {
  var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(session, _ref7, _ref8) {
    var entities = _ref7.entities;
    var message = _ref8.message;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (!imageHandler(session, message)) {
              _context6.next = 5;
              break;
            }

            _context6.next = 3;
            return session.send('Bueno!');

          case 3:
            _context6.next = 7;
            break;

          case 5:
            _context6.next = 7;
            return session.send({ text: UNRECOGNIZED_IMAGE_RESPONSE });

          case 7:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function (_x7, _x8, _x9) {
    return _ref6.apply(this, arguments);
  };
}());

MainDialog.onRecovery(function () {
  var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(session) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return session.start('MenuTreeDialog', 'current', { versionName: CURRENT_VERSION });

          case 2:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function (_x10) {
    return _ref9.apply(this, arguments);
  };
}());

function imageHandler(session, message) {
  //
  // thumbs up icons
  //
  var thumbsUp = ['https://scontent.xx.fbcdn.net/v/t39.1997-6/851557_369239266556155_759568595_n.png?_nc_ad=z-m&oh=65f8806bcfe45834eb50b60f51cb352d&oe=596142DC', 'add thumbs up urls here'];

  if (thumbsUp.indexOf(message.text) > -1) {
    return true;
  } else {
    return false;
  }
}