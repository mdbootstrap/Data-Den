import {
  DataDenInternalOptions,
  DataDenPaginationOptions,
  DataDenQuickFilterOptions,
} from './data-den-options.interface';
import { DataDenDefaultCellRenderer } from './modules/rendering/cell';

const defaultPaginationOptions: Required<DataDenPaginationOptions> = {
  pageSize: 10,
  pageSizeOptions: [5, 10, 25],
  ofText: 'of',
};

const defaultQuickFilterFn = (searchTerm: any, value: any) => {
  searchTerm = searchTerm.toString().toLowerCase();
  value = value.toString().toLowerCase();

  return value.includes(searchTerm);
};

const defaultQuickFilterOptions: Required<DataDenQuickFilterOptions> = {
  filterFn: defaultQuickFilterFn,
};

export const defaultOptions: DataDenInternalOptions = {
  cssPrefix: 'data-den-',
  mode: 'client',
  columns: [],
  defaultColDef: {
    sort: false,
    filter: false,
    filterOptions: {
      type: 'text',
      method: 'includes',
      debounceTime: 500,
      caseSensitive: false,
    },
    resize: false,
    width: 200,
    cellRenderer: DataDenDefaultCellRenderer,
  },
  rows: [],
  draggable: false,
  pagination: false,
  paginationOptions: defaultPaginationOptions,
  quickFilterOptions: defaultQuickFilterOptions,
  resizable: false,
  rowHeight: 26,
};
