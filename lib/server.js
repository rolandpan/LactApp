'use strict';

require('./loadenv');

var _deepdialog = require('deepdialog');

var _maindialog = require('./maindialog');

var _menutreedialog = require('./menutreedialog');

var _yesnodialog = require('./yesnodialog');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//import {PromptDialog} from './promptdialog';

//import {OnboardDialog} from './onboarddialog';


_deepdialog.log.level = process.env.LOGGER_LEVEL || 'info';

_deepdialog.log.info('appId: %s appSecret: %s host: %s', process.env.DEEPDIALOG_APPID, process.env.DEEPDIALOG_APPSECRET ? `${process.env.DEEPDIALOG_APPSECRET.slice(0, 5)}...` : undefined, process.env.HOSTNAME);

var app = new _deepdialog.App({
  appId: process.env.DEEPDIALOG_APPID,
  appSecret: process.env.DEEPDIALOG_APPSECRET,
  hostURL: process.env.HOST_URL,
  mainDialog: 'MainDialog',
  deepDialogServer: process.env.DEEPDIALOG_SERVER_URL,
  automaticTypingState: true
});

process.on('unhandledRejection', function (e) {
  _deepdialog.log.error(e);
});

app.addNLPModels(_maindialog.MainNLP);
app.addDialogs(_maindialog.MainDialog, _menutreedialog.MenuTreeDialog, _yesnodialog.YesNoDialog);
app.server.start(process.env.PORT, _asyncToGenerator(function* () {
  _deepdialog.log.info('Bot started');
  yield app.save();
}));