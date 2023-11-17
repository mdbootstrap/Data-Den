import { DataDenColDef, DataDenListOption } from '../../../data-den-options.interface';

export interface DataDenHeaderFilterRendererParams {
  colDef: DataDenColDef;
  field: string;
  debounceTime: number;
  method: string;
  cssPrefix: string;
  listOptions: DataDenListOption[];
  filterChanged: () => void;
}
