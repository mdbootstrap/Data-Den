import { DataDenData } from './data-den-data.interface';
import { DataDenDataLoaderStrategy } from './data-den-data-loader-strategy';
import {
  DataDenFetchOptions,
  DataDenFiltersOptions,
  DataDenPaginationOptions,
  DataDenQuickFilterOptions,
  DataDenSortOptions,
} from '../data-den-fetch-options.interface';

export class DataDenClientDataLoaderStrategy extends DataDenDataLoaderStrategy {
  #data: DataDenData;

  constructor(data: DataDenData) {
    super();

    this.#data = data;
  }

  getData(options: DataDenFetchOptions): Promise<DataDenData> {
    const data = { columns: [...this.#data.columns], rows: [...this.#data.rows] };

    return this.filterData(data.rows, options.filtersOptions)
      .then((filtered) => this.quickFilterData(filtered, options.quickFilterOptions))
      .then((quickFiltered) => this.sortData(quickFiltered, options.sortingOptions))
      .then((sorted) => this.paginateData(sorted, options.paginationOptions))
      .then((paginated) => (data.rows = paginated))
      .then(() => Promise.resolve(data));
  }

  filterData(
    rows: DataDenData['rows'],
    filtersOptions: DataDenFiltersOptions | undefined
  ): Promise<DataDenData['rows']> {
    if (!filtersOptions) {
      return Promise.resolve(rows);
    }

    const headers = Object.keys(filtersOptions.filters);
    let filtered = rows;
    headers.forEach((header) => {
      filtered = filtered.filter((row) => {
        const filterFn = filtersOptions.filters[header].filterFn;
        const searchTerm = filtersOptions.filters[header].searchTerm;
        const value = row[header];

        return filterFn(searchTerm, value);
      });
    });

    return Promise.resolve(filtered);
  }

  paginateData(
    rows: DataDenData['rows'],
    paginationOptions: DataDenPaginationOptions | undefined
  ): Promise<DataDenData['rows']> {
    if (!paginationOptions) {
      return Promise.resolve(rows);
    }

    const { firstRowIndex, lastRowIndex } = paginationOptions;

    const paginated = rows.slice(firstRowIndex, lastRowIndex);

    return Promise.resolve(paginated);
  }

  sortData(rows: DataDenData['rows'], sortOptions: DataDenSortOptions | undefined): Promise<DataDenData['rows']> {
    if (!sortOptions) {
      return Promise.resolve(rows);
    }

    const { field, order, sortFn } = sortOptions;

    const sorted = sortFn(rows, field, order);

    return Promise.resolve(sorted);
  }

  quickFilterData(
    rows: DataDenData['rows'],
    quickFilterOptions: DataDenQuickFilterOptions | undefined
  ): Promise<DataDenData['rows']> {
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
