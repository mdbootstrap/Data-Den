import { DataDenCellEditor } from '../editor';
import { DataDenHeaderTextFilterRenderer } from '../filter';
import { DataDenHeaderDefaultSorterRenderer } from '../sorter';
import { DataDenCell } from './data-den-cell';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';

export class DataDenHeaderCell extends DataDenCell {
  #filterRenderer: any;
  #sorterRenderer: any;
  #renderer: DataDenCellRenderer;

  constructor(
    rowIndex: number,
    columnIndex: number,
    renderer: DataDenCellRenderer,
    editor: DataDenCellEditor,
    filterRenderer: DataDenHeaderTextFilterRenderer,
    sorterRenderer: DataDenHeaderDefaultSorterRenderer
  ) {
    super(rowIndex, columnIndex, renderer, editor);

    this.#renderer = renderer;
    this.#filterRenderer = filterRenderer;
    this.#sorterRenderer = sorterRenderer;
  }

  render(): HTMLElement {
    const container = this.#renderer.getGui();
    container.querySelector('.data-den-header-cell-value').appendChild(this.#sorterRenderer.getGui());
    container.appendChild(this.#filterRenderer.getGui());

    return container;
  }
}
