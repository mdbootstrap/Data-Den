import { DataDenHeaderFilterRendererParams } from './data-den-header-filter-renderer-params.interface';

export abstract class DataDenHeaderFilterRenderer {
  abstract getGui(): HTMLElement;
  abstract destroy?(): void;
  abstract getType(): string;
  protected filter(searchTerm: any, params: DataDenHeaderFilterRendererParams): void {
    console.log(params);
  }
}
