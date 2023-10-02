import { DataDenData } from '../../../data-den-data.interface';
import { DataDenDataLoaderStrategy } from './data-den-data-loader-strategy';
import {
  DataDenFetchOptions,
  DataDenFiltersOptions,
  DataDenPaginationOptions,
  DataDenQuickFilterOptions,
  DataDenSortOptions,
} from '../data-den-fetch-options.interface';
import { deepCopy } from '../../../utils';
import { DataDenRowDef } from '../../../data-den-options.interface';

export class DataDenClientDataLoaderStrategy extends DataDenDataLoaderStrategy {
  #data: DataDenData;

  constructor(data: DataDenData) {
    super();

    this.#data = data;
  }

  getData(options: DataDenFetchOptions): Promise<DataDenData> {
    return this.filterData(deepCopy(this.#data.rows), options.filtersOptions)
      .then((filtered) => this.quickFilterData(filtered, options.quickFilterOptions))
      .then((quickFiltered) => this.sortData(quickFiltered, options.sortingOptions))
      .then((sorted) => this.paginateData(sorted, options.paginationOptions))
      .then((paginated) => ({
        columns: deepCopy(this.#data.columns),
        rows: paginated,
      }));
  }

  filterData(rows: DataDenRowDef[], filtersOptions: DataDenFiltersOptions | undefined): Promise<DataDenRowDef[]> {
    if (!filtersOptions) {
      return Promise.resolve(rows);
    }

    const headers = Object.keys(filtersOptions.filters);
    const filtered = headers.reduce((res, header) => {
      return res.filter((row: any) => {
        const filterFn = filtersOptions.filters[header].filterFn;
        const searchTerm = filtersOptions.filters[header].searchTerm;
        const value = row[header];

        return filterFn(searchTerm, value);
      });
    }, rows);

    return Promise.resolve(filtered);
  }

  paginateData(
    rows: DataDenRowDef[],
    paginationOptions: DataDenPaginationOptions | undefined
  ): Promise<DataDenRowDef[]> {
    if (!paginationOptions) {
      return Promise.resolve(rows);
    }

    const { firstRowIndex, lastRowIndex } = paginationOptions;

    const paginated = rows.slice(firstRowIndex, lastRowIndex);

    return Promise.resolve(paginated);
  }

  sortData(rows: DataDenRowDef[], sortOptions: DataDenSortOptions | undefined): Promise<DataDenRowDef[]> {
    if (!sortOptions) {
      return Promise.resolve(rows);
    }

    const { field, order, sortFn } = sortOptions;

    const sorted = sortFn(rows, field, order);

    return Promise.resolve(sorted);
  }

  quickFilterData(
    rows: DataDenRowDef[],
    quickFilterOptions: DataDenQuickFilterOptions | undefined
  ): Promise<DataDenRowDef[]> {
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
