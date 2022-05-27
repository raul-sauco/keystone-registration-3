import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramOverviewRoutingModule } from './program-overview-routing.module';
import { ProgramOverviewComponent } from './program-overview.component';


@NgModule({
  declarations: [
    ProgramOverviewComponent
  ],
  imports: [
    CommonModule,
    ProgramOverviewRoutingModule
  ]
})
export class ProgramOverviewModule { }
