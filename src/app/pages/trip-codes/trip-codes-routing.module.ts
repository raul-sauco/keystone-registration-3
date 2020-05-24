import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripCodesComponent } from './trip-codes.component';

const routes: Routes = [{ path: '', component: TripCodesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripCodesRoutingModule { }
