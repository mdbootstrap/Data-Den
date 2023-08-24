import { createHtmlElement } from '../../../utils';
import { DataDenHeaderFilterRenderer } from './data-den-header-filter-renderer.interface';

export class DataDenHeaderTextFilterRenderer implements DataDenHeaderFilterRenderer {
  element: HTMLElement;

  constructor() {
    const template = `<div class="data-den-header-filter"><input type="text" class="data-den-header-filter-input"></div>`;

    this.element = createHtmlElement(template);
  }

  getGui(): HTMLElement {
    return this.element;
  }

  filter(): void {}
}
