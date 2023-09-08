import { Context } from '../../context';
import { DataDenEvent } from '../../data-den-event';
import { DataDenOptions } from '../../data-den-options.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenData } from './strategy';
import { DataDenDataLoaderStrategy } from './strategy/data-den-loader-strategy';

export class DataDenFetchService {
  #loader: DataDenDataLoaderStrategy;

  constructor(private options: DataDenOptions) {
    this.#loader = this.options.dataLoader;
    this.#subscribeFetchStart();
    this.#subscribeFetchSortedData();
  }

  #getData(): Promise<DataDenData> {
    const fetchOptions = {
      pagination: this.options.pagination,
    };

    return this.#loader.getData(fetchOptions);
  }

  #publishFetchDone(context: Context, data: DataDenData): void {
    DataDenPubSub.publish('info:fetch:done', {
      caller: this,
      context,
      data,
    });
  }

  #subscribeFetchStart(): void {
    DataDenPubSub.subscribe('command:fetch:start', (event: DataDenEvent) => {
      this.#getData().then((data: DataDenData) => {
        this.#publishFetchDone(event.context, data);
      });
    });
  }

  #subscribeFetchSortedData(): void {
    DataDenPubSub.subscribe('command:fetch:getSortedData', (event: DataDenEvent) => {
      this.#loader.sortData({
        context: event.context,
        field: event.data.field,
        order: event.data.order,
      });
    });
  }
}
