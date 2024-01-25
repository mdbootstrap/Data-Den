import { DataDenCellRenderer } from '../cell';

export interface DataDenCellEditor extends DataDenCellRenderer {
  getGui(): HTMLElement;
  destroy?(): void;
  afterUiRender?(): void;
  getValue(): any;
}
