import { DataDenData, DataDenFetchOptions } from './data-den-data.interface';
import { DataDenDataLoaderStrategy } from './data-den-loader-strategy';

export class DataDenServerDataLoaderStrategy extends DataDenDataLoaderStrategy {
  filterData(params: { [key: string]: string | number | boolean }): Promise<any> {
    return fetch('jakis adres' + new URLSearchParams(params as any)).then((res) => res.json());
  }
  getData(options: DataDenFetchOptions): Promise<DataDenData> {
    return fetch('jakis adres' + new URLSearchParams(options as any)).then((res) => res.json());
  }
}
