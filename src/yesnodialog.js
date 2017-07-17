import {Dialog, log} from 'deepdialog';
import {MainNLP,imageHandler} from './maindialog';

export const YesNoDialog = new Dialog({
  name: 'YesNoDialog',
  description: 'Ask yes or no question, use NLP to handle message - return Yes or No'
});

YesNoDialog.nlpModelName = 'MainNLP';

YesNoDialog.onIntent('yesno_affirmative', async function (session) {
  session.finish('Yes');
});

YesNoDialog.onIntent('yesno_negative', async function (session) {
  session.finish('No');
});

YesNoDialog.onIntent('image_input', async function (session, {entities}, {message}) {
  if (imageHandler(session,message)) {
    session.finish('Yes');
  }
  else {
    await session.send({text: `I\'m so sorry, but I\'m still working on recognizing stickers and images...until I figure it out please use text to speak with me.`});
  }
});

YesNoDialog.onRecovery(async function (session, message) {
  await session.send({text: `I\'m very sorry, I didn\'t understand "${message.text}".`});
});
