/* eslint-disable no-param-reassign */
import { html } from 'lit-html';
import { ApiDemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@api-components/api-navigation/api-navigation.js';
import '../api-type-documentation.js';


class ApiDemo extends ApiDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'endpointsOpened', 'typesOpened', 'hasType', 'type', 'mediaTypes'
    ]);
    this.endpointsOpened = false;
    this.typesOpened = true;
    this.hasType = false;
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
    const declares = this._computeDeclares(this.amf);
    const type = declares.find((item) => item['@id'] === id);
    if (!type) {
      console.error('Type not found');
      return;
    }
    this.type = type;
    this.hasType = true;
  }

  setMediaTypes(model) {
    if (Array.isArray(model)) {
      [model] = model;
    }
    let webApi = this._computeWebApi(model);
    if (!webApi) {
      return;
    }
    if (Array.isArray(webApi)) {
      [webApi] = webApi;
    }
    const key = this._getAmfKey(this.ns.aml.vocabularies.apiContract.accepts);
    const value = this._ensureArray(webApi[key]);
    if (value) {
      this.mediaTypes = value.map((item) => item['@value']);
    } else {
      this.mediaTypes = undefined;
    }
  }

  _apiListTemplate() {
    const apis = [
      ['demo-api.json', 'Demo API'],
      ['demo-api-compact', 'Demo api - compact model'],
      ['examples-api.json', 'Examples API'],
      ['examples-api-compact.json', 'Examples api - compact model'],
      ['uber.json', 'Uber (OAS)'],
      ['uber-compact.json', 'Uber (OAS) - compact model'],
      ['book-api-compact.json', 'APIC-211 - compact model'],
    ];
    return apis.map(([file, label])  => html`<anypoint-item data-src="${file}">${label}</anypoint-item>`);
  }

  contentTemplate() {
    return html`
    ${this.hasType ?
      html`<api-type-documentation
        .amf="${this.amf}"
        .type="${this.type}"
        .mediaTypes="${this.mediaTypes}"
        graph></api-type-documentation>` :
      html`<p>Select type in the navigation to see the demo.</p>`}
    `;
  }
}
const instance = new ApiDemo();
instance.render();
