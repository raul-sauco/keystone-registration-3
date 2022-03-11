import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripSwitcherComponent } from './trip-switcher.component';

const routes: Routes = [{ path: '', component: TripSwitcherComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripSwitcherRoutingModule {}
