import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenPaginationOptions } from '../../data-den-options.interface';
import { Context } from '../../context';
import { DataDenEvent } from '../../data-den-event';

export class DataDenPaginationService {
  #options: DataDenPaginationOptions;
  #currentPage: number;
  #pageSize: number;
  #allTotalRows: number;

  constructor(options: DataDenPaginationOptions) {
    this.#options = options;

    this.#currentPage = 0;
    this.#allTotalRows = 0;
    this.#pageSize = this.#options.pageSize || 10;

    this.#subscribeToEvents();
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
    DataDenPubSub.subscribe('info:pagination:page-size-change:done', (event: { data: { pageSize: number } }) => {
      this.#pageSize = event.data.pageSize;
      this.#currentPage = 0;
      this.#updateState();
    });
    DataDenPubSub.subscribe('info:fetch:done', (event: DataDenEvent) => {
      if (this.#allTotalRows || this.#allTotalRows === event.data.data.rows.length) {
        return;
      }
      this.#allTotalRows = event.data.data.rows.length;
      this.#updateState();
    });
  }

  #updateState(): void {
    const firstRowIndex = this.#currentPage * this.#pageSize;
    const lastRowIndex = Math.min(this.#allTotalRows, this.#currentPage * this.#pageSize + this.#pageSize);

    this.#publishEvents(firstRowIndex, lastRowIndex, this.#allTotalRows);
  }

  #publishEvents(firstRowIndex: number, lastRowIndex: number, allTotalRows: number) {
    DataDenPubSub.publish('info:pagination:info-change:done', {
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
