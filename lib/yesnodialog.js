'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YesNoDialog = undefined;

var _deepdialog = require('deepdialog');

var _maindialog = require('./maindialog');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const YesNoDialog = exports.YesNoDialog = new _deepdialog.Dialog({
  name: 'YesNoDialog',
  description: 'Ask yes or no question, use NLP to handle message - return Yes or No'
});

YesNoDialog.nlpModelName = 'MainNLP';

YesNoDialog.onIntent('yesno_affirmative', (() => {
  var _ref = _asyncToGenerator(function* (session) {
    session.finish('Yes');
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());

YesNoDialog.onIntent('yesno_negative', (() => {
  var _ref2 = _asyncToGenerator(function* (session) {
    session.finish('No');
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
})());

YesNoDialog.onIntent('image_input', (() => {
  var _ref3 = _asyncToGenerator(function* (session, { entities }, { message }) {
    if ((0, _maindialog.imageHandler)(session, message)) {
      session.finish('Yes');
    } else {
      yield session.send({ text: `I\'m so sorry, but I\'m still working on recognizing stickers and images...until I figure it out please use text to speak with me.` });
    }
  });

  return function (_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
})());

YesNoDialog.onRecovery((() => {
  var _ref4 = _asyncToGenerator(function* (session, message) {
    yield session.send({ text: `I\'m very sorry, I didn\'t understand "${message.text}".` });
  });

  return function (_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
})());