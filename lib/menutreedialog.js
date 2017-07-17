'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MenuTreeDialog = undefined;

// function to send question and reply buttons based on menu tree
// if array, last element must be text: (not image) to allow sending quick reply buttons
let sendQuestionAndMenu = (() => {
  var _ref12 = _asyncToGenerator(function* (session, menuTree) {

    // build menu buttons - iterate over menu items and return array of action objects
    var replyButtons = [];
    for (const mi in menuTree.menu) {
      replyButtons.push(makeButton(mi));
    }
    // leave off back and to beginning buttons for completion questionaire
    if (session.get('versionName') != _maindialog.COMPLETION_QUESTIONAIRE) {
      replyButtons.push(makeButton(BACK_BUTTON));
      replyButtons.push(makeButton(START_BUTTON));
    }

    var responseList = [];
    responseList = createResponseList(menuTree.question);

    for (const i in responseList) {
      // if last element, add reply buttons
      if (i == responseList.length - 1) {
        // add replyButtons object to responseList[i] object and send
        responseList[i].actions = replyButtons;
      }
      yield session.send(responseList[i]);
      yield (0, _util2.sleep)(1000);
      // hack to await image loading on FB
      if (responseList[i].type == 'image') {
        yield (0, _util2.sleep)(3000);
      }
    }
  });

  return function sendQuestionAndMenu(_x14, _x15) {
    return _ref12.apply(this, arguments);
  };
})();

// function: return list of send objects given user response inputs specified in YML file


var _deepdialog = require('deepdialog');

var _util = require('util');

var _loadMenuTree = require('./loadMenuTree');

var _util2 = require('deepdialog/lib/util');

var _maindialog = require('./maindialog');

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

const BACK_BUTTON = 'Atrás';
const START_BUTTON = 'Volver al inicio';
const AFFIRMATIVE = 'Sí';

//const BACK_BUTTON='Back';
//const START_BUTTON='Start over';

const MenuTreeDialog = exports.MenuTreeDialog = new _deepdialog.Dialog({
  name: 'MenuTreeDialog',
  description: 'Traverse a YAML menu tree (in given question: menu: format)',
  handleUnwinding: false,
  allowUnwinding: true
});

MenuTreeDialog.onStart((() => {
  var _ref = _asyncToGenerator(function* (session, { versionName, path }) {
    _deepdialog.log.info('Started MenuTreeDialog');

    var fullMenuTree = yield (0, _loadMenuTree.loadMenuTree)(versionName, path);
    var menuTree = (0, _loadMenuTree.getPath)(fullMenuTree, path);

    if (menuTree) {
      yield sendQuestionAndMenu(session, menuTree);
    } else {
      yield session.finish(false);
    }
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());

// exit
MenuTreeDialog.onText('exit', (() => {
  var _ref2 = _asyncToGenerator(function* (session) {
    yield session.finish();
  });

  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
})());

// text matching for help
MenuTreeDialog.onText('ayuda', (() => {
  var _ref3 = _asyncToGenerator(function* (session) {
    yield session.start('MenuTreeDialog', 'help', { versionName: _maindialog.HELP_MENU_TREE });
  });

  return function (_x4) {
    return _ref3.apply(this, arguments);
  };
})());
MenuTreeDialog.onText('Ayuda', (() => {
  var _ref4 = _asyncToGenerator(function* (session) {
    yield session.start('MenuTreeDialog', 'help', { versionName: _maindialog.HELP_MENU_TREE });
  });

  return function (_x5) {
    return _ref4.apply(this, arguments);
  };
})());
MenuTreeDialog.onText('no lo entiendo', (() => {
  var _ref5 = _asyncToGenerator(function* (session) {
    yield session.start('MenuTreeDialog', 'help', { versionName: _maindialog.HELP_MENU_TREE });
  });

  return function (_x6) {
    return _ref5.apply(this, arguments);
  };
})());
MenuTreeDialog.onIntent('help', (() => {
  var _ref6 = _asyncToGenerator(function* (session) {
    yield session.start('MenuTreeDialog', 'help', { versionName: _maindialog.HELP_MENU_TREE });
  });

  return function (_x7) {
    return _ref6.apply(this, arguments);
  };
})());

MenuTreeDialog.onIntent('image_input', (() => {
  var _ref7 = _asyncToGenerator(function* (session) {
    yield session.send({ text: _maindialog.UNRECOGNIZED_IMAGE_RESPONSE });
  });

  return function (_x8) {
    return _ref7.apply(this, arguments);
  };
})());

// handle response for any payload for menu item selections
MenuTreeDialog.onPayload(_deepdialog.any, (() => {
  var _ref8 = _asyncToGenerator(function* (session, notification) {
    //
    // retrieve menu tree traversed thus far
    // point to next level of menu, given user response
    // note: response can be a string (if there are no more menu items) or a menu tree subsection
    //
    var versionName = session.get('versionName');
    var path = session.get('path') || [];
    var fullMenuTree = yield (0, _loadMenuTree.loadMenuTree)(versionName);
    var newPath = [...path, 'menu', notification.data.payload];
    var responseToUser = (0, _loadMenuTree.getPath)(fullMenuTree, newPath);
    var restartPath = [];
    var restartMenuTree = (0, _loadMenuTree.getPath)(fullMenuTree, restartPath);

    //
    // check if menu reponse is in list of defined items
    //
    if (responseToUser != undefined) {
      //
      // if response is an object with another menu then create another message with that menu
      // else send messages and exit
      //
      if (hasMenu(responseToUser)) {
        session.set({ path: newPath });
        yield session.save();
        var childMenuTree = (0, _loadMenuTree.getPath)(fullMenuTree, newPath);
        yield sendQuestionAndMenu(session, childMenuTree);
      } else {

        var responseList = [];
        responseList = createResponseList(responseToUser);
        for (const i in responseList) {
          yield session.send(responseList[i]);
          yield (0, _util2.sleep)(1000);
        }

        //
        // check if menutree is completion dialog
        //
        if (versionName == _maindialog.COMPLETION_QUESTIONAIRE) {
          if (notification.data.payload == AFFIRMATIVE) {
            yield session.finish(true);
          } else {
            yield session.finish(false);
          }
        } else {
          yield session.finish(true);
        }
      }
    } else {
      //
      // temporary recovery handler - recovery handler not active yet
      // if not recognized input from user, re-send prior message
      //
      // Check for Navigation buttons: back (up one level) or start (go to beginning)
      //
      if (notification.data.text == BACK_BUTTON) {
        var len = path.length;
        // if at top of tree, end and return to main dialog
        if (len <= 1) {
          yield session.finish(false);
        } else {
          // otherwise go to parent node
          newPath = path.slice(0, len - 2);
          var parentMenuTree = (0, _loadMenuTree.getPath)(fullMenuTree, newPath);
          yield sendQuestionAndMenu(session, parentMenuTree);
          session.set({ path: newPath });
          yield session.save();
        }
      } else if (notification.data.text == START_BUTTON) {
        _deepdialog.log.debug('restart path: %j', restartPath);
        yield sendQuestionAndMenu(session, restartMenuTree);
        session.set({ path: restartPath });
        yield session.save();
      } else {
        yield session.send({ text: _maindialog.UNRECOGNIZED_TEXT_RESPONSE });
        yield session.send({ text: _maindialog.CHOOSE_MENU_ITEM_RESPONSE });
        var currentMenuTree = (0, _loadMenuTree.getPath)(fullMenuTree, path);
        yield sendQuestionAndMenu(session, currentMenuTree);
      }
    }
  });

  return function (_x9, _x10) {
    return _ref8.apply(this, arguments);
  };
})());

// recovery handler not active yet - need changes to lib
MenuTreeDialog.onRecovery((() => {
  var _ref9 = _asyncToGenerator(function* (session) {
    yield session.send({
      text: _maindialog.UNRECOGNIZED_TEXT_RESPONSE });
  });

  return function (_x11) {
    return _ref9.apply(this, arguments);
  };
})());

// after help dialog, repeat current text and menu options
MenuTreeDialog.onResult('MenuTreeDialog', 'help', (() => {
  var _ref10 = _asyncToGenerator(function* (session) {
    var versionName = session.get('versionName');
    var path = session.get('path') || [];
    var fullMenuTree = yield (0, _loadMenuTree.loadMenuTree)(versionName);
    var currentMenuTree = (0, _loadMenuTree.getPath)(fullMenuTree, path);
    yield sendQuestionAndMenu(session, currentMenuTree);
  });

  return function (_x12) {
    return _ref10.apply(this, arguments);
  };
})());

// exit dialog when completed
MenuTreeDialog.onResult('MenuTreeDialog', 'dummy', (() => {
  var _ref11 = _asyncToGenerator(function* (session) {
    yield session.finish(true);
  });

  return function (_x13) {
    return _ref11.apply(this, arguments);
  };
})());function createResponseList(responseToUser) {
  var responseList = [];
  // if only a string is specified, create simple text response
  if ((0, _util.isString)(responseToUser)) {
    responseList[0] = { text: responseToUser };
  } else {
    // if not a string then expect a list
    for (const i in responseToUser) {
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