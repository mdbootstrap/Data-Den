import { createHtmlElement } from '../../../utils';
import { DataDenCellEditor } from './data-den-cell-editor';
import { DataDenCellEditorParams } from './data-den-cell-editor-params';

export class DataDenDefaultCellEditor implements DataDenCellEditor {
  element: HTMLElement;
  #cssPrefix: string;

  constructor(params: DataDenCellEditorParams) {
    this.#cssPrefix = params.cssPrefix ? `${params.cssPrefix}-` : 'data-den-';
    const template = `
      <div class="${this.#cssPrefix}cell-editor-container"><input type="text" value="${params.value}"></div>
    `;

    this.element = createHtmlElement(template);
  }

  getGui(): HTMLElement {
    return this.element;
  }

  setValue(): any {}

  parseValue(): any {}
}
