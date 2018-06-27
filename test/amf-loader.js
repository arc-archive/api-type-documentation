const AmfLoader = {};
AmfLoader.load = function(index) {
  index = index || 0;
  const url = location.protocol + '//' + location.host +
    location.pathname.substr(0, location.pathname.lastIndexOf('/'))
    .replace('/test', '/demo') + '/amf-model.json';
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
      const ns = ApiElements.Amf.ns;
      const d = data[0][ns.raml.vocabularies.document + 'declares'];
      resolve([data, d[index]]);
    });
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};
