import { createHtmlElement } from '../../../utils';
import { DataDenCellEditor } from './data-den-cell-editor';
import { DataDenCellEditorParams } from './data-den-cell-editor-params';

export class DataDenCellTextEditor implements DataDenCellEditor {
  element: HTMLElement;
  input: HTMLInputElement;
  params: DataDenCellEditorParams;
  #cssPrefix: string;
  stopEditMode: (value: string) => void;
  setValue: (value: string) => void;
  isBlurByKey: boolean = false;

  constructor(
    params: DataDenCellEditorParams,
  ) {
    this.#cssPrefix = params.cssPrefix;
    this.stopEditMode = params.stopEditMode;
    this.setValue = params.setValue;
    this.params = params;

    const template = `<input class="${this.#cssPrefix}cell-editor" type="text" value="${params.value}" />`;

    this.element = createHtmlElement(template);
    this.input = this.element as HTMLInputElement;

    this.attachUiEvents();
  }

  attachUiEvents() {
    if (this.input) {
      this.input.addEventListener('keydown', (e) => this.params.onKeyDown(e))
      this.input.addEventListener('blur', (e) => this.params.onBlur(e))
    }
  }

  afterUiAttached(): void {
    this.input.select();
  }

  getGui(): HTMLElement {
    return this.element;
  }

  getValue() {
    return this.input.value;
  }
}
