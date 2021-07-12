/* eslint-disable class-methods-use-this */
import { LitElement, html, css } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin';
import markdownStyles from '@advanced-rest-client/markdown-styles/markdown-styles.js';
import '@advanced-rest-client/arc-marked/arc-marked.js';
import '@api-components/api-type-document/api-type-document.js';
import '@api-components/api-annotation-document/api-annotation-document.js';
import '@api-components/api-schema-document/api-schema-document.js';

/**
 * `api-type-documentation`
 *
 * A documentation module for RAML types (resources) using AMF data model.
 */
export class ApiTypeDocumentationElement extends AmfHelperMixin(LitElement) {
  get styles() {
    return [
      markdownStyles,
      css `:host {
        display: block;
      }

      .title {
        color: var(--arc-font-headline-color);
        font-size: var(--arc-font-headline-font-size);
        font-weight: var(--arc-font-headline-font-weight);
        letter-spacing: var(--arc-font-headline-letter-spacing);
        line-height: var(--arc-font-headline-line-height);
      }

      :host([narrow]) .title {
        font-size: var(--arc-font-headline-narrow-font-size);
      }

      arc-marked {
        background-color: transparent;
        padding: 0;
      }`
    ];
  }

  static get properties() {
    return {
      /**
       * A type definition to render.
       * This should be a one of the following AMF types:
       *
       * - `http://www.w3.org/ns/shacl#NodeShape` (Object)
       * - `http://raml.org/vocabularies/shapes#UnionShape` (Union)
       * - `http://raml.org/vocabularies/shapes#ArrayShape` (Array)
       * - `http://raml.org/vocabularies/shapes#ScalarShape` (single property)
       */
      type: { type: Object },
      /**
       * Computed value, title of the type.
       */
      typeTitle: { type: String },
      /**
       * Computed value of method description from `method` property.
       */
      description: { type: String },
      /**
       * Computed value from current `method`. True if the model contains
       * custom properties (annotations in RAML).
       */
      hasCustomProperties: { type: Boolean },
      /**
       * Computed value, true when passed model represents a schema
       * (like XML)
       */
      isSchema: { type: Boolean },
      /**
       * Set to render a mobile friendly view.
       */
      narrow: { type: Boolean, reflect: true },
      /**
       * A media type to use to generate examples.
       */
      mediaType: { type: String },
      /**
       * A list of supported media types for the type.
       * This is used by `api-resource-example-document` to compute examples.
       * In practice it should be value of raml's `mediaType`.
       *
       * Each item in the array is just a name of thr media type.
       *
       * Example:
       *
       * ```json
       * ["application/json", "application/xml"]
       */
      mediaTypes: { type: Array },
      /**
       * Enables compatibility with Anypoint components.
       */
      compatibility: { type: Boolean },
      /**
       * When enabled it renders external types as links and dispatches
       * `api-navigation-selection-changed` when clicked.
       */
      graph: { type: Boolean },
      /**
       * Type of the header in the documentation section.
       * Should be in range of 1 to 6.
       *
       * @default 2
       */
      headerLevel: { type: Number }
    };
  }

  get type() {
    return this._type;
  }

  /**
   * @param {any} value
   */
  set type(value) {
    const old = this._type;
    if (old === value) {
      return;
    }
    this._type = value;
    this.requestUpdate('type', old);
    this._typeChanged(value);
  }

  constructor() {
    super();
    this.headerLevel = 2;
    /**
     * @type {any}
     */
    this.type = undefined;
    /**
     * @type {string}
     */
    this.typeTitle = undefined;
    /**
     * @type {string}
     */
    this.description = undefined;
    /**
     * @type {string}
     */
    this.mediaType = undefined;
    /**
     * @type {string[]}
     */
    this.mediaTypes = undefined;
    this.narrow = false;
    this.isSchema = false;
    this.graph = false;
    this.compatibility = false;
    this.hasCustomProperties = false;
  }

  /**
   * @param {any} type
   */
  _typeChanged(type) {
    this.isSchema = this._computeIsSchema(type);
    this.hasCustomProperties = this._computeHasCustomProperties(type);
    this.description = this._computeDescription(type);
    this.typeTitle = this._computeTitle(type);
  }

  /**
   * Computes `typeTitle` property
   *
   * @param {any} shape AMF model for data type
   * @return {string|undefined}
   */
  _computeTitle(shape) {
    if (!shape) {
      return undefined;
    }
    let name = /** @type string */ (this._getValue(shape, this.ns.aml.vocabularies.core.name));
    if (!name) {
      name = /** @type string */ (this._getValue(shape, this.ns.w3.shacl.name));
    }
    return name;
  }

  /**
   * Computes `description` property
   *
   * @param {any} shape AMF model for data type
   * @return {string|undefined}
   */
  _computeDescription(shape) {
    return shape && /** @type string */ (this._getValue(shape, this.ns.aml.vocabularies.core.description));
  }

  /**
   * Computes value for `isSchema` property.
   *
   * @param {any} shape AMF `supportedOperation` model
   * @return {boolean | undefined}
   */
  _computeIsSchema(shape) {
    if (!shape) {
      return undefined;
    }
    return this._hasType(shape, this.ns.aml.vocabularies.shapes.SchemaShape);
  }

  render() {
    const {
      typeTitle,
      hasCustomProperties,
      amf,
      type,
      isSchema,
      narrow,
      mediaType,
      mediaTypes,
      compatibility,
      graph,
      headerLevel
    } = this;
    return html `<style>${this.styles}</style>
    ${typeTitle ? html`<div class="title" role="heading" aria-level="${headerLevel}" part="type-title">${typeTitle}</div>` : ''}
    ${hasCustomProperties ?
      html`<api-annotation-document .amf="${amf}" .shape="${type}"></api-annotation-document>` : ''}

    ${this.description ? html`<arc-marked .markdown="${this.description}" sanitize>
      <div slot="markdown-html" class="markdown-html" part="markdown-html"></div>
    </arc-marked>` : ''}

    ${isSchema ?
      html`<api-schema-document
        .amf="${amf}"
        .mediaType="${mediaType}"
        .shape="${type}"
        ?compatibility="${compatibility}"></api-schema-document>` :
      html`<api-type-document
        .amf="${amf}"
        .type="${type}"
        ?narrow="${narrow}"
        .mediaType="${mediaType}"
        .mediaTypes="${mediaTypes}"
        ?graph="${graph}"
        ?compatibility="${compatibility}"
        renderReadonly
        noMediaSelector
        ></api-type-document>`}`;
  }
}
