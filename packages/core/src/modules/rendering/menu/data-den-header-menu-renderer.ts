import { createHtmlElement } from '../../../utils';
import { DataDenColDef } from '../../../data-den-options.interface';
import { DataDenPubSub } from '../../../data-den-pub-sub';
import { Context } from '../../../context';

export class DataDenHeaderMenuRenderer {
  toggler: HTMLElement;
  dropdown: HTMLElement;
  #cssPrefix: string;
  colDef: DataDenColDef;
  colIndex: number;

  constructor(cssPrefix: string, colDef: DataDenColDef, colIndex: number, private PubSub: DataDenPubSub) {
    this.#cssPrefix = cssPrefix;
    this.colDef = colDef;
    this.colIndex = colIndex;

    const template = `<button class="${this.#cssPrefix}header-menu-toggler">
      <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="100%" viewBox="0 0 16 16" fill="#000000" class="${
        this.#cssPrefix
      }header-menu-icon">
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
      </svg>
    </button>
    `;

    const dropdownTemplate = `<div class="${this.#cssPrefix}header-menu-dropdown">
      ${
        this.colDef.pinned
          ? `<a href="#" class="${this.#cssPrefix}header-menu-dropdown-item" ref="unPinColTrigger">Unpin</a>`
          : ''
      }
      ${
        this.colDef.pinned === 'right' || !this.colDef.pinned
          ? `<a href="#" class="${
              this.#cssPrefix
            }header-menu-dropdown-item" ref="pinLeftPinColTrigger">Pin to the left</a>`
          : ''
      }
      ${
        this.colDef.pinned === 'left' || !this.colDef.pinned
          ? `<a href="#" class="${
              this.#cssPrefix
            }header-menu-dropdown-item" ref="pinRightPinColTrigger">Pin to the right</a>`
          : ''
      }
    </div>`;

    this.toggler = createHtmlElement(template);
    this.dropdown = createHtmlElement(dropdownTemplate);

    this.#initDropdown();
  }

  #initDropdown() {
    this.toggler.addEventListener('click', () => {
      this.dropdown.classList.toggle('active');
    });

    const unPinTrigger = this.dropdown.querySelector('[ref="unPinColTrigger"]');
    const pinLeftTrigger = this.dropdown.querySelector('[ref="pinLeftPinColTrigger"]');
    const pinRightTrigger = this.dropdown.querySelector('[ref="pinRightPinColTrigger"]');

    unPinTrigger?.addEventListener('click', () => {
      this.PubSub.publish('command:pin-column:start', {
        pin: false,
        colIndex: this.colIndex,
        context: new Context('command:pin-column:start'),
      });
    });

    pinLeftTrigger?.addEventListener('click', () => {
      this.PubSub.publish('command:pin-column:start', {
        pin: 'left',
        colIndex: this.colIndex,
        context: new Context('command:pin-column:start'),
      });
    });

    pinRightTrigger?.addEventListener('click', () => {
      this.PubSub.publish('command:pin-column:start', {
        pin: 'right',
        colIndex: this.colIndex,
        context: new Context('command:pin-column:start'),
      });
    });
  }

  getGui(): HTMLElement {
    return this.toggler;
  }

  getDropdownGui(): HTMLElement {
    return this.dropdown;
  }

  destroy() {}
}
