import { DataDenDataLoaderStrategy } from './modules/fetch';
import { DataDenCellRenderer } from './modules/rendering';

export type ClassType<T> = new (...args: any[]) => T;

export type DataDenMode = 'client' | 'server';

export type DataDenHeaderFilterOptions =
  | DataDenTextFilterOptions
  | DataDenNumberFilterOptions
  | DataDenDateFilterOptions;

export type DataDenTextFilterMethod = 'includes';

export type DataDenNumberFilterMethod = 'equals';

export type DataDenDateFilterMethod = 'equals';

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

export interface DataDenColDef {
  field: string;
  headerName: string;
  sort?: boolean;
  filter?: boolean;
  filterOptions: DataDenHeaderFilterOptions;
  resize?: boolean;
  width?: number;
  cellRenderer?: ClassType<DataDenCellRenderer>;
}

export interface DataDenRowDef<TData = any> {
  [key: string]: TData;
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

export interface DataDenOptions {
  cssPrefix?: string;
  columns: DataDenColDef[];
  dataLoader: DataDenDataLoaderStrategy;
  draggable?: boolean;
  pagination: boolean;
  paginationOptions: DataDenPaginationOptions;
  quickFilter: boolean;
  quickFilterOptions: DataDenQuickFilterOptions;
  resizable?: boolean;
}
