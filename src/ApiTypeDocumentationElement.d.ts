import { LitElement, TemplateResult, CSSResult } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin';

/**
 * `api-type-documentation`
 *
 * A documentation module for RAML types (resources) using AMF data model.
 */
export declare class ApiTypeDocumentationElement extends AmfHelperMixin(LitElement) {
  get styles(): CSSResult;

  /**
   * A type definition to render.
   * This should be a one of the following AMF types:
   *
   * - `http://www.w3.org/ns/shacl#NodeShape` (Object)
   * - `http://raml.org/vocabularies/shapes#UnionShape` (Union)
   * - `http://raml.org/vocabularies/shapes#ArrayShape` (Array)
   * - `http://raml.org/vocabularies/shapes#ScalarShape` (single property)
   */
  type: any;
  /**
   * Computed value, title of the type.
   * @attribute
   */
  typeTitle: string;
  /**
   * Computed value of method description from `method` property.
   * @attribute
   */
  description: string;
  /**
   * Computed value from current `method`. True if the model contains
   * custom properties (annotations in RAML).
   * @attribute
   */
  hasCustomProperties: boolean;
  /**
   * Computed value, true when passed model represents a schema
   * (like XML)
   * @attribute
   */
  isSchema: boolean;
  /**
   * Set to render a mobile friendly view.
   * @attribute
   */
  narrow: boolean;
  /**
   * A media type to use to generate examples.
   * @attribute
   */
  mediaType: string;
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
  mediaTypes: string[];
  /**
   * Enables compatibility with Anypoint components.
   * @attribute
   */
  compatibility: boolean;
  /**
   * When enabled it renders external types as links and dispatches
   * `api-navigation-selection-changed` when clicked.
   * @attribute
   */
  graph: boolean;
  /**
   * Type of the header in the documentation section.
   * Should be in range of 1 to 6.
   *
   * @default 2
   * @attribute
   */
  headerLevel: number;

  constructor();

  _typeChanged(type: any): void;

  /**
   * Computes `typeTitle` property
   *
   * @param shape AMF model for data type
   */
  _computeTitle(shape: any): string|undefined;

  /**
   * Computes `description` property
   *
   * @param shape AMF model for data type
   */
  _computeDescription(shape: any): string|undefined;

  /**
   * Computes value for `isSchema` property.
   *
   * @param shape AMF `supportedOperation` model
   */
  _computeIsSchema(shape: any): boolean|undefined

  render(): TemplateResult;
}
