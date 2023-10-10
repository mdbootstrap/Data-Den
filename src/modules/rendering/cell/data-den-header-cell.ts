import { DataDenCellEditor } from '../editor';
import { DataDenHeaderFilterRenderer } from '../filter';
import { DataDenHeaderDefaultSorterRenderer } from '../sorter';
import { DataDenHeaderDefaultResizerRenderer } from '../resizer';
import { DataDenCell } from './data-den-cell';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';

export class DataDenHeaderCell extends DataDenCell {
  #filterRenderer: any;
  #sorterRenderer: any;
  #resizerRenderer: any;
  #renderer: DataDenCellRenderer;
  #cssPrefix: string | undefined;

  constructor(
    rowIndex: number,
    columnIndex: number,
    renderer: DataDenCellRenderer,
    editor: DataDenCellEditor,
    filterRenderer: DataDenHeaderFilterRenderer,
    sorterRenderer: DataDenHeaderDefaultSorterRenderer,
    resizerRenderer: DataDenHeaderDefaultResizerRenderer,
    cssPrefix: string
  ) {
    super(rowIndex, columnIndex, renderer, editor, cssPrefix);

    this.#renderer = renderer;
    this.#filterRenderer = filterRenderer;
    this.#sorterRenderer = sorterRenderer;
    this.#resizerRenderer = resizerRenderer;
    this.#cssPrefix = cssPrefix;
  }

  render(): HTMLElement {
    const container = this.#renderer.getGui();
    container.querySelector(`.${this.#cssPrefix}header-cell-value`)!.appendChild(this.#sorterRenderer.getGui());
    container.appendChild(this.#filterRenderer.getGui());
    container.appendChild(this.#sorterRenderer.getGui());
    container.appendChild(this.#resizerRenderer.getGui());

    return container;
  }
}
