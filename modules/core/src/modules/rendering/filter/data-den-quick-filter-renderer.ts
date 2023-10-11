import { Context } from '../../../context';
import { DataDenPubSub } from '../../../data-den-pub-sub';
import { createHtmlElement, debounce } from '../../../utils';
import { DataDenQuickFilterChangeEvent } from './data-den-quick-filter-change-event.interface';
import { DataDenQuickFilterParams } from './data-den-quick-filter-params.interface';

export class DataDenQuickFilterRenderer {
  element: HTMLElement;
  #cssPrefix: string;

  constructor(params: DataDenQuickFilterParams) {
    this.#cssPrefix = params.cssPrefix;
    const template = `
      <div class="${this.#cssPrefix}quick-filter">
        <input type="text" class="${this.#cssPrefix}quick-filter-input">
      </div>
    `;

    this.element = createHtmlElement(template);

    this.attachUiEvents(params);
  }

  getGui(): HTMLElement {
    return this.element;
  }

  attachUiEvents(params: DataDenQuickFilterParams): void {
    const input: HTMLInputElement | null = this.element.querySelector(`.${this.#cssPrefix}quick-filter-input`);

    if (input) {
      const debounceFilter: (searchTerm: any) => void = debounce(this.filter.bind(this), params.debounceTime);

      input.addEventListener('keyup', () => debounceFilter(input.value));
    }
  }

  filter(searchTerm: any) {
    const context = new Context('info:filtering:quick-filter-changed');
    const event: DataDenQuickFilterChangeEvent = {
      context,
      searchTerm,
    };

    DataDenPubSub.publish('info:filtering:quick-filter-changed', event);
  }

  destroy(): void {}
}
