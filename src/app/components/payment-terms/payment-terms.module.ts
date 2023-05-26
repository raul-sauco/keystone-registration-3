import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

import { PaymentTermsComponent } from './payment-terms.component';

@NgModule({
  declarations: [PaymentTermsComponent],
  imports: [CommonModule, MarkdownModule],
})
export class PaymentTermsModule {}
