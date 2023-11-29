import { DataDenColDef, DataDenInternalOptions } from '../../data-den-options.interface';
import { DataDenCell, DataDenHeaderCell } from './cell';
import { DataDenPaginationRenderer } from './pagination';
import { DataDenHeaderRow, DataDenRow } from './row';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenEvent } from '../../data-den-event';
import { Order } from '../sorting/data-den-sorting.interface';
import { Context } from '../../context';

export class DataDenRenderingService {
  #container: HTMLElement;
  #options: DataDenInternalOptions;
  #defaultColumns: DataDenColDef[];
  #orderedColumns: DataDenColDef[];
  #columnsOrder: number[];
  #headerRow: DataDenHeaderRow;
  #rows: DataDenRow[] = [];
  #paginationRenderer: DataDenPaginationRenderer | null = null;

  constructor(container: HTMLElement, options: DataDenInternalOptions) {
    this.#container = container;
    this.#options = options;
    this.#defaultColumns = [...this.#options.columns];
    this.#orderedColumns = [...this.#options.columns];
    this.#columnsOrder = [];
    this.#headerRow = this.#createHeaderRow(options.columns, '');

    if (options.pagination) {
      this.#paginationRenderer = new DataDenPaginationRenderer(options.paginationOptions);
    }

    this.renderTable();
    this.#subscribeToEvents();
    this.#subscribeFetchDone();
    this.#publishFetchStart();
  }

  #createHeaderRow(colDefs: DataDenColDef[], order: Order): DataDenHeaderRow {
    const rowIndex = 0;
    const headerCells = colDefs.map((colDef, colIndex) => {
      const value = colDef.headerName;
      const left = colDefs.slice(0, colIndex).reduce((acc, curr) => acc + (curr.width || 120), 0);
      const width = colDefs[colIndex].width || 120;

      return new DataDenHeaderCell(value, colIndex, rowIndex, left, width, this.#options, order);
    });

    return new DataDenHeaderRow(rowIndex, headerCells, this.#options);
  }

  #createDataRows(rowsData: any): DataDenRow[] {
    return rowsData.map((rowData: any, rowIndex: number) => {
      const cells = Object.entries(rowData).map(([, value], colIndex) => {
        const orderedColIndex = this.#columnsOrder.length ? this.#columnsOrder.indexOf(colIndex) : colIndex;
        const left = this.#orderedColumns.slice(0, orderedColIndex).reduce((acc, curr) => acc + (curr.width || 120), 0);
        const width = this.#orderedColumns[orderedColIndex].width || 120;

        return new DataDenCell(value, colIndex, rowIndex, left, width, this.#options);
      });

      return new DataDenRow(rowIndex, cells, this.#options);
    });
  }

  #publishFetchStart() {
    DataDenPubSub.publish('command:fetch:start', {
      caller: this,
      context: new Context('command:fetch:start'),
    });
  }

  renderTable(): void {
    const grid = this.#renderGrid();

    grid.appendChild(this.#renderHeader());
    grid.appendChild(this.#renderBody());

    if (this.#paginationRenderer) {
      grid.appendChild(this.#paginationRenderer.getGui());
    }

    this.#container.appendChild(grid);
    this.#calculateGridSize();
  }

  #calculateGridSize(): void {
    const grid = this.#container.querySelector(`.${this.#options.cssPrefix}grid`) as HTMLElement;
    const header = this.#container.querySelector(`.${this.#options.cssPrefix}header`) as HTMLElement;
    const body = this.#container.querySelector(`.${this.#options.cssPrefix}grid-rows`) as HTMLElement;

    const gridWidth = this.#orderedColumns.reduce((acc, curr) => acc + (curr.width || 120), 0);
    const rowsHeight = this.#options.rowHeight * this.#rows.length;

    grid.style.width = `${gridWidth}px`;
    header.style.width = `${gridWidth}px`;
    body.style.width = `${gridWidth}px`;
    body.style.height = `${rowsHeight}px`;
  }

  #renderGrid(): HTMLElement {
    const grid = document.createElement('div');
    grid.classList.add(`${this.#options.cssPrefix}grid`);

    return grid;
  }

  #renderHeader(): HTMLElement {
    const headerContainer = document.createElement('div');
    headerContainer.classList.add(`${this.#options.cssPrefix}header`);
    headerContainer.setAttribute('role', 'rowgroup');

    const headerRow = this.#headerRow.render();
    headerContainer.appendChild(headerRow);

    return headerContainer;
  }

  #renderEditor(e: MouseEvent): HTMLElement {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'SPAN') return;

    const cellElement = target.parentElement;
    const rowIndex = Number(cellElement.getAttribute('rowIndex'));
    const clickedColIdx = Number(cellElement.getAttribute('colIndex'));

    const cols: Element[] = [];

    if (this.#options.rowEditMode) {
      cols.push(...document.querySelectorAll(`[rowIndex="${rowIndex}"]`));
    } else {
      cols.push(cellElement);
    }
    cols.forEach((col: any) => {
      const colIndex = Number(col.getAttribute('colIndex'));
      const column = this.#rows[rowIndex].cells[colIndex];
      const editable = this.#defaultColumns[colIndex].editable;
      if ((typeof editable === `function` && !editable()) || editable === false) return;

      col.replaceChildren(column.editor.getGui());
      if (clickedColIdx === colIndex) {
        const inputElement = col.children[0] as HTMLInputElement;
        inputElement.select();
      }

      col.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          cols.forEach((col: any) => {
            if (col.children[0].value === undefined) return;
            const span = document.createElement('span');
            span.innerText = col.children[0].value;
            col.replaceChildren(span);
          });
        }
      });
    });
  }

  #renderBody(): HTMLElement {
    const rowContainer = document.createElement('div');
    rowContainer.classList.add(`${this.#options.cssPrefix}grid-rows`);
    rowContainer.addEventListener('dblclick', (e: MouseEvent) => this.#renderEditor(e));
    rowContainer.setAttribute('role', 'rowgroup');

    const rows = document.createDocumentFragment();
    this.#rows.forEach((row) => rows.appendChild(row.render()));
    rowContainer.appendChild(rows);

    return rowContainer;
  }

  #subscribeToEvents(): void {
    DataDenPubSub.subscribe('info:dragging:columns-reorder:done', (event: DataDenEvent) => {
      this.#columnsOrder = event.data.columnsOrder;
      this.#orderedColumns = this.#columnsOrder.map((columnIndex) => this.#defaultColumns[columnIndex]);
    });
    DataDenPubSub.subscribe('info:resizing:start', (event: DataDenEvent) => {
      this.#orderedColumns[event.data.currentColIndex].width = event.data.newCurrentColWidth;
      this.#calculateGridSize();
    });
    DataDenPubSub.subscribe('command:editing:row-values-changed', (event: DataDenEvent) => {
      this.#updateColumnValue(event);
    });
  }

  #updateColumnValue(event: DataDenEvent): void {
    const data = event.data;
    const property = Object.keys(this.#options.rows[data.row])[data.column];
    this.#options.rows[data.row][property] = data.value;
  }

  #subscribeFetchDone(): void {
    DataDenPubSub.subscribe('info:fetch:done', (event: DataDenEvent) => {
      this.#updateRows(event);
    });
  }

  #updateRows(event: DataDenEvent): void {
    const { rows } = event.data;

    const rowsEl = document.createDocumentFragment();
    this.#rows = this.#createDataRows(rows);
    this.#rows.forEach((row) => rowsEl.appendChild(row.render()));

    const rowContainer = this.#container.querySelector(`.${this.#options.cssPrefix}grid-rows`)!;
    rowContainer.innerHTML = '';
    rowContainer.appendChild(rowsEl);
    this.#calculateGridSize();
  }
}
