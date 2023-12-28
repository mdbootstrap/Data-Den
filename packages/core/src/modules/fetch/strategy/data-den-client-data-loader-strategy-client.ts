import { DataDenDataLoaderStrategy } from './data-den-data-loader-strategy';
import {
  DataDenFetchOptions,
  DataDenFiltersOptions,
  DataDenPaginationOptions,
  DataDenQuickFilterOptions,
  DataDenSortOptions,
} from '../data-den-fetch-options.interface';
import { deepCopy } from '../../../utils';

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
      .then((sorted) => this.paginateData(sorted, options.paginationOptions));
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

  paginateData(rows: any[], paginationOptions: DataDenPaginationOptions | undefined): Promise<any[]> {
    if (!paginationOptions) {
      return Promise.resolve(rows);
    }

    const { firstRowIndex, lastRowIndex } = paginationOptions;

    const paginated = rows.slice(firstRowIndex, lastRowIndex);

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

    const { searchTerm, filterFn } = quickFilterOptions;

    const filtered = rows.filter((row) => {
      return filterFn(searchTerm, Object.values(row));
    });

    return Promise.resolve(filtered);
  }
}
