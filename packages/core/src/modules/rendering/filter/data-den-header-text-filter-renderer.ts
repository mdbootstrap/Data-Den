import { createHtmlElement, debounce } from '../../../utils';
import { DataDenHeaderFilterRendererParams } from './data-den-header-filter-renderer-params.interface';
import { DataDenHeaderFilterRenderer } from './data-den-header-filter-renderer.interface';

export class DataDenHeaderTextFilterRenderer extends DataDenHeaderFilterRenderer {
  element: HTMLElement;
  input: HTMLInputElement;
  params: DataDenHeaderFilterRendererParams;
  #cssPrefix: string;

  constructor(params: DataDenHeaderFilterRendererParams) {
    super();
    this.params = params;
    this.#cssPrefix = params.cssPrefix;

    const template =
      /* HTLM */
      `
      <div class="${this.#cssPrefix}header-filter">
        <input type="text" class="${this.#cssPrefix}header-filter-input">
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
    return 'text';
  }

  getState(): any {
    const value = this.input ? this.input.value : null;

    return {
      method: this.params.method,
      searchTerm: value,
    };
  }

  isActive(): boolean {
    const value = this.input ? this.input.value : null;

    return !!value;
  }

  getFilterFn(): (state: any, value: any) => boolean {
    const options = this.params.colDef.filterOptions;

    return (state: any, value: any) => {
      let searchTerm = state.searchTerm;
      const method = state.method;
      const caseSensitive = options.caseSensitive;
      value = caseSensitive ? value : value.toString().toLowerCase();
      searchTerm = caseSensitive ? searchTerm : searchTerm.toString().toLowerCase();

      switch (method) {
        case 'includes':
          return value.includes(searchTerm);
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
