import { Context } from '../../../context';
import { DataDenPubSub } from '../../../data-den-pub-sub';
import { createHtmlElement } from '../../../utils';
import { DataDenHeaderFilterChangeEvent } from './data-den-header-filter-change-event.interface';
import { DataDenHeaderFilterRendererParams } from './data-den-header-filter-renderer-params.interface';
import { DataDenHeaderFilterRenderer } from './data-den-header-filter-renderer.interface';

export class DataDenHeaderSelectFilterRenderer extends DataDenHeaderFilterRenderer {
  element: HTMLElement;
  #cssPrefix: string;

  constructor(params: DataDenHeaderFilterRendererParams) {
    super();
    this.#cssPrefix = params.cssPrefix;

    const template =
      /* HTML */
      `
        <div class="${this.#cssPrefix}header-filter">
          <select class="${this.#cssPrefix}header-filter-select">
            <option disabled selected value></option>
          </select>
        </div>
      `;

    this.element = createHtmlElement(template);

    this.#createSelectOptions(params);
    this.attachUiEvents(params);
  }

  #createSelectOptions(params: DataDenHeaderFilterRendererParams) {
    const select: HTMLSelectElement | null = this.element.querySelector(`.${this.#cssPrefix}header-filter-select`);

    if (select) {
      const options = params.listOptions;
      const optionsFragment = document.createDocumentFragment();

      options.forEach((option) => {
        const optionEl = document.createElement('option');
        optionEl.label = option.label;
        optionEl.value = option.value;
        optionsFragment.appendChild(optionEl);
      });

      select.appendChild(optionsFragment);
    }
  }

  getGui(): HTMLElement {
    return this.element;
  }

  getType(): string {
    return 'select';
  }

  attachUiEvents(params: DataDenHeaderFilterRendererParams) {
    const select: HTMLSelectElement | null = this.element.querySelector(`.${this.#cssPrefix}header-filter-select`);

    if (select) {
      select.addEventListener('change', (event: any) => {
        this.filter(event.target.value, params);
      });
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
