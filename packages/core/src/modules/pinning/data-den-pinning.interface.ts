import { DataDenColDef } from '../../data-den-options.interface';

export interface DataDenPinningEvent {
  name: string;
  pin: string | boolean;
  colIndex: number;
  columns: DataDenColDef[];
  preventDefault: () => void;
  defaultPrevented: boolean;
}
