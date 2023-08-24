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
    filterRenderer: DataDenHeaderTextFilterRenderer,
    sorterRenderer: DataDenHeaderDefaultSorterRenderer
  ) {
    super(rowIndex, columnIndex, renderer);

    this.#renderer = renderer;
    this.#filterRenderer = filterRenderer;
    this.#sorterRenderer = sorterRenderer;
  }

  render(): HTMLElement {
    const container = this.#renderer.getGui();
    container.appendChild(this.#filterRenderer.getGui());
    container.appendChild(this.#sorterRenderer.getGui());

    return container;
  }
}
