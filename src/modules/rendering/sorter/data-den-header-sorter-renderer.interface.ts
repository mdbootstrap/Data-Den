export abstract class DataDenHeaderSorterRenderer {
  abstract getGui(): HTMLElement;
  abstract destroy?(): void;
  protected sort(params: any): void {
    console.log(params);
  }
}
