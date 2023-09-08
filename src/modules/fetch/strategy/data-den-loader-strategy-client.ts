import { DataDenPubSub } from '../../../data-den-pub-sub';
import { DataDenData, DataDenFetchOptions, DataDenSortOptions } from './data-den-data.interface';
import { DataDenDataLoaderStrategy } from './data-den-loader-strategy';

export class DataDenClientDataLoaderStrategy extends DataDenDataLoaderStrategy {
  constructor(private data: DataDenData) {
    super();
  }

  filterData(params: { [key: string]: string | number | boolean }): Promise<any> {
    const filtered = this.data.rows.filter(() =>
      Object.entries(params).every(([key, value]) => key in params && value === params[key])
    );

    return Promise.resolve(filtered);
  }

  sortData(options: DataDenSortOptions): Promise<any> {
    let sorted: any[] = [];
    DataDenPubSub.subscribe('info:sorting:done', (event) => {
      sorted = event.data.rows;
    });

    DataDenPubSub.publish('command.sorting.start', {
      caller: this,
      context: options.context,
      field: options.field,
      order: options.order,
      rows: this.data.rows,
    });

    console.log(sorted);

    return Promise.resolve(sorted);
  }

  getData(options: DataDenFetchOptions): Promise<DataDenData> {
    if (options.sortOptions) {
      // paginacja
    }
    return Promise.resolve(this.data);
  }
}
