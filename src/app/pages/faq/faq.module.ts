import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';


@NgModule({
  declarations: [FaqComponent],
  imports: [
    CommonModule,
    FaqRoutingModule,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    TranslateModule
  ]
})
export class FaqModule { }
