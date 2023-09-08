import { Context } from '../../../context';
import { DataDenPubSub } from '../../../data-den-pub-sub';
import { createHtmlElement, debounce } from '../../../utils';
import { DataDenHeaderFilterChangeEvent } from './data-den-header-filter-change-event.interface';
import { DataDenHeaderFilterRendererParams } from './data-den-header-filter-renderer-params.interface';
import { DataDenHeaderFilterRenderer } from './data-den-header-filter-renderer.interface';

export class DataDenHeaderTextFilterRenderer extends DataDenHeaderFilterRenderer {
  element: HTMLElement;

  constructor(params: DataDenHeaderFilterRendererParams) {
    super();

    const template = `<div class="data-den-header-filter"><input type="text" class="data-den-header-filter-input"></div>`;

    this.element = createHtmlElement(template);

    this.attachUiEvents(params);
  }

  getGui(): HTMLElement {
    return this.element;
  }

  getType(): string {
    return 'text';
  }

  attachUiEvents(params: DataDenHeaderFilterRendererParams) {
    const input: HTMLInputElement | null = this.element.querySelector('.data-den-header-filter-input');

    if (input) {
      const debounceFilter: (searchTerm: any, params: DataDenHeaderFilterRendererParams) => void = debounce(
        this.filter.bind(this),
        params.debounceTime
      );

      input.addEventListener('keyup', () => debounceFilter(input.value, params));
    }
  }

  filter(searchTerm: any, params: DataDenHeaderFilterRendererParams): void {
    const context = new Context('info:filtering:header-filter-changed');
    const type = this.getType();
    const { field, method, caseSensitive } = params;
    const filterChangeEvent: DataDenHeaderFilterChangeEvent = {
      context,
      field,
      type,
      method,
      searchTerm,
      caseSensitive,
    };

    DataDenPubSub.publish('info:filtering:header-filter-changed', filterChangeEvent);
  }

  destroy() {}
}
