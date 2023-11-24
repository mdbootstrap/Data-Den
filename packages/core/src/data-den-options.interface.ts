import { DataDenCellRenderer } from './modules/rendering';

export type ClassType<T> = new (...args: any[]) => T;

export type DataDenMode = 'client' | 'server';

export type DataDenHeaderFilterOptions =
  | DataDenTextFilterOptions
  | DataDenNumberFilterOptions
  | DataDenDateFilterOptions
  | DataDenSelectFilterOptions;

export type DataDenTextFilterMethod = 'includes';

export type DataDenNumberFilterMethod = 'equals';

export type DataDenDateFilterMethod = 'equals';

export type DataDenSelectFilterMethod = 'includes' | 'equals';

export type DataDenDateFilterParserFn = (value: string) => Date;

export interface DataDenTextFilterOptions {
  type: 'text';
  method: DataDenTextFilterMethod;
  debounceTime: number;
  caseSensitive: boolean;
}

export interface DataDenNumberFilterOptions {
  type: 'number';
  method: DataDenNumberFilterMethod;
  debounceTime: number;
}

export interface DataDenDateFilterOptions {
  type: 'date';
  method: DataDenDateFilterMethod;
  debounceTime: number;
  dateParserFn: DataDenDateFilterParserFn;
}

export interface DataDenSelectFilterOptions {
  type: 'select';
  method: DataDenSelectFilterMethod;
  debounceTime: number;
  listOptions: DataDenListOption[];
}

export interface DataDenListOption {
  label: string;
  value: any;
}

export interface DataDenColDef {
  field: string;
  headerName?: string;
  sort?: boolean;
  filter?: boolean;
  filterOptions?: DataDenHeaderFilterOptions;
  resize?: boolean;
  width?: number;
  cellRenderer?: ClassType<DataDenCellRenderer>;
}

export interface DataDenDefaultColDef {
  sort?: boolean;
  filter?: boolean;
  filterOptions?: DataDenHeaderFilterOptions;
  resize?: boolean;
  width?: number;
  cellRenderer?: ClassType<DataDenCellRenderer>;
}

export interface DataDenPaginationOptions {
  pageSize?: number;
  pageSizeOptions?: number[];
  ofText?: string;
}

export interface DataDenQuickFilterOptions {
  filterFn?: (searchTerm: any, value: any) => boolean;
}

export interface DataDenOptions<TData = any> {
  cssPrefix?: string;
  mode?: DataDenMode;
  columns: DataDenColDef[];
  defaultColDef?: DataDenDefaultColDef;
  rows?: TData;
  draggable?: boolean;
  pagination?: boolean;
  paginationOptions?: DataDenPaginationOptions;
  quickFilterOptions?: DataDenQuickFilterOptions;
  rowHeight?: number;
}

export interface DataDenInternalOptions {
  cssPrefix: string;
  mode: DataDenMode;
  columns: DataDenColDef[];
  defaultColDef: Required<DataDenDefaultColDef>;
  rows?: any;
  draggable: boolean;
  pagination: boolean;
  paginationOptions: Required<DataDenPaginationOptions>;
  quickFilterOptions: Required<DataDenQuickFilterOptions>;
  resizable: boolean;
  rowHeight: number;
}
