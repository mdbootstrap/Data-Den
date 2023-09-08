import { DataDenDataLoaderStrategy } from './modules/fetch';
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

export interface DataDenOptions {
  dataLoader: DataDenDataLoaderStrategy;
  pagination: boolean;
  paginationOptions: DataDenPaginationOptions;
  quickFilter: boolean;
  quickFilterOptions: DataDenQuickFilterOptions;
}
