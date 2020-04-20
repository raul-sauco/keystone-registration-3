import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackingListComponent } from './packing-list.component';

const routes: Routes = [{ path: '', component: PackingListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackingListRoutingModule { }
