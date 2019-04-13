import {ns} from '../../../@api-components/amf-helper-mixin/amf-helper-mixin.js';
export const AmfLoader = {};
AmfLoader.load = function(index, compact) {
  index = index || 0;
  const file = '/demo-api' + (compact ? '-compact' : '') + '.json';
  const url = location.protocol + '//' + location.host +
    location.pathname.substr(0, location.pathname.lastIndexOf('/'))
    .replace('/test', '/demo') + file;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      let data;
      try {
        data = JSON.parse(e.target.response);
      } catch (e) {
        console.log(e.target.response);
        reject(e);
        return;
      }
      const original = data;
      if (data instanceof Array) {
        data = data[0];
      }
      const decKey = compact ? 'doc:declares' :
        ns.raml.vocabularies.document + 'declares';
      let declares = data[decKey];
      if (!(declares instanceof Array)) {
        declares = [declares];
      }
      resolve([original, declares[index]]);
    });
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};
