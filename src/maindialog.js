//
// LactBot
// - onboard to LactApp
//
// Main Dialog
//
// This is the dialog that gets control when your bot starts a new
// session with a user
//
//

import {Dialog, NLPModel,log} from 'deepdialog';

export const CURRENT_VERSION='2017-11-13-main';
export const COMPLETION_QUESTIONAIRE='2017-11-13-completion';
export const HELP_MENU_TREE = '2017-06-29-help';
export const DEMO_VERSION='2017-06-02-lact-demo-eng';
export const RESTART_PATH = ['menu','¡Entendido!','menu','Vale, cuéntame','menu','Ok'];
export const UNRECOGNIZED_IMAGE_RESPONSE = `Lo siento.  🙈 Aun estoy aprendindo a reconocer iconos e imágenes... mientras tanto será mejor que uses texto`;
export const UNRECOGNIZED_TEXT_RESPONSE = `Lo siento 😐 no te he entendido`;
export const CHOOSE_MENU_ITEM_RESPONSE = `Por favor. Escoge una opción del menú`;

export const MainNLP = new NLPModel({
  name: 'MainNLP',
  provider:'apiai',
  accessToken: process.env.APIAI_ACCESSKEY_SECRET
});

export const MainDialog = new Dialog({
  name: 'MainDialog',
  description: 'The top level dialog of your bot'
});

MainDialog.nlpModelName = 'MainNLP';

MainDialog.onStart(async function (session) {
  await session.start('MenuTreeDialog', 'current', {versionName: CURRENT_VERSION});
});

MainDialog.onText('Empezar', async function(session) {
  await session.start('MenuTreeDialog', 'current', {versionName: CURRENT_VERSION});
});

MainDialog.onText('Hello', async function(session) {
  await session.start('MenuTreeDialog', 'current', {versionName: DEMO_VERSION});
});

MainDialog.onResult('MenuTreeDialog', 'current', async function(session) {
  await session.start('MenuTreeDialog', 'completion_questionaire', {versionName: COMPLETION_QUESTIONAIRE} );
});

MainDialog.onResult('MenuTreeDialog', 'completion_questionaire', async function(session, result) {
  if (result) await session.start('MenuTreeDialog', 'current', {versionName: CURRENT_VERSION, path: RESTART_PATH});
});

//
// Basic intent handlers
//
MainDialog.onIntent('image_input', async function (session, {entities}, {message}) {
  if (imageHandler(session, message)) {
    await session.send('Bueno!');
  }
  else {
    await session.send({text: UNRECOGNIZED_IMAGE_RESPONSE});
  }
});

MainDialog.onRecovery(async function (session) {
  await session.start('MenuTreeDialog', 'current', {versionName: CURRENT_VERSION});
});

function imageHandler(session, message) {
  //
  // thumbs up icons
  //
  var thumbsUp =
    [
      'https://scontent.xx.fbcdn.net/v/t39.1997-6/851557_369239266556155_759568595_n.png?_nc_ad=z-m&oh=65f8806bcfe45834eb50b60f51cb352d&oe=596142DC',
      'add thumbs up urls here'
    ];

  if (thumbsUp.indexOf(message.text) > -1 ) {
    return true;
  }
  else {
    return false;
  }
}
