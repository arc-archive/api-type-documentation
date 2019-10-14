import { html } from 'lit-html';
import { LitElement } from 'lit-element';
import { ApiDemoPageBase } from '@advanced-rest-client/arc-demo-helper/ApiDemoPage.js';
import '@api-components/raml-aware/raml-aware.js';
import '@api-components/api-navigation/api-navigation.js';
import '../api-type-documentation.js';

import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
class DemoElement extends AmfHelperMixin(LitElement) {}

window.customElements.define('demo-element', DemoElement);
class ApiDemo extends ApiDemoPageBase {
  constructor() {
    super();
    this.endpointsOpened = false;
    this.typesOpened = true;
    this.hasType = false;
  }

  get type() {
    return this._type;
  }

  set type(value) {
    this._setObservableProperty('type', value);
  }

  get hasType() {
    return this._hasType;
  }

  set hasType(value) {
    this._setObservableProperty('hasType', value);
  }

  get mediaTypes() {
    return this._mediaTypes;
  }

  set mediaTypes(value) {
    this._setObservableProperty('mediaTypes', value);
  }

  get amf() {
    return this._amf;
  }

  set amf(value) {
    this._setObservableProperty('amf', value);
    this.setMediaTypes(value);
  }

  get helper() {
    return document.getElementById('helper');
  }

  _navChanged(e) {
    const { selected, type } = e.detail;
    this.hasType = false;
    this.mediaType = undefined;

    if (type === 'type') {
      this.setTypeData(selected);
    } else {
      this.hasType = false;
    }
  }

  setTypeData(id) {
    const helper = this.helper;
    const declares = helper._computeDeclares(this.amf);
    const type = declares.find((item) => item['@id'] === id);
    if (!type) {
      console.error('Type not found');
      return;
    }
    this.type = type;
    this.hasType = true;
  }

  setMediaTypes(model) {
    const helper = this.helper;
    if (model instanceof Array) {
      model = model[0];
    }
    let webApi = helper._computeWebApi(model);
    if (!webApi) {
      return;
    }
    if (webApi instanceof Array) {
      webApi = webApi[0];
    }
    const key = helper._getAmfKey(helper.ns.aml.vocabularies.apiContract.accepts);
    const value = helper._ensureArray(webApi[key]);
    if (value) {
      this.mediaTypes = value.map((item) => item['@value']);
    } else {
      this.mediaTypes = undefined;
    }
  }

  _apiListTemplate() {
    return html`
    <paper-item data-src="demo-api.json">Demo API</paper-item>
    <paper-item data-src="demo-api-compact.json">Demo api - compact model</paper-item>
    <paper-item data-src="examples-api.json">Examples API</paper-item>
    <paper-item data-src="examples-api-compact.json">Examples api - compact model</paper-item>
    <paper-item data-src="uber.json">Uber (OAS)</paper-item>
    <paper-item data-src="uber-compact.json">Uber (OAS) - compact model</paper-item>
    <paper-item data-src="book-api-compact.json">APIC-211 - compact model</paper-item>`;
  }

  contentTemplate() {
    return html`
    <demo-element id="helper" .amf="${this.amf}"></demo-element>
    ${this.hasType ?
      html`<api-type-documentation
        aware="model"
        .type="${this.type}"
        .mediaTypes="${this.mediaTypes}"
        graph></api-type-documentation>` :
      html`<p>Select type in the navigation to see the demo.</p>`}
    `;
  }
}
const instance = new ApiDemo();
instance.render();
window._demo = instance;
