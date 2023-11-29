import { Context } from '../../../context';
import { DataDenPubSub } from '../../../data-den-pub-sub';
import { createHtmlElement } from '../../../utils';
import { DataDenCellEditor } from './data-den-cell-editor';
import { DataDenCellEditorParams } from './data-den-cell-editor-params';

export class DataDenDefaultCellEditor implements DataDenCellEditor {
  element: HTMLElement;
  #params: DataDenCellEditorParams;
  #cssPrefix: string;

  constructor(params: DataDenCellEditorParams) {
    this.#cssPrefix = params.cssPrefix;
    this.#params = params;
    const value = this.parseValue(params.value);

    const template = `<input class="${this.#cssPrefix}cell-editor-container" type="text" value="${value}" />`;

    this.element = createHtmlElement(template);
    this.#attachUiEvents();
  }

  #attachUiEvents() {
    this.element.addEventListener('blur', (event: any) => {
      const inputElement = event.target as HTMLInputElement;

      this.setValue(inputElement.value);
    });
  }

  getGui(): HTMLElement {
    return this.element;
  }

  setValue(value: any): any {
    const parent = this.element.parentElement;
    const column = Number(parent.getAttribute('colindex'));
    const row = Number(parent.getAttribute('rowindex'));

    DataDenPubSub.publish('command:editing:row-values-changed', {
      context: new Context('command:editing:row-values-changed'),
      value: value,
      column: column,
      row: row,
    });
  }

  parseValue(value: any): any {
    return this.#params.valueParser ? this.#params.valueParser(value) : value;
  }
}
