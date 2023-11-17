import { createHtmlElement, debounce } from '../../../utils';
import { DataDenHeaderFilterRendererParams } from './data-den-header-filter-renderer-params.interface';
import { DataDenHeaderFilterRenderer } from './data-den-header-filter-renderer.interface';

export class DataDenHeaderNumberFilterRenderer extends DataDenHeaderFilterRenderer {
  element: HTMLElement;
  input: HTMLInputElement;
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
          <input type="number" class="${this.#cssPrefix}header-filter-input" />
        </div>
      `;

    this.element = createHtmlElement(template);
    this.input = this.element.querySelector(`.${this.#cssPrefix}header-filter-input`);

    this.attachUiEvents(params);
  }

  getGui(): HTMLElement {
    return this.element;
  }

  getType(): string {
    return 'number';
  }

  getState(): any {
    const value = this.input.value;

    return {
      method: this.params.method,
      searchTerm: value,
    };
  }

  isActive(): boolean {
    const value = this.input.value;

    return !!value;
  }

  getFilterFn(): (state: any, value: any) => boolean {
    return (state: any, value: any) => {
      const method = state.method;
      const searchTermAsNumber = Number(state.searchTerm);
      const valueAsNumber = Number(value);

      switch (method) {
        case 'equals':
          return valueAsNumber === searchTermAsNumber;
        default:
          return false;
      }
    };
  }

  attachUiEvents(params: DataDenHeaderFilterRendererParams) {
    if (this.input) {
      const debounceFilter: () => void = debounce(() => params.filterChanged(), params.debounceTime);

      this.input.addEventListener('keyup', () => debounceFilter());
    }
  }

  destroy() {}
}
