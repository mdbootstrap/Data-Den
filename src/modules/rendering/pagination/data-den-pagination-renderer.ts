import { createHtmlElement } from '../../../utils';

export class DataDenPaginationRenderer {
  element: HTMLElement;

  constructor() {
    const template =
      /* HTML */
      `<div class="data-den-pagination">
        <div class="data-den-pagination-info"></div>
        <div class="data-den-pagination-buttons">
          <button class="data-den-pagination-first-button">First</button>
          <button class="data-den-pagination-prev-button">Prev</button>
          <button class="data-den-pagination-next-button">Next</button>
          <button class="data-den-pagination-last-button">Last</button>
        </div>
      </div>`;

    this.element = createHtmlElement(template);
  }

  getGui(): HTMLElement {
    return this.element;
  }

  attachUiEvents(): void {}

  destroy(): void {}
}
