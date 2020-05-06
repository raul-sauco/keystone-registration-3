import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [
    CommonModule,
    PrivacyPolicyRoutingModule,
    LoadingSpinnerContentModule,
    MarkdownModule
  ]
})
export class PrivacyPolicyModule { }
