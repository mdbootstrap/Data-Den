import { createHtmlElement } from '../../../utils';

export class DataDenQuickFilterRenderer {
  element: HTMLElement;

  constructor() {
    const template = `<div class="data-den-quick-filter"><input type="text" class="data-den-quick-filter-input"></div>`;

    this.element = createHtmlElement(template);
  }

  getGui(): HTMLElement {
    return this.element;
  }

  attachUiEvents(): void {}

  destroy(): void {}
}
