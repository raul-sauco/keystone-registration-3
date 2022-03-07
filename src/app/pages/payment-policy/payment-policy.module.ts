import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { PaymentPolicyRoutingModule } from './payment-policy-routing.module';
import { PaymentPolicyComponent } from './payment-policy.component';

@NgModule({
  declarations: [PaymentPolicyComponent],
  imports: [
    CommonModule,
    LoadingSpinnerContentModule,
    MarkdownModule,
    PaymentPolicyRoutingModule,
  ],
})
export class PaymentPolicyModule {}
