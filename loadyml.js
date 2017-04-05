import {readFileSync} from 'fs';
import {safeLoad} from 'js-yaml';

function loadYML(fileName) {
  return safeLoad(readFileSync('./content/' + fileName, 'utf8'));
}

export {loadYML}
