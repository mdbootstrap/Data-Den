import { DataDenCellEditor } from '../editor';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';

export class DataDenCell {
  #renderer: DataDenCellRenderer;
  #editor: DataDenCellEditor;

  constructor(
    public columnIndex: number,
    public rowIndex: number,
    renderer: DataDenCellRenderer,
    editor: DataDenCellEditor
  ) {
    this.#renderer = renderer;
    this.#editor = editor;
  }

  render(): HTMLElement {
    return this.#renderer.getGui();
  }
}
