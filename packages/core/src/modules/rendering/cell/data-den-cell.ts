import { DataDenCellEditor, DataDenCellEditorParams } from '../editor';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';
import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { createHtmlElement } from '../../../utils';
import { DataDenInternalOptions } from '../../../data-den-options.interface';

export class DataDenCell {
  colIndex: number;
  rowIndex: number;
  width: number;
  #value: any;
  #options: DataDenInternalOptions;
  #renderer!: DataDenCellRenderer;
  #editor!: DataDenCellEditor;
  #left: string;
  pinned: string;
  cellElement: HTMLElement;
  cellElements: DataDenCell[] = [];
  isBlurByKey: boolean = false;
  prevValue: any;
  save: boolean = true;

  constructor(
    value: any,
    colIndex: number,
    rowIndex: number,
    left: number,
    width: number,
    pinned: string,
    options: DataDenInternalOptions
  ) {
    this.colIndex = colIndex;
    this.rowIndex = rowIndex;
    this.width = width;
    this.#value = value;
    this.#options = options;
    this.#left = pinned ? 'auto' : `${left}px`;
    this.pinned = pinned;
    this.#initRenderers();
  }

  #initRenderers() {
    const colDef = this.#options.columns[this.colIndex];
    const cellRenderer = colDef.cellRenderer!;
    const cellEditor = colDef.cellEditor!;

    const cellRendererParams = this.#getCellRendererParams();
    const cellEditorParams = this.#getCellEditorParams();

    this.#renderer = new cellRenderer(cellRendererParams);
    this.#editor = new cellEditor(cellEditorParams);
  }

  #getCellRendererParams(): DataDenCellRendererParams {
    return {
      value: this.#value,
      cssPrefix: this.#options.cssPrefix,
    };
  }

  #getCellEditorParams(): DataDenCellEditorParams {
    return {
      value: this.#value,
      cssPrefix: this.#options.cssPrefix,
      onKeyUp: this.#onKeyUp.bind(this),
      stopEditMode: this.#stopEditMode.bind(this),
    };
  }

  #onBlur(e: KeyboardEvent | MouseEvent): void {
    const target = e.target as HTMLElement;

    if (!this.isBlurByKey && target.classList.contains(`${this.#options.cssPrefix}cell-editor`)) {
      return;
    }

    this.#stopEditMode();
  }

  #onKeyUp(e: KeyboardEvent): void {
    this.#value = (e.target as HTMLInputElement).value;

    if (e.key === 'Enter' || e.key === 'Escape') {

      this.isBlurByKey = true;
      this.save = e.key !== 'Escape';

      this.#onBlur(e);
    }
  }

  documentListener = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains(`${this.#options.cssPrefix}cell-editor`)) return;

    this.#onBlur(e);

    document.removeEventListener('click', this.documentListener);
  }

  startEditMode(selectedCell: DataDenCell, cells: DataDenCell[]) {
    this.prevValue = this.#value;
    this.cellElements = cells;
    const editor = this.#editor.getGui();
    this.cellElement.replaceChildren(editor);

    if (selectedCell !== this) return;

    document.addEventListener('click', this.documentListener);

    this.#editor.afterUiRender();
  }

  #stopEditMode() {
    this.cellElements.forEach((cell) => {
      const cellRenderer = this.#options.columns[cell.colIndex].cellRenderer!;
      const cellEditor = this.#options.columns[cell.colIndex].cellEditor!;
      if (!this.save) {
        cell.#value = cell.prevValue ?? cell.#value;
        cell.#editor = new cellEditor(cell.#getCellEditorParams());
      }

      const cellRendererParams = cell.#getCellRendererParams();

      this.#renderer = new cellRenderer(cellRendererParams);
      cell.cellElement.replaceChildren(this.#renderer.getGui());
    });
  }

  setValue(value: any) {
    this.#value = value;
  }

  render(): HTMLElement {
    const template =
      /* HTML */
      `
        <div
          class="${this.#options.cssPrefix}cell ${this.#options.draggable && !this.pinned
        ? `${this.#options.cssPrefix}cell-draggable`
        : ''} ${this.pinned === 'left' ? `${this.#options.cssPrefix}cell-pinned-left` : ''} ${this.pinned ===
          'right'
          ? `${this.#options.cssPrefix}cell-pinned-right`
          : ''}"
          rowIndex="${this.rowIndex}"
          colIndex="${this.colIndex}"
          role="gridcell"
          ref="cell"
          style="left: ${this.#left}; width: ${this.width}px;"
        ></div>
      `;

    const cellElement = createHtmlElement(template);
    cellElement.appendChild(this.#renderer.getGui());

    this.cellElement = cellElement;

    return cellElement;
  }
}
