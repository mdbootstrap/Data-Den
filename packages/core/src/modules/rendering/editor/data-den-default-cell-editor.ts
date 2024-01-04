import { createHtmlElement } from '../../../utils';
import { DataDenCellEditor } from './data-den-cell-editor';
import { DataDenCellEditorParams } from './data-den-cell-editor-params';

export class DataDenDefaultCellEditor implements DataDenCellEditor {
  element: HTMLElement;
  params: DataDenCellEditorParams;
  #cssPrefix: string;
  #valueParser: (value: string) => any;
  #valueSetter: (value: string) => any;
  stopEditMode: (value: string) => void;
  _setValue: (value: string) => void;
  value: any;
  isBlurByKey: boolean = false;

  constructor(
    params: DataDenCellEditorParams,
    _stopEditMode: (value: string) => void,
    _setValue: (value: string) => void
  ) {
    this.stopEditMode = _stopEditMode;
    this._setValue = _setValue;
    this.#cssPrefix = params.cssPrefix;
    this.params = params;
    this.#valueSetter = params.valueSetter;
    this.#valueParser = params.valueParser;
    this.value = this.parseValue(params.value);

    const template = `<input class="${this.#cssPrefix}cell-editor-container" type="text" value="${this.value}" />`;

    this.element = createHtmlElement(template);
    this.attachUiEvents();
  }

  attachUiEvents() {
    this.element.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        this.isBlurByKey = true;
        this.element.blur();
      }
    });

    this.element.addEventListener('blur', (e) => {
      const currentTarget = e.relatedTarget as HTMLElement;
      const value = (e.target as HTMLInputElement).value;
      const parsedValue = this.parseValue(value);
      const settedValue = this.setValue(parsedValue);

      this._setValue(settedValue);

      if (!this.isBlurByKey && currentTarget?.classList.contains(`${this.#cssPrefix}cell-editor-container`)) {
        return;
      }

      this.stopEditMode(value);
      this.isBlurByKey = false;
    });
  }

  getGui(): HTMLElement {
    return this.element;
  }

  parseValue(value: string): any {
    return this.#valueParser ? this.#valueParser(value) : value;
  }

  setValue(value: any): any {
    return this.#valueSetter ? this.#valueSetter(value) : value;
  }
}
