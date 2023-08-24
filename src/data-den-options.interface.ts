import { DataDenCellRenderer } from './modules/rendering';

export type DataDenMode = 'client' | 'server';

export interface DataDenColDef {
  field: string;
  headerName: string;
  sort: boolean;
  filter: boolean;
  resize: boolean;
  width: number;
  cellRenderer: DataDenCellRenderer;
}

export interface DataDenPaginationOptions {
  pageSize: number;
}

export interface DataDenQuickFilterOptions {
  debounceTime: number;
}

export interface DataDenOptions<TData = any> {
  mode: DataDenMode;
  columns: DataDenColDef[];
  rows: TData[];
  pagination: boolean;
  paginationOptions: DataDenPaginationOptions;
  quickFilter: boolean;
  quickFilterOptions: DataDenQuickFilterOptions;
}
