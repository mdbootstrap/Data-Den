import { DataDenRenderingModuleConfig, DataDenRenderingService } from './modules/rendering';
import { DataDenPaginationService } from './modules/pagination';
import { DataDenFilteringService } from './modules/filtering';
import { DataDenSortingService } from './modules/sorting';
import { DataDenFetchService } from './modules/fetch';

export type DataDenConfig = {
  rendering: DataDenRenderingModuleConfig;
};

export class DataDen {
  private rendering: DataDenRenderingService = new DataDenRenderingService();
  private pagination: DataDenPaginationService = new DataDenPaginationService();
  private filtering: DataDenFilteringService = new DataDenFilteringService();
  private sorting: DataDenSortingService = new DataDenSortingService();
  private fetch: DataDenFetchService = new DataDenFetchService();

  constructor(config: DataDenConfig) {}
}
