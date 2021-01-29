import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccommodationComponent } from './accommodation.component';

const routes: Routes = [{ path: '', component: AccommodationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccommodationRoutingModule {}
