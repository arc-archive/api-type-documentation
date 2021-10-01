# DEPRECATED

This component is being deprecated. The code base has been moved to [api-documentation](https://github.com/advanced-rest-client/api-documentation) module. This module will be archived when [PR 37](https://github.com/advanced-rest-client/api-documentation/pull/37) is merged.

-----

A documentation module for RAML types (resources) using AMF ld+json data model.

## Version compatibility

This version only works with AMF model version 2 (AMF parser >= 4.0.0).
For compatibility with previous model version use `3.x.x` version of the component.

## Usage

### Installation

```sh
npm install --save @api-components/api-type-documentation
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@api-components/api-type-documentation/api-type-documentation.js';
    </script>
  </head>
  <body>
    <api-type-documentation></api-type-documentation>
  </body>
</html>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@api-components/api-type-documentation/api-type-documentation.js';

class SampleElement extends PolymerElement {
  render() {
    return html`
    <api-type-documentation .amf="${this.amf}"></api-type-documentation>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/advanced-rest-client/api-type-documentation
cd api-type-documentation
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```

## API components

This component is a part of [API components ecosystem](https://elements.advancedrestclient.com/)
