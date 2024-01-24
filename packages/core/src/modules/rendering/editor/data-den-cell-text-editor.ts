import { createHtmlElement } from '../../../utils';
import { DataDenCellEditor } from './data-den-cell-editor';
import { DataDenCellEditorParams } from './data-den-cell-editor-params';

export class DataDenCellTextEditor implements DataDenCellEditor {
  element: HTMLElement;
  params: DataDenCellEditorParams;
  #cssPrefix: string;
  value: any;
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

      this.setValue(value);

      if (!this.isBlurByKey && currentTarget?.classList.contains(`${this.#cssPrefix}cell-editor`)) {
        return;
      }

      this.stopEditMode(value);
      this.isBlurByKey = false;
    });
  }

  getGui(focus: boolean): HTMLElement {
    if (focus) {
      setTimeout(() => {
        const input = this.element as HTMLInputElement;
        input.select();
      }, 0)
    }

    return this.element;
  }
}
