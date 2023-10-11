import { DataDenCellRenderer } from '../cell';

export interface DataDenCellEditor extends DataDenCellRenderer {
  getGui(): HTMLElement;
  destroy?(): void;
  setValue: (value: any) => any;
  parseValue: (value: any) => any;
}
