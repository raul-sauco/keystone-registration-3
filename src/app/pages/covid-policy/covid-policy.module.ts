import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { CovidPolicyRoutingModule } from './covid-policy-routing.module';
import { CovidPolicyComponent } from './covid-policy.component';

@NgModule({
  declarations: [CovidPolicyComponent],
  imports: [
    CommonModule,
    CovidPolicyRoutingModule,
    LoadingSpinnerContentModule,
    MarkdownModule,
  ],
})
export class CovidPolicyModule {}
