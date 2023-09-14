import { DataDenCellRenderer } from './modules/rendering';

export type DataDenMode = 'client' | 'server';

export interface DataDenFilterOptions {
  method: string;
  debounceTime: number;
  caseSensitive: boolean;
}

export interface DataDenColDef {
  field: string;
  headerName: string;
  sort?: boolean;
  filter?: boolean;
  filterOptions: DataDenFilterOptions;
  resize?: boolean;
  width?: number;
  cellRenderer?: DataDenCellRenderer;
}

export interface DataDenPaginationOptions {
  pageSize?: number;
  pageSizeOptions?: number[];
  ofText?: string;
}

export interface DataDenQuickFilterOptions {
  debounceTime: number;
  filterFn?: (searchTerm: any, value: any) => boolean;
}

export interface DataDenOptions<TData = any> {
  mode: DataDenMode;
  columns: DataDenColDef[];
  draggable?: boolean;
  resizable?: boolean;
  rows: TData[];
  pagination: boolean;
  paginationOptions: DataDenPaginationOptions;
  quickFilter: boolean;
  quickFilterOptions: DataDenQuickFilterOptions;
}
