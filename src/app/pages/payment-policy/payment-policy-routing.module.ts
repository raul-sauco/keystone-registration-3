import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentPolicyComponent } from './payment-policy.component';

const routes: Routes = [{ path: '', component: PaymentPolicyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentPolicyRoutingModule {}
