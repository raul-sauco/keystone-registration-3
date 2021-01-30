import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

import { HelpRoutingModule } from './help-routing.module';
import { HelpComponent } from './help.component';

@NgModule({
  declarations: [HelpComponent],
  imports: [CommonModule, HelpRoutingModule, MatCardModule, TranslateModule],
})
export class HelpModule {}
