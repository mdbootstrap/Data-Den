import { createHtmlElement } from '../../../utils';
import { DataDenHeaderResizerRenderer } from './data-den-header-resizer-renderer.interface';
import { DataDenPubSub } from '../../../data-den-pub-sub';
import { Context } from '../../../context';
import { DataDenColDef } from '../../../data-den-options.interface';

export class DataDenHeaderDefaultResizerRenderer extends DataDenHeaderResizerRenderer {
  element: HTMLElement;
  #cssPrefix: string;
  private PubSub: DataDenPubSub;
  #isPinnedRight: boolean;

  constructor(cssPrefix: string, colDef: DataDenColDef) {
    super();

    this.#cssPrefix = cssPrefix;
    this.#isPinnedRight = colDef.pinned === 'right';

    const template = `<div class="${this.#cssPrefix}header-resizer ${
      this.#isPinnedRight ? this.#cssPrefix + 'header-resizer-left' : ''
    }"></div>`;

    this.element = createHtmlElement(template);
    this.element.addEventListener('mousedown', this.#onMouseDown.bind(this));
    document.addEventListener('mousemove', this.#resize.bind(this));
    document.addEventListener('mouseup', this.#onMouseUp.bind(this));
  }

  getGui(): HTMLElement {
    return this.element;
  }

  destroy() {}

  #onMouseDown(event: MouseEvent): void {
    event.stopPropagation();

    this.PubSub.publish('info:resizing:mousedown', {
      target: event.target,
      isPinnedRight: this.#isPinnedRight,
      context: new Context('info:resizing:mousedown'),
    });
  }

  #onMouseUp(): void {
    this.PubSub.publish('info:resizing:mouseup', {
      context: new Context('info:resizing:mouseup'),
    });
  }

  #resize(event: MouseEvent): void {
    this.PubSub.publish('command:resizing:start', {
      event,
      context: new Context('command:resizing:start'),
    });
  }
}
