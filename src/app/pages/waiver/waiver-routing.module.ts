import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaiverComponent } from './waiver.component';

const routes: Routes = [{ path: '', component: WaiverComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaiverRoutingModule { }
