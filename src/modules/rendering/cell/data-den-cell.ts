import { DataDenCellRenderer } from './data-den-cell-renderer.interface';

export class DataDenCell {
  #renderer: DataDenCellRenderer;

  constructor(public columnIndex: number, public rowIndex: number, renderer: DataDenCellRenderer) {
    this.#renderer = renderer;
  }

  render(): HTMLElement {
    return this.#renderer.getGui();
  }
}
