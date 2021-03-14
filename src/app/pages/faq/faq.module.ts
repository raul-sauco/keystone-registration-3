import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { TranslateModule } from '@ngx-translate/core';

import { LoadingSpinnerContentModule } from './../../components/loading-spinner-content/loading-spinner-content.module';
import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';

@NgModule({
  declarations: [FaqComponent],
  imports: [
    CommonModule,
    FaqRoutingModule,
    LoadingSpinnerContentModule,
    MarkdownModule,
    TranslateModule,
  ],
})
export class FaqModule {}
