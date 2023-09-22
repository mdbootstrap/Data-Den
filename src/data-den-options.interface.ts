import { DataDenDataLoaderStrategy } from './modules/fetch';
import { DataDenCellRenderer } from './modules/rendering';

export type ClassType<T> = new (...args: any[]) => T;

export type DataDenMode = 'client' | 'server';

export interface DataDenFilterOptions {
  method: string;
  debounceTime: number;
  caseSensitive: boolean;
}

export interface DataDenColDef {
  field: string;
  headerName: string;
  sort: boolean;
  filter: boolean;
  filterOptions: DataDenFilterOptions;
  resize: boolean;
  width: number;
  cellRenderer: ClassType<DataDenCellRenderer>;
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
  dataLoader: DataDenDataLoaderStrategy;
  pagination: boolean;
  paginationOptions: DataDenPaginationOptions;
  quickFilter: boolean;
  quickFilterOptions: DataDenQuickFilterOptions;
}
