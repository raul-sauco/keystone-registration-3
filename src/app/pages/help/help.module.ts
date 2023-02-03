import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MarkdownModule } from 'ngx-markdown';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { HelpRoutingModule } from './help-routing.module';
import { HelpComponent } from './help.component';

@NgModule({
  declarations: [HelpComponent],
  imports: [
    CommonModule,
    HelpRoutingModule,
    LoadingSpinnerContentModule,
    MarkdownModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    TranslateModule,
  ],
})
export class HelpModule {}
