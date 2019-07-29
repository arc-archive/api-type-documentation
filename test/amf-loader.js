import {ns} from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
export const AmfLoader = {};
AmfLoader.load = async function(index, compact) {
  index = index || 0;
  const file = '/demo-api' + (compact ? '-compact' : '') + '.json';
  const url = location.protocol + '//' + location.host + '/base/demo/' + file;
  /* global Promise */
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      let data;
      try {
        data = JSON.parse(e.target.response);
        /* istanbul ignore next */
      } catch (e) {
        /* istanbul ignore next */
        console.log(e.target.response);
        /* istanbul ignore next */
        reject(e);
        /* istanbul ignore next */
        return;
      }
      const original = data;
      /* istanbul ignore else */
      if (data instanceof Array) {
        data = data[0];
      }
      const decKey = compact ? 'doc:declares' :
        ns.raml.vocabularies.document + 'declares';
      let declares = data[decKey];
      /* istanbul ignore next */
      if (!(declares instanceof Array)) {
        declares = [declares];
      }
      resolve([original, declares[index]]);
    });
    /* istanbul ignore next */
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};
