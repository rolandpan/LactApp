//
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
import {Dialog, any, log} from 'deepdialog';
import {isString} from 'util';
import {loadMenuTree, getPath} from './loadMenuTree';
import {sleep} from 'deepdialog/lib/util';
import {setLanguage} from './maindialog';
import {COMPLETION_QUESTIONAIRE} from './maindialog';
import {UNRECOGNIZED_IMAGE_RESPONSE} from './maindialog';
import {UNRECOGNIZED_TEXT_RESPONSE} from './maindialog';
import {CHOOSE_MENU_ITEM_RESPONSE} from './maindialog';
import {HELP_MENU_TREE} from './maindialog';
//import {RESTART_PATH} from './maindialog';

const BACK_BUTTON={spanish:'Atrás',english:'Go back'};
const START_BUTTON={spanish:'Volver al inicio',english:'Start over'};
const AFFIRMATIVE={spanish:'Sí',english:'Yes'};

//const BACK_BUTTON='Back';
//const START_BUTTON='Start over';

export const MenuTreeDialog = new Dialog({
  name: 'MenuTreeDialog',
  description: 'Traverse a YAML menu tree (in given question: menu: format)',
  handleUnwinding: false,
  allowUnwinding: true
});

MenuTreeDialog.onStart(async function (session, {versionName, path}) {

  log.info('Started MenuTreeDialog, versionName: %j', versionName);

  var fullMenuTree = await loadMenuTree(versionName, path);
  var menuTree = getPath(fullMenuTree, path);

  if (menuTree) {
    await sendQuestionAndMenu(session, menuTree);
  }
  else {
    await session.finish(false);
  }

});

// exit
MenuTreeDialog.onText('exit', async function (session) {
  await session.finish(false);
});

MenuTreeDialog.onText('reset', async function (session) {
  await session.reset();
});


// text matching for help
MenuTreeDialog.onText('ayuda', async function (session) {
  await setLanguage(session);
  await session.start('MenuTreeDialog', 'help', {versionName: HELP_MENU_TREE[session.globals.Language]});
});
MenuTreeDialog.onText('Ayuda', async function (session) {
  await setLanguage(session);
  await session.start('MenuTreeDialog', 'help', {versionName: HELP_MENU_TREE[session.globals.Language]});
});
MenuTreeDialog.onText('no lo entiendo', async function (session) {
  await setLanguage(session);
  await session.start('MenuTreeDialog', 'help', {versionName: HELP_MENU_TREE[session.globals.Language]});
});
MenuTreeDialog.onText('help', async function (session) {
  await setLanguage(session);
  await session.start('MenuTreeDialog', 'help', {versionName: HELP_MENU_TREE[session.globals.Language]});
});
MenuTreeDialog.onText('Help', async function (session) {
  await setLanguage(session);
  await session.start('MenuTreeDialog', 'help', {versionName: HELP_MENU_TREE[session.globals.Language]});
});
MenuTreeDialog.onIntent('help', async function (session) {
  await setLanguage(session);
  await session.start('MenuTreeDialog', 'help', {versionName: HELP_MENU_TREE[session.globals.Language]});
});

MenuTreeDialog.onIntent('image_input', async function (session) {
  await setLanguage(session);
  await session.send({text: UNRECOGNIZED_IMAGE_RESPONSE[session.globals.Language]});
});

// handle response for any payload for menu item selections
MenuTreeDialog.onPayload( any, async function (session, notification) {
  //
  // retrieve menu tree traversed thus far
  // point to next level of menu, given user response
  // note: response can be a string (if there are no more menu items) or a menu tree subsection
  //
  var versionName = session.get('versionName');
  var path = session.get('path') || [];
  var fullMenuTree = await loadMenuTree(versionName);
  var newPath = [...path, 'menu', notification.data.payload];
  var responseToUser = getPath(fullMenuTree, newPath);
  var restartPath = [];
  var restartMenuTree = getPath(fullMenuTree, restartPath);

  //
  // make sure Language is set
  //
  await setLanguage(session);

  //
  // check if menu reponse is in list of defined items
  //
  if (responseToUser != undefined) {
    //
    // if response is an object with another menu then create another message with that menu
    // else send messages and exit
    //
    if ( hasMenu(responseToUser)) {
      session.set({path: newPath});
      await session.save();
      var childMenuTree = getPath(fullMenuTree, newPath);
      await sendQuestionAndMenu(session, childMenuTree);
    }
    else {

      var responseList = [];
      responseList = createResponseList(responseToUser);
      for (const i in responseList) {
        await session.send(responseList[i]);
        await sleep(1000);
      }

      //
      // check if menutree is completion dialog
      //
      if (versionName == COMPLETION_QUESTIONAIRE[session.globals.Language]) {
        if (notification.data.payload == AFFIRMATIVE[session.globals.Language]) {
          await session.finish(true);
        }
        else {
          await session.finish(false);
        }
      }
      else {
        await session.finish(true);
      }

    }
  }
  else {
    //
    // temporary recovery handler - recovery handler not active yet
    // if not recognized input from user, re-send prior message
    //
    // Check for Navigation buttons: back (up one level) or start (go to beginning)
    //
    if (notification.data.text == BACK_BUTTON[session.globals.Language]) {
      var len = path.length;
      // if at top of tree, end and return to main dialog
      if (len <= 1) {
        await session.finish(true);
      }
      else {
        // otherwise go to parent node
        newPath = path.slice(0,len-2);
        var parentMenuTree = getPath(fullMenuTree, newPath);
        await sendQuestionAndMenu(session, parentMenuTree);
        session.set({path: newPath});
        await session.save();
      }
    }
    else if (notification.data.text == START_BUTTON[session.globals.Language]) {
      await session.finish(false);
      // log.debug('restart path: %j', restartPath );
      // await sendQuestionAndMenu(session, restartMenuTree);
      // session.set({path: restartPath});
      // await session.save();
    }
    else {
      await session.send({text: UNRECOGNIZED_TEXT_RESPONSE[session.globals.Language]});
      await session.send({text: CHOOSE_MENU_ITEM_RESPONSE[session.globals.Language]});
      var currentMenuTree = getPath(fullMenuTree, path);
      await sendQuestionAndMenu(session, currentMenuTree);
    }
  }

});

// recovery handler not active yet - need changes to lib
MenuTreeDialog.onRecovery(async function (session) {
  await setLanguage(session);
  await session.send({
    text: UNRECOGNIZED_TEXT_RESPONSE[session.globals.Language]});
});


// after help dialog, repeat current text and menu options
MenuTreeDialog.onResult('MenuTreeDialog', 'help', async function (session) {
  var versionName = session.get('versionName');
  var path = session.get('path') || [];
  var fullMenuTree = await loadMenuTree(versionName);
  var currentMenuTree = getPath(fullMenuTree, path);
  await sendQuestionAndMenu(session, currentMenuTree);
});


// exit dialog when completed
MenuTreeDialog.onResult('MenuTreeDialog', 'dummy', async function (session) {
  await session.finish(true);
});


// function to send question and reply buttons based on menu tree
// if array, last element must be text: (not image) to allow sending quick reply buttons
async function sendQuestionAndMenu(session, menuTree) {

  // build menu buttons - iterate over menu items and return array of action objects
  var replyButtons = [];
  for (const mi in menuTree.menu) {
    replyButtons.push(makeButton(mi));
  }
  // leave off back and to beginning buttons for completion questionaire
  if (session.get('versionName') != COMPLETION_QUESTIONAIRE[session.globals.Language]) {
    replyButtons.push(makeButton(BACK_BUTTON[session.globals.Language]));
    replyButtons.push(makeButton(START_BUTTON[session.globals.Language]));
  }

  var responseList = [];
  responseList = createResponseList(menuTree.question);

  for (const i in responseList) {
    // if last element, add reply buttons
    if (i == responseList.length - 1) {
      // add replyButtons object to responseList[i] object and send
      responseList[i].actions = replyButtons;
    }
    await session.send(responseList[i]);
    await sleep(1000);
    // hack to await image loading on FB
    if (responseList[i].type == 'image') {
      await sleep(3000);
    }
  }

}


// function: return list of send objects given user response inputs specified in YML file
function createResponseList(responseToUser) {
  var responseList = [];
  // if only a string is specified, create simple text response
  if (isString(responseToUser)) {
    responseList[0] = {text: responseToUser};
  }
  else {
    // if not a string then expect a list
    for (const i in responseToUser) {
      // if list item is string then send simple text response
      if (isString(responseToUser[i])) {
        responseList[i] = {text: responseToUser[i]};
      }
      // if not a string then check for different types of ojects - image w caption, image w/o caption, others to be added
      else if ('image' in responseToUser[i]) {
        // create image object
        responseList[i] = {type: 'image', mediaType: 'image', mediaUrl: responseToUser[i].image};
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
