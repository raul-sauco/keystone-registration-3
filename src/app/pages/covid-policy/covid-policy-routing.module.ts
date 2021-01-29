import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CovidPolicyComponent } from './covid-policy.component';

const routes: Routes = [{ path: '', component: CovidPolicyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CovidPolicyRoutingModule {}
