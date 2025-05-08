import {
  DataDenFetchOptions,
  DataDenFiltersOptions,
  DataDenGroupedOptions,
  DataDenPaginationOptions,
  DataDenQuickFilterOptions,
  DataDenSortOptions,
} from '../data-den-fetch-options.interface';

export abstract class DataDenDataLoaderStrategy {
  abstract getData(options: DataDenFetchOptions): Promise<any[]>;
  abstract filterData(data: any[], params: DataDenFiltersOptions): Promise<any[]>;
  abstract sortData(data: any[], params: DataDenSortOptions): Promise<any[]>;
  abstract quickFilterData(data: any[], params: DataDenQuickFilterOptions): Promise<any[]>;
  abstract paginateData(data: any[], params: DataDenPaginationOptions, groupedOptions: DataDenGroupedOptions): Promise<any[]>;
}
