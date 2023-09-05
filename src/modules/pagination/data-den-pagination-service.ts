import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenPaginationOptions } from '../../data-den-options.interface';
import { Context } from '../../context';

export class DataDenPaginationService {
  #data: any[];
  #options: DataDenPaginationOptions;
  #currentPage: number;
  #pageSize: number;

  constructor(options: DataDenPaginationOptions) {
    this.#data = [];
    this.#options = options;

    this.#currentPage = 0;
    this.#pageSize = this.#options.pageSize || 10;

    this.#subscribeToEvents();
  }

  init(data: any[]) {
    this.#data = data;
    this.#updateState();
  }

  #subscribeToEvents() {
    DataDenPubSub.subscribe('command:pagination:load-first-page:start', () => {
      this.#loadFirstPage();
    });
    DataDenPubSub.subscribe('command:pagination:load-prev-page:start', () => {
      this.#loadPrevPage();
    });
    DataDenPubSub.subscribe('command:pagination:load-next-page:start', () => {
      this.#loadNextPage();
    });
    DataDenPubSub.subscribe('command:pagination:load-last-page:start', () => {
      this.#loadLastPage();
    });
    DataDenPubSub.subscribe(
      'notification:pagination:page-size-change:done',
      (event: { data: { pageSize: number } }) => {
        this.#pageSize = event.data.pageSize;
        this.#currentPage = 0;
        this.#updateState();
      }
    );
  }

  #updateState(): void {
    const firstRow = this.#currentPage * this.#pageSize + 1;
    const lastRow = Math.min(this.#data.length, this.#currentPage * this.#pageSize + this.#pageSize);
    const allTotalRows = this.#data.length;

    this.#publishEvents(firstRow, lastRow, allTotalRows);
  }

  #publishEvents(firstRow: number, lastRow: number, allTotalRows: number) {
    DataDenPubSub.publish('notification:pagination:info-change:done', {
      firstRow,
      lastRow,
      allTotalRows,
      pageSize: this.#pageSize,
      context: new Context('notification:pagination:info-change:done'),
    });
    DataDenPubSub.publish('notification:pagination:data-change:done', {
      rows: this.#data.slice(firstRow - 1, lastRow),
      context: new Context('notification:pagination:data-change:done'),
    });
  }

  #loadFirstPage() {
    this.#currentPage = 0;
    this.#updateState();
  }

  #loadPrevPage() {
    if (this.#currentPage === 0) {
      return;
    }

    this.#currentPage--;
    this.#updateState();
  }

  #loadNextPage() {
    if (this.#currentPage * this.#pageSize + this.#pageSize >= this.#data.length) {
      return;
    }

    this.#currentPage++;
    this.#updateState();
  }

  #loadLastPage() {
    if (this.#data.length / this.#pageSize - 1 >= this.#data.length) {
      return;
    }

    this.#currentPage = Math.ceil(this.#data.length / this.#pageSize - 1);
    this.#updateState();
  }
}
