'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MenuTreeDialog = undefined;

// function to send question and reply buttons based on menu tree
// if array, last element must be text: (not image) to allow sending quick reply buttons
var sendQuestionAndMenu = function () {
  var _ref13 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(session, menuTree) {
    var replyButtons, mi, responseList, i;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:

            // build menu buttons - iterate over menu items and return array of action objects
            replyButtons = [];

            for (mi in menuTree.menu) {
              replyButtons.push(makeButton(mi));
            }
            // leave off back and to beginning buttons for completion questionaire
            if (session.get('versionName') != _maindialog.COMPLETION_QUESTIONAIRE) {
              replyButtons.push(makeButton(BACK_BUTTON));
              replyButtons.push(makeButton(START_BUTTON));
            }

            responseList = [];

            responseList = createResponseList(menuTree.question);

            _context12.t0 = regeneratorRuntime.keys(responseList);

          case 6:
            if ((_context12.t1 = _context12.t0()).done) {
              _context12.next = 18;
              break;
            }

            i = _context12.t1.value;

            // if last element, add reply buttons
            if (i == responseList.length - 1) {
              // add replyButtons object to responseList[i] object and send
              responseList[i].actions = replyButtons;
            }
            _context12.next = 11;
            return session.send(responseList[i]);

          case 11:
            _context12.next = 13;
            return (0, _util2.sleep)(1000);

          case 13:
            if (!(responseList[i].type == 'image')) {
              _context12.next = 16;
              break;
            }

            _context12.next = 16;
            return (0, _util2.sleep)(3000);

          case 16:
            _context12.next = 6;
            break;

          case 18:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function sendQuestionAndMenu(_x14, _x15) {
    return _ref13.apply(this, arguments);
  };
}();

// function: return list of send objects given user response inputs specified in YML file


var _deepdialog = require('deepdialog');

var _util = require('util');

var _loadMenuTree = require('./loadMenuTree');

var _util2 = require('deepdialog/lib/util');

var _maindialog = require('./maindialog');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } //
// MenuTreeDialog:
// traverse a questionaire passed as arg (with given, expected YML format)
// Expected format of menuTree
//   question: '....'
//   menu:
//     menuitem1: '...'
//     menuitem2:
//        question: '...'
//        menu:
//          etc.
//


//import {RESTART_PATH} from './maindialog';

var BACK_BUTTON = 'Atrás';
var START_BUTTON = 'Volver al inicio';
var AFFIRMATIVE = 'Sí';

//const BACK_BUTTON='Back';
//const START_BUTTON='Start over';

var MenuTreeDialog = exports.MenuTreeDialog = new _deepdialog.Dialog({
  name: 'MenuTreeDialog',
  description: 'Traverse a YAML menu tree (in given question: menu: format)',
  handleUnwinding: false,
  allowUnwinding: true
});

MenuTreeDialog.onStart(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(session, _ref2) {
    var versionName = _ref2.versionName,
        path = _ref2.path;
    var fullMenuTree, menuTree;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _deepdialog.log.info('Started MenuTreeDialog');

            _context.next = 3;
            return (0, _loadMenuTree.loadMenuTree)(versionName, path);

          case 3:
            fullMenuTree = _context.sent;
            menuTree = (0, _loadMenuTree.getPath)(fullMenuTree, path);

            if (!menuTree) {
              _context.next = 10;
              break;
            }

            _context.next = 8;
            return sendQuestionAndMenu(session, menuTree);

          case 8:
            _context.next = 12;
            break;

          case 10:
            _context.next = 12;
            return session.finish(false);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

// exit
MenuTreeDialog.onText('exit', function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(session) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return session.finish();

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());

// text matching for help
MenuTreeDialog.onText('ayuda', function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(session) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return session.start('MenuTreeDialog', 'help', { versionName: _maindialog.HELP_MENU_TREE });

          case 2:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}());
MenuTreeDialog.onText('Ayuda', function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(session) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return session.start('MenuTreeDialog', 'help', { versionName: _maindialog.HELP_MENU_TREE });

          case 2:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function (_x5) {
    return _ref5.apply(this, arguments);
  };
}());
MenuTreeDialog.onText('no lo entiendo', function () {
  var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(session) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return session.start('MenuTreeDialog', 'help', { versionName: _maindialog.HELP_MENU_TREE });

          case 2:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function (_x6) {
    return _ref6.apply(this, arguments);
  };
}());
MenuTreeDialog.onIntent('help', function () {
  var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(session) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return session.start('MenuTreeDialog', 'help', { versionName: _maindialog.HELP_MENU_TREE });

          case 2:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function (_x7) {
    return _ref7.apply(this, arguments);
  };
}());

MenuTreeDialog.onIntent('image_input', function () {
  var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(session) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return session.send({ text: _maindialog.UNRECOGNIZED_IMAGE_RESPONSE });

          case 2:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function (_x8) {
    return _ref8.apply(this, arguments);
  };
}());

// handle response for any payload for menu item selections
MenuTreeDialog.onPayload(_deepdialog.any, function () {
  var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(session, notification) {
    var versionName, path, fullMenuTree, newPath, responseToUser, restartPath, restartMenuTree, childMenuTree, responseList, i, len, parentMenuTree, currentMenuTree;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            //
            // retrieve menu tree traversed thus far
            // point to next level of menu, given user response
            // note: response can be a string (if there are no more menu items) or a menu tree subsection
            //
            versionName = session.get('versionName');
            path = session.get('path') || [];
            _context8.next = 4;
            return (0, _loadMenuTree.loadMenuTree)(versionName);

          case 4:
            fullMenuTree = _context8.sent;
            newPath = [].concat(_toConsumableArray(path), ['menu', notification.data.payload]);
            responseToUser = (0, _loadMenuTree.getPath)(fullMenuTree, newPath);
            restartPath = [];
            restartMenuTree = (0, _loadMenuTree.getPath)(fullMenuTree, restartPath);

            //
            // check if menu reponse is in list of defined items
            //

            if (!(responseToUser != undefined)) {
              _context8.next = 44;
              break;
            }

            if (!hasMenu(responseToUser)) {
              _context8.next = 19;
              break;
            }

            session.set({ path: newPath });
            _context8.next = 14;
            return session.save();

          case 14:
            childMenuTree = (0, _loadMenuTree.getPath)(fullMenuTree, newPath);
            _context8.next = 17;
            return sendQuestionAndMenu(session, childMenuTree);

          case 17:
            _context8.next = 42;
            break;

          case 19:
            responseList = [];

            responseList = createResponseList(responseToUser);
            _context8.t0 = regeneratorRuntime.keys(responseList);

          case 22:
            if ((_context8.t1 = _context8.t0()).done) {
              _context8.next = 30;
              break;
            }

            i = _context8.t1.value;
            _context8.next = 26;
            return session.send(responseList[i]);

          case 26:
            _context8.next = 28;
            return (0, _util2.sleep)(1000);

          case 28:
            _context8.next = 22;
            break;

          case 30:
            if (!(versionName == _maindialog.COMPLETION_QUESTIONAIRE)) {
              _context8.next = 40;
              break;
            }

            if (!(notification.data.payload == AFFIRMATIVE)) {
              _context8.next = 36;
              break;
            }

            _context8.next = 34;
            return session.finish(true);

          case 34:
            _context8.next = 38;
            break;

          case 36:
            _context8.next = 38;
            return session.finish(false);

          case 38:
            _context8.next = 42;
            break;

          case 40:
            _context8.next = 42;
            return session.finish(true);

          case 42:
            _context8.next = 76;
            break;

          case 44:
            if (!(notification.data.text == BACK_BUTTON)) {
              _context8.next = 60;
              break;
            }

            len = path.length;
            // if at top of tree, end and return to main dialog

            if (!(len <= 1)) {
              _context8.next = 51;
              break;
            }

            _context8.next = 49;
            return session.finish(false);

          case 49:
            _context8.next = 58;
            break;

          case 51:
            // otherwise go to parent node
            newPath = path.slice(0, len - 2);
            parentMenuTree = (0, _loadMenuTree.getPath)(fullMenuTree, newPath);
            _context8.next = 55;
            return sendQuestionAndMenu(session, parentMenuTree);

          case 55:
            session.set({ path: newPath });
            _context8.next = 58;
            return session.save();

          case 58:
            _context8.next = 76;
            break;

          case 60:
            if (!(notification.data.text == START_BUTTON)) {
              _context8.next = 69;
              break;
            }

            _deepdialog.log.debug('restart path: %j', restartPath);
            _context8.next = 64;
            return sendQuestionAndMenu(session, restartMenuTree);

          case 64:
            session.set({ path: restartPath });
            _context8.next = 67;
            return session.save();

          case 67:
            _context8.next = 76;
            break;

          case 69:
            _context8.next = 71;
            return session.send({ text: _maindialog.UNRECOGNIZED_TEXT_RESPONSE });

          case 71:
            _context8.next = 73;
            return session.send({ text: _maindialog.CHOOSE_MENU_ITEM_RESPONSE });

          case 73:
            currentMenuTree = (0, _loadMenuTree.getPath)(fullMenuTree, path);
            _context8.next = 76;
            return sendQuestionAndMenu(session, currentMenuTree);

          case 76:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function (_x9, _x10) {
    return _ref9.apply(this, arguments);
  };
}());

// recovery handler not active yet - need changes to lib
MenuTreeDialog.onRecovery(function () {
  var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(session) {
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return session.send({
              text: _maindialog.UNRECOGNIZED_TEXT_RESPONSE });

          case 2:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function (_x11) {
    return _ref10.apply(this, arguments);
  };
}());

// after help dialog, repeat current text and menu options
MenuTreeDialog.onResult('MenuTreeDialog', 'help', function () {
  var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(session) {
    var versionName, path, fullMenuTree, currentMenuTree;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            versionName = session.get('versionName');
            path = session.get('path') || [];
            _context10.next = 4;
            return (0, _loadMenuTree.loadMenuTree)(versionName);

          case 4:
            fullMenuTree = _context10.sent;
            currentMenuTree = (0, _loadMenuTree.getPath)(fullMenuTree, path);
            _context10.next = 8;
            return sendQuestionAndMenu(session, currentMenuTree);

          case 8:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function (_x12) {
    return _ref11.apply(this, arguments);
  };
}());

// exit dialog when completed
MenuTreeDialog.onResult('MenuTreeDialog', 'dummy', function () {
  var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(session) {
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return session.finish(true);

          case 2:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function (_x13) {
    return _ref12.apply(this, arguments);
  };
}());function createResponseList(responseToUser) {
  var responseList = [];
  // if only a string is specified, create simple text response
  if ((0, _util.isString)(responseToUser)) {
    responseList[0] = { text: responseToUser };
  } else {
    // if not a string then expect a list
    for (var i in responseToUser) {
      // if list item is string then send simple text response
      if ((0, _util.isString)(responseToUser[i])) {
        responseList[i] = { text: responseToUser[i] };
      }
      // if not a string then check for different types of ojects - image w caption, image w/o caption, others to be added
      else if ('image' in responseToUser[i]) {
          // create image object
          responseList[i] = { type: 'image', mediaType: 'image', mediaUrl: responseToUser[i].image };
          // optionally add caption
          if (responseToUser[i].text) {
            responseList[i].text = responseToUser[i].text;
          }
          // add response types here with else if statements
        }
    }
  }
  // return list of objects
  return responseList;
}

// function to return required fields to create quick reply button
function makeButton(name) {
  return {
    type: 'reply',
    text: name,
    payload: name
  };
}

function hasMenu(response) {
  // check if its a string
  if ((0, _util.isString)(response)) return false;
  // look for menu in next level of menu tree
  if ('menu' in response) {
    return true;
  } else {
    return false;
  }
}