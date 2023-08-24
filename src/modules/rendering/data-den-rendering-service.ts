import { DataDenOptions } from '../../data-den-options.interface';
import {
  DataDenCell,
  DataDenCellRendererParams,
  DataDenDefaultCellRenderer,
  DataDenDefaultHeaderCellRenderer,
  DataDenHeaderCell,
} from './cell';
import { DataDenHeaderTextFilterRenderer, DataDenQuickFilterRenderer } from './filter';
import { DataDenPaginationRenderer } from './pagination';
import { DataDenHeaderRow, DataDenRow } from './row';
import { DataDenHeaderDefaultSorterRenderer } from './sorter';

export class DataDenRenderingService {
  #headerRow: DataDenHeaderRow;
  #rows: DataDenRow[] = [];
  #quickFilterRenderer: DataDenQuickFilterRenderer | null = null;
  #paginationRenderer: DataDenPaginationRenderer | null = null;

  constructor(options: DataDenOptions) {
    this.#headerRow = this.#createHeaderRow(options);
    this.#rows = this.#createDataRows(options);

    if (options.quickFilter) {
      this.#quickFilterRenderer = new DataDenQuickFilterRenderer();
    }

    if (options.pagination) {
      this.#paginationRenderer = new DataDenPaginationRenderer();
    }
  }

  #createHeaderRow(options: DataDenOptions): DataDenHeaderRow {
    const rowIndex = 0;
    const headerCells = options.columns.map((column, colIndex) => {
      const value = column.headerName;
      const rendererParams: DataDenCellRendererParams = { value: value };
      const cellRenderer = new DataDenDefaultHeaderCellRenderer(rendererParams);
      const filterRenderer = new DataDenHeaderTextFilterRenderer();
      const sorterRenderer = new DataDenHeaderDefaultSorterRenderer();

      return new DataDenHeaderCell(rowIndex, colIndex, cellRenderer, filterRenderer, sorterRenderer);
    });

    return new DataDenHeaderRow(rowIndex, headerCells);
  }

  #createDataRows(options: DataDenOptions): DataDenRow[] {
    const rows = options.rows.map((row, rowIndex) => {
      const cells = Object.entries(row).map(([, value], columnIndex) => {
        const rendererParams: DataDenCellRendererParams = { value: value };
        const renderer = new DataDenDefaultCellRenderer(rendererParams);
        return new DataDenCell(rowIndex, columnIndex, renderer);
      });

      return new DataDenRow(rowIndex, cells);
    });

    return rows;
  }

  renderTable(container: HTMLElement): void {
    const grid = this.#renderGrid();

    if (this.#quickFilterRenderer) {
      grid.appendChild(this.#quickFilterRenderer.getGui());
    }

    grid.appendChild(this.#renderHeader());
    grid.appendChild(this.#renderBody());

    if (this.#paginationRenderer) {
      grid.appendChild(this.#paginationRenderer.getGui());
    }

    container.appendChild(grid);
  }

  #renderGrid(): HTMLElement {
    const grid = document.createElement('div');
    grid.classList.add('data-den-grid');

    return grid;
  }

  #renderHeader(): HTMLElement {
    const headerContainer = document.createElement('div');
    headerContainer.classList.add('data-den-header');
    headerContainer.setAttribute('role', 'rowgroup');

    const headerRow = this.#headerRow.render();
    headerContainer.appendChild(headerRow);

    return headerContainer;
  }

  #renderBody(): HTMLElement {
    const rowContainer = document.createElement('div');
    rowContainer.classList.add('data-den-grid-rows');
    rowContainer.setAttribute('role', 'rowgroup');

    const rows = document.createDocumentFragment();
    this.#rows.forEach((row) => rows.appendChild(row.render()));
    rowContainer.appendChild(rows);

    return rowContainer;
  }
}
