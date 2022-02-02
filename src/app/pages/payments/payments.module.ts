import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MarkdownModule } from 'ngx-markdown';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';
import { PaymentTermsComponent } from './payment-terms/payment-terms.component';
import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './payments.component';

const routes: Routes = [{ path: '', component: PaymentsComponent }];

@NgModule({
  declarations: [PaymentsComponent, PaymentTermsComponent],
  imports: [
    CommonModule,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    MarkdownModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    PaymentsRoutingModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
})
export class PaymentsModule {}
