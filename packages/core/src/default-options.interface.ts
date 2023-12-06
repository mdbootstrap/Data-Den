import {
  DataDenDateFilterParserFn,
  DataDenInternalOptions,
  DataDenPaginationOptions,
  DataDenQuickFilterOptions,
  DataDenSortComparator,
  DataDenSortOptions,
} from './data-den-options.interface';
import { DataDenHeaderTextFilterRenderer } from './modules/rendering';
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

const defaultDateParserFn: DataDenDateFilterParserFn = (dateString: string) => {
  const dateParts = dateString.split('/').map((part) => Number(part));
  const [day, month, year] = dateParts;

  return new Date(year, month - 1, day);
};

const defaultSortComparator: DataDenSortComparator = (fieldA, fieldB) => {
  if (typeof fieldA === 'string') {
    fieldA = fieldA.toLowerCase();
  }

  if (typeof fieldB === 'string') {
    fieldB = fieldB.toLowerCase();
  }

  if (fieldA === fieldB) {
    return 0;
  }

  return fieldA > fieldB ? 1 : -1;
};

const defaultSortOptions: Required<DataDenSortOptions> = {
  comparator: defaultSortComparator,
};

export const defaultOptions: DataDenInternalOptions = {
  cssPrefix: 'data-den-',
  mode: 'client',
  columns: [],
  defaultColDef: {
    sort: false,
    sortOptions: defaultSortOptions,
    filter: false,
    filterRenderer: DataDenHeaderTextFilterRenderer,
    filterOptions: {
      method: 'includes',
      debounceTime: 500,
      caseSensitive: false,
      dateParserFn: defaultDateParserFn,
      listOptions: [],
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
