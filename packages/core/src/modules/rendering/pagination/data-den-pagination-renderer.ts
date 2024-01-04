import { createHtmlElement } from '../../../utils';
import { DataDenPubSub } from '../../../data-den-pub-sub';
import { DataDenPaginationOptions } from '../../../data-den-options.interface';
import { Context } from '../../../context';

export class DataDenPaginationRenderer {
  element: HTMLElement;
  #cssPrefix: string;
  options: DataDenPaginationOptions;
  buttons: Record<string, HTMLButtonElement>;

  constructor(options: DataDenPaginationOptions, cssPrefix: string, private PubSub: DataDenPubSub) {
    this.options = options;
    this.#cssPrefix = cssPrefix;

    const template =
      /* HTML */
      `<div class="${this.#cssPrefix}pagination">
        <div class="${this.#cssPrefix}pagination-content">
          <button class="${this.#cssPrefix}pagination-button" ref="data-den-pagination-first-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="${this.#cssPrefix}pagination-button-svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
              />
            </svg>
          </button>
          <button class="${this.#cssPrefix}pagination-button" ref="data-den-pagination-prev-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="${this.#cssPrefix}pagination-button-svg"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div class="${this.#cssPrefix}pagination-info" ref="data-den-pagination-info">
            1-10 ${this.options.ofText || 'of'} 100
          </div>
          <button class="${this.#cssPrefix}pagination-button" ref="data-den-pagination-next-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="${this.#cssPrefix}pagination-button-svg"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          <button class="${this.#cssPrefix}pagination-button" ref="data-den-pagination-last-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="${this.#cssPrefix}pagination-button-svg"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>`;

    this.element = createHtmlElement(template);
    this.buttons = {
      first: this.element.querySelector('[ref=data-den-pagination-first-button]') as HTMLButtonElement,
      prev: this.element.querySelector('[ref=data-den-pagination-prev-button]') as HTMLButtonElement,
      next: this.element.querySelector('[ref=data-den-pagination-next-button]') as HTMLButtonElement,
      last: this.element.querySelector('[ref=data-den-pagination-last-button]') as HTMLButtonElement,
    };
    this.attachUiEvents();
    this.subscribeToEvents();
  }

  getGui(): HTMLElement {
    return this.element;
  }

  attachUiEvents(): void {
    this.buttons.first.addEventListener('click', () => {
      this.PubSub.publish('command:pagination:load-first-page:start', {
        context: new Context('command:pagination:load-first-page:start'),
      });
    });
    this.buttons.prev.addEventListener('click', () => {
      this.PubSub.publish('command:pagination:load-prev-page:start', {
        context: new Context('command:pagination:load-prev-page:start'),
      });
    });
    this.buttons.next.addEventListener('click', () => {
      this.PubSub.publish('command:pagination:load-next-page:start', {
        context: new Context('command:pagination:load-next-page:start'),
      });
    });
    this.buttons.last.addEventListener('click', () => {
      this.PubSub.publish('command:pagination:load-last-page:start', {
        context: new Context('command:pagination:load-last-page:start'),
      });
    });
  }

  destroy(): void {
    this.element.innerHTML = '';
    document.querySelector('.data-den-pagination')?.remove();
  }

  private subscribeToEvents(): void {
    this.PubSub.subscribe(
      'info:pagination:info-change:done',
      (event: { data: { firstRowIndex: number; lastRowIndex: number; allTotalRows: number; pageSize: number } }) => {
        this.updateInfo(event.data.firstRowIndex, event.data.lastRowIndex, event.data.allTotalRows);
        this.updateButtonsState(event.data.firstRowIndex, event.data.lastRowIndex, event.data.allTotalRows);
      }
    );
  }

  private updateButtonsState(firstRowIndex: number, lastRowIndex: number, allTotalRows: number): void {
    Object.values(this.buttons).forEach((button: HTMLButtonElement) => (button.disabled = false));

    if (firstRowIndex === 0) {
      this.buttons.first.disabled = true;
      this.buttons.prev.disabled = true;
    }

    if (lastRowIndex === allTotalRows) {
      this.buttons.next.disabled = true;
      this.buttons.last.disabled = true;
    }
  }

  private updateInfo(firstRowIndex: number, lastRowIndex: number, allTotalRows: number): void {
    const info = this.element.querySelector('[ref=data-den-pagination-info');
    info!.innerHTML = `${firstRowIndex + 1}-${lastRowIndex} ${this.options.ofText || 'of'} ${allTotalRows}`;
  }

  public updatePageSize(pageSize: number): void {
    this.PubSub.publish('info:pagination:page-size-change:done', {
      pageSize: pageSize,
      context: new Context('info:pagination:page-size-change:done'),
    });
  }
}
