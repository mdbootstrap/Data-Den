import { createHtmlElement, debounce, isSameDate, parseDate } from '../../../utils';
import { DataDenHeaderFilterRendererParams } from './data-den-header-filter-renderer-params.interface';
import { DataDenHeaderFilterRenderer } from './data-den-header-filter-renderer.interface';

export class DataDenHeaderDateFilterRenderer extends DataDenHeaderFilterRenderer {
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
          <input type="date" class="${this.#cssPrefix}header-filter-input" />
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
    return 'date';
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
    const options = this.params.colDef.filterOptions;

    return (state: any, value: any) => {
      const dateParserFn = options.dateParserFn;
      const method = state.method;
      const searchTermAsDate = parseDate(state.searchTerm);
      const valueAsDate = typeof value === 'string' ? dateParserFn(value) : value;

      switch (method) {
        case 'equals':
          return isSameDate(searchTermAsDate, valueAsDate);
        default:
          return false;
      }
    };
  }

  attachUiEvents(params: DataDenHeaderFilterRendererParams) {
    if (this.input) {
      const debounceFilter: () => void = debounce(() => params.filterChanged(), params.debounceTime);

      this.input.addEventListener('change', () => debounceFilter());
    }
  }

  destroy() {}
}
