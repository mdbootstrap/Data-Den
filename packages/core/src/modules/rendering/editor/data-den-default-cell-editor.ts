import { createHtmlElement } from '../../../utils';
import { DataDenCellEditor } from './data-den-cell-editor';
import { DataDenCellEditorParams } from './data-den-cell-editor-params';

export class DataDenDefaultCellEditor implements DataDenCellEditor {
  element: HTMLElement;
  params: DataDenCellEditorParams;
  #cssPrefix: string;
  #valueParser: (value: string) => any;
  #valueSetter: (value: string) => any;

  constructor(params: DataDenCellEditorParams) {
    this.#cssPrefix = params.cssPrefix;
    this.params = params;
    this.#valueSetter = params.valueSetter;
    this.#valueParser = params.valueParser;

    const value = this.parseValue(params.value);

    const template = `<input class="${this.#cssPrefix}cell-editor-container" type="text" value="${value}" />`;

    this.element = createHtmlElement(template);
  }

  setValue(value: string): void {
    this.#valueSetter(value);
    // TODO
  }

  getGui(): HTMLElement {
    return this.element;
  }

  parseValue(value: string): any {
    return this.#valueParser ? this.#valueParser(value) : value;
  }
}
