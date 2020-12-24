import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';

@NgModule({
  declarations: [FaqComponent],
  imports: [CommonModule, FaqRoutingModule, TranslateModule],
})
export class FaqModule {}
