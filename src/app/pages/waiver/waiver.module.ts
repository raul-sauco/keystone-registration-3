import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WaiverRoutingModule } from './waiver-routing.module';
import { WaiverComponent } from './waiver.component';


@NgModule({
  declarations: [WaiverComponent],
  imports: [
    CommonModule,
    WaiverRoutingModule
  ]
})
export class WaiverModule { }
