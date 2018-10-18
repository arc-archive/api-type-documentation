const generator = require('@api-components/api-model-generator');

const files = new Map();
files.set('demo-api/demo-api.raml', 'RAML 1.0');
files.set('uber/uber.json', 'OAS 2.0');

generator(files)
.then(() => console.log('Finito'));
