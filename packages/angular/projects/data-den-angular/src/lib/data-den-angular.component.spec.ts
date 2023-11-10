import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDenAngularComponent } from './data-den-angular.component';

describe('DataDenAngularComponent', () => {
  let component: DataDenAngularComponent;
  let fixture: ComponentFixture<DataDenAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataDenAngularComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDenAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
