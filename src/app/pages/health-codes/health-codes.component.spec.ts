import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCodesComponent } from './health-codes.component';

describe('HealthCodesComponent', () => {
  let component: HealthCodesComponent;
  let fixture: ComponentFixture<HealthCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthCodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
