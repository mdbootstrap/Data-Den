import { DataDenColDef } from '../../../data-den-options.interface';

export interface DataDenData<TData = any> {
  rows: TData[];
  columns: DataDenColDef[];
}
