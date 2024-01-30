import { DataDenCellRenderer } from '../cell';

export interface DataDenCellEditor extends DataDenCellRenderer {
  getGui(): HTMLElement;
  getValue(): any;
  destroy?(): void;
  afterUiRender?(): void;
}
