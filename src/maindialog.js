//
// LactBot
// - onboard to LactApp
//
// Main Dialog
//
// This is the dialog that gets control when your bot starts a new
// session with a user
//
// Old dd node client hash: 9ec8b0b3c16a190ffbf72b9ca8c5ddb791549472
//

import {Dialog, NLPModel,log} from 'deepdialog';

//
// Two channels one for english language one for spanish Language
// Each has corresponding smooch app
//
export const CHANNEL_ID = {spanish:'EXqZgbnqb5Bf2D9Z9P5Gn8',english:'2vsYq19wkHW1Yoeon9AwBt'};
export const CURRENT_VERSION={spanish:'2017-11-20-main',english:'2018-02-06-main-eng'};
export const COMPLETION_QUESTIONAIRE={spanish:'2017-11-13-completion',english:'2018-01-06-completion-eng'};
export const HELP_MENU_TREE = {spanish:'2017-06-29-help',english:'2017-11-03-help-eng'};
export const DEMO_VERSION='2017-06-02-lact-demo-eng';
export const RESTART_PATH = {spanish:['menu','¡Entendido!','menu','Vale, cuéntame','menu','Ok'],english:['menu','Understood','menu','Sure, tell me','menu','Ok']};
export const IMAGE_RESPONSE = {spanish:'Muy Bien!', english:'Cool!'};
export const UNRECOGNIZED_IMAGE_RESPONSE = {spanish:`Lo siento.  🙈 Aun estoy aprendindo a reconocer iconos e imágenes... mientras tanto será mejor que uses texto`,english:'So sorry, I am still working on understanding icons and images. For now please use text.'};
export const UNRECOGNIZED_TEXT_RESPONSE = {spanish:`Lo siento 😐 no te he entendido`,english:'Sorry, I did not understand'};
export const CHOOSE_MENU_ITEM_RESPONSE = {spanish:`Por favor. Escoge una opción del menú`,english:'Please choose a menu option'};

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
  await setLanguage(session);
  await session.start('MenuTreeDialog', 'current', {versionName: CURRENT_VERSION[session.globals.Language]});
});

MainDialog.onResult('MenuTreeDialog', 'current', async function(session) {
  await setLanguage(session);
  await session.start('MenuTreeDialog', 'completion_questionaire', {versionName: COMPLETION_QUESTIONAIRE[session.globals.Language]} );
});

MainDialog.onResult('MenuTreeDialog', 'completion_questionaire', async function(session, result) {
  await setLanguage(session);
  if (result) await session.start('MenuTreeDialog', 'current', {versionName: CURRENT_VERSION[session.globals.Language], path: RESTART_PATH[session.globals.Language]});
});

//
// Basic intent handlers
//
MainDialog.onIntent('image_input', async function (session, {entities}, {message}) {
  await setLanguage(session);
  if (imageHandler(session, message)) {
    await session.send(IMAGE_RESPONSE[session.globals.Language]);
  }
  else {
    await session.send({text: UNRECOGNIZED_IMAGE_RESPONSE[session.globals.Language]});
  }
});

MainDialog.onText('reset', async function(session) {
  await session.reset();
  await session.start('MenuTreeDialog', 'current', {versionName: CURRENT_VERSION[session.globals.Language]});
});

MainDialog.onRecovery(async function (session) {
  await setLanguage(session);
  await session.start('MenuTreeDialog', 'current', {versionName: CURRENT_VERSION[session.globals.Language]});
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

export async function setLanguage(session) {
  if (session.channel.id == CHANNEL_ID.english) {
    await session.set('Language',"english");
  }
  else {
    await session.set('Language',"spanish");
  }
  await session.save();
}
