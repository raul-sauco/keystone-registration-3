import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentUploadProofComponent } from './payment-upload-proof.component';

describe('PaymentUploadProofComponent', () => {
  let component: PaymentUploadProofComponent;
  let fixture: ComponentFixture<PaymentUploadProofComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentUploadProofComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentUploadProofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
