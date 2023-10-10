import { Context } from '../../../context';
import { DataDenPubSub } from '../../../data-den-pub-sub';
import { createHtmlElement, debounce } from '../../../utils';
import { DataDenHeaderFilterChangeEvent } from './data-den-header-filter-change-event.interface';
import { DataDenHeaderFilterRendererParams } from './data-den-header-filter-renderer-params.interface';
import { DataDenHeaderFilterRenderer } from './data-den-header-filter-renderer.interface';

export class DataDenHeaderDateFilterRenderer extends DataDenHeaderFilterRenderer {
  element: HTMLElement;
  #cssPrefix: string;

  constructor(params: DataDenHeaderFilterRendererParams) {
    super();
    this.#cssPrefix = params.cssPrefix;

    const template = `
      <div class="${this.#cssPrefix}header-filter">
          <input type="date" class="${this.#cssPrefix}header-filter-input">
      </div>
    `;

    this.element = createHtmlElement(template);

    this.attachUiEvents(params);
  }

  getGui(): HTMLElement {
    return this.element;
  }

  getType(): string {
    return 'date';
  }

  attachUiEvents(params: DataDenHeaderFilterRendererParams) {
    const input: HTMLInputElement | null = this.element.querySelector(`.${this.#cssPrefix}header-filter-input`);

    if (input) {
      const debounceFilter: (searchTerm: any, params: DataDenHeaderFilterRendererParams) => void = debounce(
        this.filter.bind(this),
        params.debounceTime
      );

      input.addEventListener('change', () => debounceFilter(input.value, params));
    }
  }

  filter(searchTerm: any, params: DataDenHeaderFilterRendererParams): void {
    const context = new Context('info:filtering:header-filter-changed');
    const type = this.getType();
    const { field, method } = params;
    const filterChangeEvent: DataDenHeaderFilterChangeEvent = {
      context,
      field,
      type,
      method,
      searchTerm,
    };

    DataDenPubSub.publish('info:filtering:header-filter-changed', filterChangeEvent);
  }

  destroy() {}
}
