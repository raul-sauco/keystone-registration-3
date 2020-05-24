import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripCodesComponent } from './trip-codes.component';

describe('TripCodesComponent', () => {
  let component: TripCodesComponent;
  let fixture: ComponentFixture<TripCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
