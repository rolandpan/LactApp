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

const CURRENT_VERSION = exports.CURRENT_VERSION = '2017-06-29-main';
const COMPLETION_QUESTIONAIRE = exports.COMPLETION_QUESTIONAIRE = '2017-05-26-completion';
const HELP_MENU_TREE = exports.HELP_MENU_TREE = '2017-06-29-help';
const DEMO_VERSION = exports.DEMO_VERSION = '2017-06-02-lact-demo-eng';
const RESTART_PATH = exports.RESTART_PATH = ['menu', '¡Entendido!', 'menu', 'Vale, cuéntame', 'menu', 'Ok'];
const UNRECOGNIZED_IMAGE_RESPONSE = exports.UNRECOGNIZED_IMAGE_RESPONSE = `Lo siento.  🙈 Aun estoy aprendindo a reconocer iconos e imágenes... mientras tanto será mejor que uses texto`;
const UNRECOGNIZED_TEXT_RESPONSE = exports.UNRECOGNIZED_TEXT_RESPONSE = `Lo siento 😐 no te he entendido`;
const CHOOSE_MENU_ITEM_RESPONSE = exports.CHOOSE_MENU_ITEM_RESPONSE = `Por favor. Escoge una opción del menú`;

const MainNLP = exports.MainNLP = new _deepdialog.NLPModel({
  name: 'MainNLP',
  provider: 'apiai',
  accessToken: process.env.APIAI_ACCESSKEY_SECRET
});

const MainDialog = exports.MainDialog = new _deepdialog.Dialog({
  name: 'MainDialog',
  description: 'The top level dialog of your bot'
});

MainDialog.nlpModelName = 'MainNLP';

MainDialog.onStart((() => {
  var _ref = _asyncToGenerator(function* (session) {
    yield session.start('MenuTreeDialog', 'current', { versionName: CURRENT_VERSION });
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());

MainDialog.onText('Empezar', (() => {
  var _ref2 = _asyncToGenerator(function* (session) {
    yield session.start('MenuTreeDialog', 'current', { versionName: CURRENT_VERSION });
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
})());

MainDialog.onText('Hello', (() => {
  var _ref3 = _asyncToGenerator(function* (session) {
    yield session.start('MenuTreeDialog', 'current', { versionName: DEMO_VERSION });
  });

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
})());

MainDialog.onResult('MenuTreeDialog', 'current', (() => {
  var _ref4 = _asyncToGenerator(function* (session) {
    yield session.start('MenuTreeDialog', 'completion_questionaire', { versionName: COMPLETION_QUESTIONAIRE });
  });

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
})());

MainDialog.onResult('MenuTreeDialog', 'completion_questionaire', (() => {
  var _ref5 = _asyncToGenerator(function* (session, result) {
    if (result) yield session.start('MenuTreeDialog', 'current', { versionName: CURRENT_VERSION, path: RESTART_PATH });
  });

  return function (_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
})());

//
// Basic intent handlers
//
MainDialog.onIntent('image_input', (() => {
  var _ref6 = _asyncToGenerator(function* (session, { entities }, { message }) {
    if (imageHandler(session, message)) {
      yield session.send('Bueno!');
    } else {
      yield session.send({ text: UNRECOGNIZED_IMAGE_RESPONSE });
    }
  });

  return function (_x7, _x8, _x9) {
    return _ref6.apply(this, arguments);
  };
})());

MainDialog.onRecovery((() => {
  var _ref7 = _asyncToGenerator(function* (session) {
    yield session.start('MenuTreeDialog', 'current', { versionName: CURRENT_VERSION });
  });

  return function (_x10) {
    return _ref7.apply(this, arguments);
  };
})());

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