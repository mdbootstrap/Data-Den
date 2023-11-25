import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { DataDen, DataDenOptions, DataDenSortingEvent } from 'data-den-core';

@Component({
  selector: 'data-den-angular',
  template: ``,
  styles: [],
})
export class DataDenAngularComponent implements OnInit {
  @Input() options: DataDenOptions = { columns: [] };

  @Output() sortingStart: EventEmitter<DataDenSortingEvent> = new EventEmitter();

  grid!: DataDen;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {}

  get host(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.grid = new DataDen(this.host, this.options);
    });

    this.grid.on('sortingStart', (event: DataDenSortingEvent) => {
      this.sortingStart.emit(event);
    });
  }
}
