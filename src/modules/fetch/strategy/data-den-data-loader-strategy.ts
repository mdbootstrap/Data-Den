import { DataDenData } from './data-den-data.interface';
import {
  DataDenFetchOptions,
  DataDenFiltersOptions,
  DataDenPaginationOptions,
  DataDenQuickFilterOptions,
  DataDenSortOptions,
} from '../data-den-fetch-options.interface';

export abstract class DataDenDataLoaderStrategy {
  abstract getData(options: DataDenFetchOptions): Promise<DataDenData>;
  abstract filterData(data: DataDenData['rows'], params: DataDenFiltersOptions): Promise<DataDenData['rows']>;
  abstract sortData(data: DataDenData['rows'], params: DataDenSortOptions): Promise<DataDenData['rows']>;
  abstract quickFilterData(data: DataDenData['rows'], params: DataDenQuickFilterOptions): Promise<DataDenData['rows']>;
  abstract paginateData(data: DataDenData['rows'], params: DataDenPaginationOptions): Promise<DataDenData['rows']>;
}
