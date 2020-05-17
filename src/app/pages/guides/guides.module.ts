import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuidesRoutingModule } from './guides-routing.module';
import { GuidesComponent } from './guides.component';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { MarkdownModule } from 'ngx-markdown';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';


@NgModule({
  declarations: [GuidesComponent],
  imports: [
    CommonModule,
    GuidesRoutingModule,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    MarkdownModule.forChild()
  ]
})
export class GuidesModule { }
