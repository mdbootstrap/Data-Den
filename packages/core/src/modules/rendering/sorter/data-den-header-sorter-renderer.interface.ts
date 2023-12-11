export abstract class DataDenHeaderSorterRenderer {
  abstract getGui(): HTMLElement;
  abstract destroy?(): void;
}
