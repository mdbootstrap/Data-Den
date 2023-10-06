import { DataDenCellEditor } from '../editor';
import { DataDenHeaderFilterRenderer } from '../filter';
import { DataDenHeaderDefaultSorterRenderer } from '../sorter';
import { DataDenHeaderDefaultResizerRenderer } from '../resizer';
import { DataDenCell } from './data-den-cell';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';
import { DataDenColDef } from '../../../data-den-options.interface';

export class DataDenHeaderCell extends DataDenCell {
  #filterRenderer: any;
  #sorterRenderer: any;
  #resizerRenderer: any;
  #renderer: DataDenCellRenderer;
  #columnOptions: DataDenColDef;

  constructor(
    rowIndex: number,
    columnIndex: number,
    renderer: DataDenCellRenderer,
    editor: DataDenCellEditor,
    filterRenderer: DataDenHeaderFilterRenderer,
    sorterRenderer: DataDenHeaderDefaultSorterRenderer,
    resizerRenderer: DataDenHeaderDefaultResizerRenderer,
    columnOptions: DataDenColDef
  ) {
    super(rowIndex, columnIndex, renderer, editor);

    this.#renderer = renderer;
    this.#filterRenderer = filterRenderer;
    this.#sorterRenderer = sorterRenderer;
    this.#resizerRenderer = resizerRenderer;
    this.#columnOptions = columnOptions;
  }

  render(): HTMLElement {
    const container = this.#renderer.getGui();

    if (this.#columnOptions.filter) {
      container.appendChild(this.#filterRenderer.getGui());
    }

    if (this.#columnOptions.sort) {
      container.querySelector('.data-den-header-cell-value')!.appendChild(this.#sorterRenderer.getGui());
    }

    if (this.#columnOptions.resize) {
      container.appendChild(this.#resizerRenderer.getGui());
    }

    return container;
  }
}
