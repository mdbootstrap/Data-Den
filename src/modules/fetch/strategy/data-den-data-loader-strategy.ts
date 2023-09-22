import { DataDenData } from './data-den-data.interface';
import {
  DataDenFetchOptions,
  DataDenFiltersOptions,
  DataDenPaginationOptions,
  DataDenQuickFilterOptions,
  DataDenSortOptions,
} from '../data-den-fetch-options.interface';
import { DataDenRowDef } from '../../../data-den-options.interface';

export abstract class DataDenDataLoaderStrategy {
  abstract getData(options: DataDenFetchOptions): Promise<DataDenData>;
  abstract filterData(data: DataDenRowDef[], params: DataDenFiltersOptions): Promise<DataDenRowDef[]>;
  abstract sortData(data: DataDenRowDef[], params: DataDenSortOptions): Promise<DataDenRowDef[]>;
  abstract quickFilterData(data: DataDenRowDef[], params: DataDenQuickFilterOptions): Promise<DataDenRowDef[]>;
  abstract paginateData(data: DataDenRowDef[], params: DataDenPaginationOptions): Promise<DataDenRowDef[]>;
}
