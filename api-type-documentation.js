import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import {AmfHelperMixin} from '../../@api-components/amf-helper-mixin/amf-helper-mixin.js';
import '../../@polymer/polymer/lib/elements/dom-if.js';
import '../../@api-components/raml-aware/raml-aware.js';
import '../../@advanced-rest-client/markdown-styles/markdown-styles.js';
import '../../@polymer/marked-element/marked-element.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../@api-components/api-type-document/api-type-document.js';
import '../../@api-components/api-annotation-document/api-annotation-document.js';
import '../../@api-components/api-schema-document/api-schema-document.js';
/**
 * `api-type-documentation`
 *
 * A documentation module for RAML types (resources) using AMF data model.
 *
 * ## Styling
 *
 * `<api-type-documentation>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-type-documentation` | Mixin applied to this elment | `{}`
 * `--arc-font-headline` | Theme mixin, applied to the title | `{}`
 * `--api-type-documentation-title` | Mixin applied to the title | `{}`
 * `--api-type-documentation-title-narrow` | Mixin applied to the title in narrow layout | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin ApiElements.AmfHelperMixin
 */
class ApiTypeDocumentation extends AmfHelperMixin(PolymerElement) {
  static get template() {
    return html`
    <style include="markdown-styles"></style>
    <style>
    :host {
      display: block;
      @apply --api-type-documentation;
    }

    h1 {
      @apply --arc-font-headline;
      @apply --api-type-documentation-title;
    }

    :host([narrow]) h1 {
      @apply --api-type-documentation-title-narrow;
    }
    </style>
    <template is="dom-if" if="[[aware]]">
      <raml-aware raml="{{amfModel}}" scope="[[aware]]"></raml-aware>
    </template>
    <template is="dom-if" if="[[typeTitle]]">
      <h1 class="title">[[typeTitle]]</h1>
    </template>
    <template is="dom-if" if="[[hasCustomProperties]]">
      <api-annotation-document amf-model="[[amfModel]]" shape="[[type]]"></api-annotation-document>
    </template>
    <template is="dom-if" if="[[description]]">
      <marked-element markdown="[[description]]">
        <div slot="markdown-html" class="markdown-body"></div>
      </marked-element>
    </template>
    <template is="dom-if" if="[[!isSchema]]">
      <api-type-document amf-model="[[amfModel]]" type="[[type]]" narrow="[[narrow]]" media-type="[[mediaType]]"></api-type-document>
    </template>
    <template is="dom-if" if="[[isSchema]]">
      <api-schema-document shape="[[type]]" amf-model="[[amfModel]]"></api-schema-document>
    </template>
`;
  }

  static get is() {
    return 'api-type-documentation';
  }
  static get properties() {
    return {
      /**
       * `raml-aware` scope property to use.
       */
      aware: String,
      /**
       * Generated AMF json/ld model form the API spec.
       * The element assumes the object of the first array item to be a
       * type of `"http://raml.org/vocabularies/document#Document`
       * on AMF vocabulary.
       *
       * It is only usefult for the element to resolve references.
       *
       * @type {Object|Array}
       */
      amfModel: Object,
      /**
       * A type definition to render.
       * This should be a one of the following AMF types:
       *
       * - `http://www.w3.org/ns/shacl#NodeShape` (Object)
       * - `http://raml.org/vocabularies/shapes#UnionShape` (Union)
       * - `http://raml.org/vocabularies/shapes#ArrayShape` (Array)
       * - `http://raml.org/vocabularies/shapes#ScalarShape` (single property)
       * @type {Object|Array}
       */
      type: Object,
      /**
       * Computed value, title of the type.
       */
      typeTitle: {
        type: String,
        computed: '_computeTitle(type)'
      },
      /**
       * Computed value of method description from `method` property.
       */
      description: {
        type: String,
        computed: '_computeDescription(type)'
      },
      /**
       * Computed value from current `method`. True if the model contains
       * custom properties (annotations in RAML).
       */
      hasCustomProperties: {
        type: Boolean,
        computed: '_computeHasCustomProperties(type)'
      },
      /**
       * Computed value, true when passed model represents a schema
       * (like XML)
       */
      isSchema: {
        type: Boolean,
        value: false,
        computed: '_computeIsSchema(type)'
      },
      /**
       * Set to render a mobile friendly view.
       */
       narrow: {
         type: Boolean,
         reflectToAttribute: true
       },
       /**
        * A media type to use to generate examples.
        */
       mediaType: String
    };
  }
  /**
   * Computes `typeTitle` property
   *
   * @param {Object} shape AMF model for data type
   * @return {String|undefined}
   */
  _computeTitle(shape) {
    if (!shape) {
      return;
    }
    let name = this._getValue(shape, this.ns.schema.schemaName);
    if (!name) {
      name = this._getValue(shape, this.ns.w3.shacl.name + 'name');
    }
    return name;
  }
  /**
   * Computes `description` property
   *
   * @param {Object} shape AMF model for data type
   * @return {String|undefined}
   */
  _computeDescription(shape) {
    return shape && this._getValue(shape, this.ns.schema.desc);
  }
  /**
   * Computes value for `isSchema` property.
   *
   * @param {Object} shape AMF `supportedOperation` model
   * @return {Boolean}
   */
  _computeIsSchema(shape) {
    if (!shape) {
      return;
    }
    return this._hasType(shape, this.ns.w3.shacl.name + 'SchemaShape');
  }
}
window.customElements.define(ApiTypeDocumentation.is, ApiTypeDocumentation);
