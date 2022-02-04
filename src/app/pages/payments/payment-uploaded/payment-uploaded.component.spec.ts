import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentUploadedComponent } from './payment-uploaded.component';

describe('PaymentUploadedComponent', () => {
  let component: PaymentUploadedComponent;
  let fixture: ComponentFixture<PaymentUploadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentUploadedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentUploadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
