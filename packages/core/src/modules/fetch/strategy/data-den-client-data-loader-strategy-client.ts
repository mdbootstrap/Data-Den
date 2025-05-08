import { DataDenDataLoaderStrategy } from './data-den-data-loader-strategy';
import {
  DataDenFetchOptions,
  DataDenFiltersOptions,
  DataDenGroupedOptions,
  DataDenPaginationOptions,
  DataDenQuickFilterOptions,
  DataDenSortOptions,
} from '../data-den-fetch-options.interface';
import { deepCopy, groupRows } from '../../../utils';

export class DataDenClientDataLoaderStrategy extends DataDenDataLoaderStrategy {
  #data: any[];

  constructor(data: any[]) {
    super();

    this.#data = data;
  }

  getData(options: DataDenFetchOptions): Promise<any[]> {

    return this.filterData(deepCopy(this.#data), options.filtersOptions)
      .then((filtered) => this.quickFilterData(filtered, options.quickFilterOptions))
      .then((quickFiltered) => this.sortData(quickFiltered, options.sortingOptions))
      .then((sorted) => this.groupData(sorted, options.groupedOptions))
      .then((grouped) => this.paginateData(grouped, options.paginationOptions, options.groupedOptions))
  }

  groupData(rows: any[], groupedOptions: DataDenGroupedOptions | undefined): Promise<any[]> {
    if (!groupedOptions) {
      return Promise.resolve(rows);
    }

    const groups = groupedOptions.groupedColumns.map((column) => column.group);

    const grouped = groupRows(rows, groups);

    return Promise.resolve(grouped);
  }

  filterData(rows: any[], filtersOptions: DataDenFiltersOptions | undefined): Promise<any[]> {
    if (!filtersOptions) {
      return Promise.resolve(rows);
    }

    const headers = Object.keys(filtersOptions.filters);
    const filtered = headers.reduce((res, header) => {
      return res.filter((row: any) => {
        const filterFn = filtersOptions.filters[header].filterFn;
        const state = filtersOptions.filters[header].state;
        const value = row[header];

        return filterFn(state, value);
      });
    }, rows);

    return Promise.resolve(filtered);
  }

  paginateData(rows: any[], paginationOptions: DataDenPaginationOptions | undefined, groupedOptions: DataDenGroupedOptions | undefined): Promise<any> {
    if (!paginationOptions) {
      return Promise.resolve(rows);
    }

    const { firstRowIndex, lastRowIndex } = paginationOptions;

    const paginated = (groupedOptions ? Object.fromEntries(
      Object.entries(rows).slice(firstRowIndex, lastRowIndex)
    ) : rows.slice(firstRowIndex, lastRowIndex));

    return Promise.resolve(paginated);
  }

  sortData(rows: any[], sortOptions: DataDenSortOptions | undefined): Promise<any[]> {
    if (!sortOptions) {
      return Promise.resolve(rows);
    }

    const { sortFn, activeSorters } = sortOptions;

    const sorted = sortFn(rows, activeSorters);

    return Promise.resolve(sorted);
  }

  quickFilterData(rows: any[], quickFilterOptions: DataDenQuickFilterOptions | undefined): Promise<any[]> {
    if (!quickFilterOptions) {
      return Promise.resolve(rows);
    }

    const { searchTerm, filterFn, columns } = quickFilterOptions;

    const filtered = rows.filter((row) => {
      return filterFn({
        searchTerm,
        value: Object.values(row),
        columns,
      });
    });

    return Promise.resolve(filtered);
  }
}
