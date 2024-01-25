import { DataDenCellRenderer } from '../cell';

export interface DataDenCellEditor extends DataDenCellRenderer {
  getGui(focus?: boolean): HTMLElement;
  destroy?(): void;
  afterUiAttached(): void;
  getValue(): any;
}
