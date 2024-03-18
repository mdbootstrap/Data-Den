import { createHtmlElement } from '../../../utils';
import { DataDenHeaderFilterRendererParams } from './data-den-header-filter-renderer-params.interface';
import { DataDenHeaderFilterRenderer } from './data-den-header-filter-renderer.interface';

export class DataDenHeaderSelectFilterRenderer extends DataDenHeaderFilterRenderer {
  element: HTMLElement;
  select: HTMLSelectElement;
  params: DataDenHeaderFilterRendererParams;
  #cssPrefix: string;

  constructor(params: DataDenHeaderFilterRendererParams) {
    super();
    this.params = params;
    this.#cssPrefix = params.cssPrefix;

    const template =
      /* HTML */
      `
        <div class="${this.#cssPrefix}header-filter">
          <select class="${this.#cssPrefix}header-filter-select">
            <option selected value></option>
          </select>
        </div>
      `;

    this.element = createHtmlElement(template);
    this.select = this.element.querySelector(`.${this.#cssPrefix}header-filter-select`);

    this.#createSelectOptions(params);
    this.attachUiEvents(params);
  }

  #createSelectOptions(params: DataDenHeaderFilterRendererParams) {
    if (this.select) {
      const options = params.listOptions;
      const optionsFragment = document.createDocumentFragment();

      options.forEach((option) => {
        const optionEl = document.createElement('option');
        optionEl.label = option.label;
        optionEl.value = option.value;
        optionsFragment.appendChild(optionEl);
      });

      this.select.appendChild(optionsFragment);
    }
  }

  getGui(): HTMLElement {
    return this.element;
  }

  getType(): string {
    return 'select';
  }

  getState() {
    return {
      method: this.params.method,
      searchTerm: this.select.value,
    };
  }

  isActive(): boolean {
    const value = this.select.value;

    return !!value;
  }

  getFilterFn(): (state: any, value: any) => boolean {
    return (state: any, value: any) => {
      const method = state.method;
      value = value.toString().toLowerCase();

      switch (method) {
        case 'includes':
          return value.includes(state.searchTerm);
        case 'equals':
          return value === state.searchTerm;
        default:
          return false;
      }
    };
  }

  attachUiEvents(params: DataDenHeaderFilterRendererParams) {
    if (this.select) {
      this.select.addEventListener('change', () => {
        params.filterChanged();
      });
    }
  }

  destroy() { }
}
