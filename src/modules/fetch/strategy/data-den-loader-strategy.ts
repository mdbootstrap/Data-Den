import { DataDenData, DataDenFetchOptions } from './data-den-data.interface';

export abstract class DataDenDataLoaderStrategy {
  abstract filterData(params: { [key: string]: string | number | boolean }): Promise<DataDenData>;
  abstract getData(options: DataDenFetchOptions): Promise<DataDenData>;
  abstract sortData(params: { [key: string]: string | number | boolean }): Promise<DataDenData>;
}
