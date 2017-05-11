//
// MenuTreeDialog:
// recursively traverse a questionaire passed as arg (with given, expected YML format)
// Expected format of menuTree
//   question: '....'
//   menu:
//     menuitem1: '...'
//     menuitem2:
//        question: '...'
//        menu:
//          etc.
//
import {Dialog, any, log} from 'deepdialog';
import {isString} from 'util';
import {loadMenuTree, getPath} from './loadMenuTree';

export const MenuTreeDialog = new Dialog({
  name: 'MenuTreeDialog',
  description: 'Recursively traverse a YAML menu tree (in given question: menu: format)',
  handleUnwinding: false,
  allowUnwinding: true
});

MenuTreeDialog.onStart(async function (session, {versionName, path}) {
  log.info('Started MenuTreeDialog');

  var fullMenuTree = await loadMenuTree(versionName, path);
  var menuTree = getPath(fullMenuTree, path);

  if (menuTree) {
    await sendQuestionAndMenu(session, menuTree);
  }
  else {
    await session.finish(false);
  }

});


MenuTreeDialog.onText('exit', async function (session) {
  await session.finish();
});

MenuTreeDialog.onIntent('thank_you', async function (session) {
  await session.send({text: 'You\'re welcome!  Have a great day!'});
});

MenuTreeDialog.onIntent('image_input', async function (session) {
  await session.send({text: `I\'m so sorry, but I\'m still working on recognizing stickers and images...until I figure it out please use text to speak with me.`});
});

// handle response for any payload for menu item selections
MenuTreeDialog.onPayload( any, async function (session, notification) {
  //
  // retrieve menu tree traversed thus far
  // point to next level of menu, given user response
  // note: response can be a string (if there are no more menu items) or a menu tree subsection
  //
  var versionName = session.get('versionName');
  var path = session.get('path');
  var fullMenuTree = await loadMenuTree(versionName);
  var newPath = [...path, notification.data.payload];
  var responseToUser = getPath(fullMenuTree, newPath);

  //
  // check if menu reponse is in list of defined items
  //
  if (responseToUser != undefined) {
  //
  // if response is an object with another menu then start another dialog with that menu
  // else send messages and exit
  //
    if ( hasMenu(responseToUser)) {
      await session.start('MenuTreeDialog', 'dummy',{versionName: versionName, path: newPath} );
    }
    else {
      // check if response should be sent as one message or multiple messages
      if (isString(responseToUser)) {
        await session.send({text: responseToUser} );
      }
      else {
        for (const i in responseToUser)
          await session.send({text: responseToUser[i]});
      }
      await session.finish(true);
    }
  }
  else {
    //
    // temporary recovery handler - recovery handler not active yet
    // re-send prior message
    //
    await session.send({text: `I'm very sorry, I didn't understand "${notification.data.text}".  Please choose a menu item.`});
    var currentMenuTree = getPath(fullMenuTree, path);
    await sendQuestionAndMenu(session, currentMenuTree);
  }

});

// recovery handler not active yet - need changes to lib
MenuTreeDialog.onRecovery(async function (session, message) {
  await session.send({
    text: `I'm very sorry, I didn't understand "${message.text}"`});
});

// exit dialog when completed
MenuTreeDialog.onResult('MenuTreeDialog', 'dummy', async function (session) {
  await session.finish(true);
});


// function to send question and reply buttons based on menu tree
async function sendQuestionAndMenu(session, menuTree) {

  // build menu buttons - iterate over menu items and return array of action objects
  var replyButtons = [];
  for (const mi in menuTree.menu) {
    replyButtons.push(makeButton(mi, menuTree.menu[mi]));
  }

  // send question text and menus to user
  await session.send( {
    text: menuTree.question,
    actions: replyButtons
  } );
}



// function to return required fields to create quick reply button
function makeButton( name ) {
  return {
    type: 'reply',
    text: name,
    payload: name
  };
}

function hasMenu( response ) {
  // check if its a string
  if (isString(response))
    return false;
  // look for menu in next level of menu tree
  if ('menu' in response) {
    return true;
  } else {
    return false;
  }
}
