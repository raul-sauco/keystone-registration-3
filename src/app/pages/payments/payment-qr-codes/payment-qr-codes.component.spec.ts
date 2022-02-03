import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentQrCodesComponent } from './payment-qr-codes.component';

describe('PaymentQrCodesComponent', () => {
  let component: PaymentQrCodesComponent;
  let fixture: ComponentFixture<PaymentQrCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentQrCodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentQrCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
