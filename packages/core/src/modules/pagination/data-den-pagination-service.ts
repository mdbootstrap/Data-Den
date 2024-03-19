import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenInternalOptions, DataDenPaginationOptions } from '../../data-den-options.interface';
import { Context } from '../../context';
import { DataDenEvent } from '../../data-den-event';

export class DataDenPaginationService {
  #options: DataDenPaginationOptions;
  #currentPage: number;
  #pageSize: number;
  #allTotalRows: number;

  constructor(options: DataDenInternalOptions, private PubSub: DataDenPubSub) {
    this.#options = options.paginationOptions;

    this.#currentPage = 0;
    this.#allTotalRows = 0;
    this.#pageSize = this.#options.pageSize || 10;

    this.#subscribeToEvents();
  }

  #subscribeToEvents() {
    this.PubSub.subscribe('command:pagination:load-first-page:start', () => {
      this.#loadFirstPage();
    });
    this.PubSub.subscribe('command:pagination:load-prev-page:start', () => {
      this.#loadPrevPage();
    });
    this.PubSub.subscribe('command:pagination:load-next-page:start', () => {
      this.#loadNextPage();
    });
    this.PubSub.subscribe('command:pagination:load-last-page:start', () => {
      this.#loadLastPage();
    });
    this.PubSub.subscribe('command:group:update', () => {
      this.#allTotalRows = 0;
    });
    this.PubSub.subscribe('info:pagination:page-size-change:done', (event: { data: { pageSize: number } }) => {
      this.#pageSize = event.data.pageSize;
      this.#currentPage = 0;
      this.#updateState();
    });
    this.PubSub.subscribe('info:fetch:done', (event: DataDenEvent) => {
      const rows = event.data.rows;
      const length = Object.keys(rows).length;

      if (this.#allTotalRows || this.#allTotalRows === length) {
        return;
      }

      this.#allTotalRows = length;
      this.#updateState();
    });
  }

  #updateState(): void {
    const firstRowIndex = this.#currentPage * this.#pageSize;
    const lastRowIndex = Math.min(this.#allTotalRows, this.#currentPage * this.#pageSize + this.#pageSize);

    this.#publishEvents(firstRowIndex, lastRowIndex, this.#allTotalRows);
  }

  #publishEvents(firstRowIndex: number, lastRowIndex: number, allTotalRows: number) {
    this.PubSub.publish('info:pagination:info-change:done', {
      firstRowIndex,
      lastRowIndex,
      allTotalRows,
      pageSize: this.#pageSize,
      context: new Context('info:pagination:info-change:done'),
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
    if (this.#currentPage * this.#pageSize + this.#pageSize >= this.#allTotalRows) {
      return;
    }

    this.#currentPage++;
    this.#updateState();
  }

  #loadLastPage() {
    if (this.#allTotalRows / this.#pageSize - 1 >= this.#allTotalRows) {
      return;
    }

    this.#currentPage = Math.ceil(this.#allTotalRows / this.#pageSize - 1);
    this.#updateState();
  }
}
