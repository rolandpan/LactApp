import {safeLoad} from 'js-yaml';
import Promise from 'bluebird';
var fs = Promise.promisifyAll(require('fs'));


export async function loadMenuTree(versionName) {
  return await loadYML(`${versionName}.yml`);
}

export function getPath(obj, path) {
  if (obj) {
    if (path && path.length>0) {
      var [head,...tail] = path;
      var child = obj[head];
      return getPath(child, tail);
    } else {
      return obj;
    }
  }
}

async function loadYML(fileName) {
  return safeLoad(await fs.readFileAsync('./content/' + fileName, 'utf8'));
}
