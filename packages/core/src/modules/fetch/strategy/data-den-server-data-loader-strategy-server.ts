import { DataDenDataLoaderStrategy } from './data-den-data-loader-strategy';
import {
  DataDenFetchOptions,
  DataDenFiltersOptions,
  DataDenPaginationOptions,
  DataDenQuickFilterOptions,
  DataDenSortOptions,
} from '../data-den-fetch-options.interface';

export class DataDenServerDataLoaderStrategy extends DataDenDataLoaderStrategy {
  getData(options: DataDenFetchOptions): Promise<any[]> {
    return fetch('url' + new URLSearchParams(options as any)).then((res) => res.json());
  }
  sortData(data: any[], sortOptions: DataDenSortOptions): Promise<any[]> {
    return fetch('url' + new URLSearchParams(sortOptions as any)).then((res) => res.json());
  }
  filterData(data: any[], filtersOptions: DataDenFiltersOptions): Promise<any[]> {
    return fetch('url' + new URLSearchParams(filtersOptions as any)).then((res) => res.json());
  }
  quickFilterData(data: any[], quickFilterOptions: DataDenQuickFilterOptions): Promise<any[]> {
    return fetch('url' + new URLSearchParams(quickFilterOptions as any)).then((res) => res.json());
  }
  paginateData(data: any[], paginationOptions: DataDenPaginationOptions): Promise<any[]> {
    return fetch('url' + new URLSearchParams(paginationOptions as any)).then((res) => res.json());
  }
}
