import { DataDenData } from '../../../data-den-data.interface';
import { DataDenDataLoaderStrategy } from './data-den-data-loader-strategy';
import {
  DataDenFetchOptions,
  DataDenFiltersOptions,
  DataDenPaginationOptions,
  DataDenQuickFilterOptions,
  DataDenSortOptions,
} from '../data-den-fetch-options.interface';

export class DataDenServerDataLoaderStrategy extends DataDenDataLoaderStrategy {
  getData(options: DataDenFetchOptions): Promise<DataDenData> {
    return fetch('url' + new URLSearchParams(options as any)).then((res) => res.json());
  }
  sortData(data: DataDenData['rows'], sortOptions: DataDenSortOptions): Promise<DataDenData['rows']> {
    return fetch('url' + new URLSearchParams(sortOptions as any)).then((res) => res.json());
  }
  filterData(data: DataDenData['rows'], filtersOptions: DataDenFiltersOptions): Promise<DataDenData['rows']> {
    return fetch('url' + new URLSearchParams(filtersOptions as any)).then((res) => res.json());
  }
  quickFilterData(
    data: DataDenData['rows'],
    quickFilterOptions: DataDenQuickFilterOptions
  ): Promise<DataDenData['rows']> {
    return fetch('url' + new URLSearchParams(quickFilterOptions as any)).then((res) => res.json());
  }
  paginateData(data: DataDenData['rows'], paginationOptions: DataDenPaginationOptions): Promise<DataDenData['rows']> {
    return fetch('url' + new URLSearchParams(paginationOptions as any)).then((res) => res.json());
  }
}
