//
// Main Dialog
//
// This is the dialog that gets control when your bot starts a new
// session with a user
//

import {Dialog, NLPModel,log} from 'deepdialog';

const CURRENT_VERSION='2017-04-10';

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
  await session.send("Hi, I'm test LactApp bot.  Please type Start.");
  //await session.send("Would you like to start?");
  //await session.start('YesNoDialog', 'startmenutree');
});

MainDialog.onText('Start', async function(session) {
  await session.start('MenuTreeDialog', 'maindailog', {versionName: CURRENT_VERSION});
});

MainDialog.onResult('YesNoDialog', 'startmenutree', async function(session, answer) {
  if (answer == 'Yes') {
    log.debug('got here');
    await session.start('MenuTreeDialog', 'maindailog', {versionName: CURRENT_VERSION});
  }
  else {
    session.send('Ok.  If you want to start, just type Yes.');
  }
});
//
// Basic intent handlers
//
MainDialog.onIntent('image_input', async function (session, {entities}, {message}) {
  if (imageHandler(session, message)) {
    await session.send('Thumbs up to you too!');
  }
  else {
    await session.send({text: `I\'m so sorry, but I\'m still working on recognizing stickers and images...until I figure it out its best to use text with me.`});
  }
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

MainDialog.onIntent('help', async function (session) {
  await session.send('I am in development.  Type Start to begin.');
});
