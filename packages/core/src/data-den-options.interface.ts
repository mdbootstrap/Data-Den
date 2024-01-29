import { DataDenCellRenderer, DataDenHeaderFilterRenderer } from './modules/rendering';

export type ClassType<T> = new (...args: any[]) => T;

export type DataDenMode = 'client' | 'server';

export interface DataDenHeaderFilterOptions {
  method?: string;
  caseSensitive?: boolean;
  debounceTime?: number;
  dateParserFn?: DataDenDateFilterParserFn;
  listOptions?: DataDenListOption[];
}

export type DataDenDateFilterParserFn = (value: string) => Date;

export type DataDenSortComparator = (valueA: any, valueB: any) => number;

export interface DataDenSortOptions {
  comparator: DataDenSortComparator;
}

export interface DataDenListOption {
  label: string;
  value: any;
}

export interface DataDenColDef {
  field: string;
  headerName?: string;
  sort?: boolean;
  sortOptions?: DataDenSortOptions;
  filter?: boolean;
  filterRenderer?: ClassType<DataDenHeaderFilterRenderer>;
  filterOptions?: DataDenHeaderFilterOptions;
  resize?: boolean;
  pinned?: 'left' | 'right';
  width?: number;
  cellRenderer?: ClassType<DataDenCellRenderer>;
}

export interface DataDenDefaultColDef {
  sort?: boolean;
  sortOptions?: DataDenSortOptions;
  filter?: boolean;
  filterRenderer?: ClassType<DataDenHeaderFilterRenderer>;
  filterOptions?: DataDenHeaderFilterOptions;
  resize?: boolean;
  width?: number;
  cellRenderer?: ClassType<DataDenCellRenderer>;
}

export interface DataDenPaginationOptions {
  pageSize?: number;
  ofText?: string;
}

export interface DataDenQuickFilterOptions {
  filterFn?: (params: DataDenActiveFilterParams) => boolean;
}

export interface DataDenActiveFilterParams {
  searchTerm: any;
  value: any;
  columns: DataDenColDef[];
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
  headerHeight?: number;
  multiSortKey?: 'shift' | 'ctrl';
  multiSort?: boolean;
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
  headerHeight: number;
  multiSortKey: 'shift' | 'ctrl';
  multiSort: boolean;
}
